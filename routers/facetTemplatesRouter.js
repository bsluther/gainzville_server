const express = require("express")
const { ifElse } = require("ramda")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities, findEntity, insertEntity } = require("../database/dbOps")

const facetTemplatesRouter = express.Router()

facetTemplatesRouter.get("/", checkJwt, (req, res) => {
  const searchParams = new URLSearchParams(req.query)
  
  const queryObj = ifElse(params => params.has("ids"))
                         (params => ({
                           id: { $in: params.get("ids").split(",") }
                         }))
                         (() => ({}))
                         (searchParams)

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