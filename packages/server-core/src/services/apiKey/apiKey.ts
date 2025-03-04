import crypto from "crypto";

const KEY_PREFIX = {
  PROD: "ck_prod_",
  DEV: "ck_dev_",
};

const DEV_ENCRYPTION_ALGORITHM = "aes-256-gcm";

/**
 * ApiKey is a class that provides methods for generating, verifying, and
 * decrypting API keys.
 *
 * It provides both one way and two way hashing of API keys.
 *
 * One way hash is used to verify API keys without exposing the secret key,
 * it is recommended to use this for any production use-cases.
 *
 * Two way hash is used to decrypt API keys in a reversible manner, useful
 * for development when usability is preferred over security.
 *
 * PROD SECRET KEY should be 64 bytes (128 hex characters)
 * DEV SECRET KEY should be 32 bytes (64 hex characters).
 */
class ApiKey {
  private readonly PROD_SECRET_KEY: string;
  private readonly DEV_SECRET_KEY: Buffer;

  constructor() {
    const prodSecretKey = process.env.PROD_API_KEY_SECRET;
    const devSecretKey = process.env.DEV_API_KEY_SECRET;

    if (!prodSecretKey) {
      throw new Error("PROD_API_KEY_SECRET is not set");
    }

    if (!devSecretKey) {
      throw new Error("DEV_API_KEY_SECRET or DEV_API_KEY_IV is not set");
    }

    this.PROD_SECRET_KEY = prodSecretKey;
    this.DEV_SECRET_KEY = Buffer.from(devSecretKey, "hex");

    // private methods
    this.generatePlaintext = this.generatePlaintext.bind(this);
    this.generateTwoWayHash = this.generateTwoWayHash.bind(this);
    this.generateProductionKey = this.generateProductionKey.bind(this);
    this.generateDevelopmentKey = this.generateDevelopmentKey.bind(this);

    // public methods
    this.decryptTwoWayHash = this.decryptTwoWayHash.bind(this);
    this.generateOneWayHash = this.generateOneWayHash.bind(this);
    this.generate = this.generate.bind(this);
  }

  private generatePlaintext(IS_DEV: boolean) {
    const key = crypto.randomBytes(64).toString("hex");
    const prefix = IS_DEV ? KEY_PREFIX.DEV : KEY_PREFIX.PROD;
    return `${prefix}${key}`;
  }

  private generateTwoWayHash(plaintext: string) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
      DEV_ENCRYPTION_ALGORITHM,
      this.DEV_SECRET_KEY,
      iv
    );

    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
  }

  private generateProductionKey() {
    const plaintext = this.generatePlaintext(false);
    const hash = this.generateOneWayHash(plaintext);

    return { plaintext, oneWayHash: hash, twoWayHash: null };
  }

  private generateDevelopmentKey() {
    const plaintext = this.generatePlaintext(true);
    const oneWayHash = this.generateOneWayHash(plaintext);
    const twoWayHash = this.generateTwoWayHash(plaintext);

    return { plaintext, oneWayHash, twoWayHash };
  }

  decryptTwoWayHash(hash: string) {
    const [ivHex, encrypted, authTagHex] = hash.split(":");

    if (!ivHex || !encrypted || !authTagHex) {
      throw new Error("Invalid hash");
    }

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(
      DEV_ENCRYPTION_ALGORITHM,
      this.DEV_SECRET_KEY,
      iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");

    decrypted += decipher.final("utf8");

    return decrypted;
  }

  generateOneWayHash(plaintext: string) {
    return crypto
      .createHmac("sha256", this.PROD_SECRET_KEY)
      .update(plaintext)
      .digest("hex");
  }

  generate(type: "development" | "production") {
    if (type === "production") {
      return this.generateProductionKey();
    } else if (type === "development") {
      return this.generateDevelopmentKey();
    }

    throw new Error("Invalid key type");
  }
}

const apiKey = new ApiKey();

export { apiKey };
