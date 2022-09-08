const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntity, insertEntity, replaceEntity, findEntities } = require("../database/dbOps")

const activityTemplatesRouter = express.Router()

activityTemplatesRouter.get("/", (req, res) => {
  const searchParams = new URLSearchParams(req.query)
  const nameParam = searchParams.get("name")
  const nameRegex = new RegExp(`${nameParam}`, "ig")

  findEntities('activity_template')
              ({
                $or: [
                  { name: { $regex: nameRegex } },
                  { aliases: { $regex: nameRegex }}
                ]
              })
  .then(data => res.send(data))
})

activityTemplatesRouter.get("/:id", (req, res) => {
  findEntity("activity_template")({ _id: req.params.id })
  .then(data => data ? res.send(data) : res.status(404).send())
})

activityTemplatesRouter.post("/", checkJwt, (req, res) => {
  if (req.auth?.sub === req.body?.createdBy) {
    insertEntity("activity_template")(req.body)
    .then(data => res.send(data))
  }
})

activityTemplatesRouter.put("/:id", checkJwt, (req, res) => {
  replaceEntity("activity_template")(req.body)
  .then(data => res.send(data))
})

module.exports = { activityTemplatesRouter }