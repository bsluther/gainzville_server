const express = require("express")
const { findEntity } = require("../dbOps2")

const activityTemplatesRouter = express.Router()

activityTemplatesRouter.get("/:id", (req, res) => {
  findEntity("activity_template")({ _id: req.params.id })
  .then(data => res.send(data))
})

module.exports = { activityTemplatesRouter }