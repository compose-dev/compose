import { v4 as uuid } from "uuid";

class Csrf {
  private static generate() {
    return uuid();
  }

  private static set(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  private static get(key: string) {
    return localStorage.getItem(key);
  }

  static clear(key: string) {
    localStorage.removeItem(key);
  }

  static generateAndSet(key: string) {
    const token = this.generate();
    this.set(key, token);
    return token;
  }

  static validate(key: string, token: string): boolean {
    const storedToken = this.get(key);

    if (storedToken !== token) {
      return false;
    }

    return true;
  }
}

export { Csrf };
