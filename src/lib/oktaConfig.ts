export const oktaConfig = {
    clientId: `0oaj271n2psYguEu15d7`,
    issuer: `https://dev-46617404.okta.com/oauth2/default`,
    redirectUri: `https://localhost:3000/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}