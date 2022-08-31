const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntities, findEntity, insertEntity } = require("../dbOps2")
const { ifElse } = require("ramda")

const typeTemplatesRouter = express.Router()


typeTemplatesRouter.get("/", checkJwt, (req, res) => {
  const searchParams = new URLSearchParams(req.query)
  
  const queryObj = ifElse(params => params.has("ids"))
  (params => ({
    id: { $in: params.get("ids").split(".") }
  }))
  (() => ({}))
  (searchParams)
  
  findEntities("type_template")
  (queryObj)
  .then(data => res.send(data))
})

typeTemplatesRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("type_template")
            ({ _id: req.params.id })
  .then(data => res.send(data))
})

typeTemplatesRouter.post("/", checkJwt, (req, res) => {
  insertEntity("type_template")
              (req.body)
  .then(data => res.send(data))
})


module.exports = typeTemplatesRouter