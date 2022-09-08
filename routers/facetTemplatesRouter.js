const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities, findEntity, insertEntity } = require("../database/dbOps")

const facetTemplatesRouter = express.Router()

facetTemplatesRouter.get("/", checkJwt, (req, res) => {
  findEntities("facet_template")({})
  .then(data => res.send(data))
})

facetTemplatesRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("facet_template")({ _id: req.params.id })
  .then(data => res.send(data))
})

facetTemplatesRouter.post("/", checkJwt, (req, res) => {
  insertEntity("facet_template")
              (req.body)
  .then(data => res.send(data))
})

module.exports = { facetTemplatesRouter }