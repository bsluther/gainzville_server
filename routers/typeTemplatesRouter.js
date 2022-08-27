const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities } = require("../dbOps2")

const typeTemplatesRouter = express.Router()

typeTemplatesRouter.get("/", checkJwt, (req, res) => {
  findEntities("type_template")
              ({})
  .then(data => res.send(data))
})

module.exports = typeTemplatesRouter