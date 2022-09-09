const express = require("express")
const { checkJwt, decodeJwt } = require("../authz/checkJwt")
const { deleteActivityInstance, getActivityInstance, insertActivityInstance } = require("../database/dbOps")
const { findEntities, findEntity, updateEntity, insertEntity, deleteEntity } = require("../database/dbOps")

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
    insertEntity("activity_instance")(req.body)
    .then(data => res.send(data))
  } else {
    res.status(401).send({ message: "Unauthorized" })
  }
})

activityInstancesRouter.delete("/:id", checkJwt, (req, res) => {
  findEntity("activity_instance")({ _id: req.params.id })
  .then(instance => {
      if (!instance) res.status(404).send({ message: "Delete failed: no instance found with that id" })
      else if (instance?.actor === req.auth.sub) {
        deleteEntity("activity_instance")({ _id: req.params.id })
        .then(data => res.send(data))
      } else {
        res.status(401).send({ message: "Unauthorized" })
      }
  })
})

activityInstancesRouter.put("/:id", checkJwt, (req, res) => {
  if (req.auth.sub === req.body.actor) {
    updateEntity("activity_instance")
                (req.params.id)
                ({ $set: req.body })
    .then(data => res.send(data))
  } else {
    res.status(400).send({ message: "Unauthorized" })
  }
})

module.exports = { activityInstancesRouter }