function parseCookieHeader(cookieHeader: string | undefined) {
  try {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
    });

    // Specific to remix, which base64 encodes the cookie value
    if ("compose-affiliate-code" in cookies) {
      const decodedString = Buffer.from(
        cookies["compose-affiliate-code"],
        "base64"
      ).toString("utf8");
      cookies["compose-affiliate-code"] = JSON.parse(decodedString);
    }

    return cookies;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export { parseCookieHeader };
