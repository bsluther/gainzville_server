const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities } = require("../dbOps2")

const facetTemplatesRouter = express.Router()

facetTemplatesRouter.get("/", checkJwt, (req, res) => {
  findEntities("facet_template")({})
  .then(data => res.send(data))
})

module.exports = { facetTemplatesRouter }