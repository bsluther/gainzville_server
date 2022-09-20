const express = require("express")
const { pipe } = require("ramda")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities, findEntity, insertEntity } = require("../database/dbOps")
const { nameQuery, transformQuery, idsQuery } = require("../utility/fns")

const facetTemplatesRouter = express.Router()

facetTemplatesRouter.get("/", checkJwt, (req, res) => {
  const queryObj = pipe(
    transformQuery(idsQuery)("ids"),
    transformQuery(nameQuery)("name")
  )(req.query)
  
  findEntities("facet_template")(queryObj)
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