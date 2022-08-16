const { expressjwt: jwt } = require("express-jwt")
const jwksRsa = require("jwks-rsa")

const domain = process.env.AUTH0_DOMAIN
const audience = process.env.AUTH0_AUDIENCE

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"]
})

const decodeJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
  credentialsRequired: false
})

module.exports = { checkJwt, decodeJwt }