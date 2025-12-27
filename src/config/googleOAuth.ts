export const GOOGLE_OAUTH_CONFIG = {
    CLIENT_ID: "843860288394-noo6vtov5alrcf9u29dv0s8jcrf97245.apps.googleusercontent.com",
    REDIRECT_URI: "http://160.30.159.12:3000/auth/google/callback",
    AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
    SCOPES: ["openid", "email", "profile"],
    RESPONSE_TYPE: "code",
    ACCESS_TYPE: "offline",
    PROMPT: "consent"
};

export function getGoogleOAuthURL(): string {
    const params = new URLSearchParams({
        client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
        redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
        response_type: GOOGLE_OAUTH_CONFIG.RESPONSE_TYPE,
        scope: GOOGLE_OAUTH_CONFIG.SCOPES.join(" "),
        access_type: GOOGLE_OAUTH_CONFIG.ACCESS_TYPE,
        prompt: GOOGLE_OAUTH_CONFIG.PROMPT
    });

    return `${GOOGLE_OAUTH_CONFIG.AUTH_URL}?${params.toString()}`;
}