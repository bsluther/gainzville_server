const express = require("express")
const { checkJwt, decodeJwt } = require("../authz/checkJwt")

const { deleteActivityInstance, getActivityInstance, insertActivityInstance } = require("../dbOps")
const { findEntities, findEntity } = require("../dbOps2")

const activityInstancesRouter = express.Router()

activityInstancesRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("activity_instance")({ _id: req.params.id })
  .then(data => {
    if (!data) res.status(404).send({ message: "The requested Activity Instance could not be found" })
    else if (data.actor === req.auth.sub) {
      res.send(data)
    } else {
      res.status(401).send({ message: "Unauthorized "})
    }
  })
})

activityInstancesRouter.get("/actor/:userId", checkJwt, (req, res) => {
  if (req.auth.sub !== req.params.userId) {
    res.status(401).send({ message: "Unauthorized user." })
  }

  if (req.auth.sub === req.params.userId) {
    findEntities("activity_instance")({ actor: req.auth.sub })
    .then(data => res.send(data))
  }
})

activityInstancesRouter.post("/", checkJwt, (req, res) => {
  if (req.auth.sub === req.body.actor) {
    insertActivityInstance(req.body)
    .then(data => res.send(data))
  } else {
    res.status(401).send({ message: "Unauthorized" })
  }
})

activityInstancesRouter.delete("/:id", checkJwt, (req, res) => {
  getActivityInstance(req.params.id)
  .then(instance => {
      if (!instance) res.status(404).send({ message: "Delete failed: no instance found with that id" })
      else if (instance?.actor === req.auth.sub) {
        deleteActivityInstance(req.params.id)
        .then(data => res.send(data))
      } else {
        res.status(401).send({ message: "Unauthorized" })
      }
  })
})

module.exports = { activityInstancesRouter }