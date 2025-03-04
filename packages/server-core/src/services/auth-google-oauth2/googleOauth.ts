class GoogleOAuth {
  static async verifyAccessToken(token: string | string[] | undefined) {
    if (typeof token !== "string" || token.length === 0) {
      return {
        error: "Invalid access token",
        success: false,
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    const data = await response.json();

    if (response.status !== 200 || data.error) {
      return {
        error: data.error,
        success: false,
      };
    }

    return {
      data,
      success: true,
    };
  }

  static async getUserInfo(token: string) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
    );

    const data = await response.json();

    if (response.status !== 200 || data.error) {
      return {
        error: data.error,
        success: false,
      };
    }

    return {
      data,
      success: true,
    };
  }
}

export { GoogleOAuth };
