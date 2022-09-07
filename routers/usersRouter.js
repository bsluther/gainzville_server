const express = require("express")
const { checkJwt } = require("../authz/checkJwt")
const { findEntity, findEntities, updateEntity, insertEntity } = require("../dbOps2")

const usersRouter = express.Router()

usersRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("user")({ _id: req.params.id })
  .then(data => res.send(data))
})

usersRouter.post("/", (req, res) => {
  const authString = req.headers.authorization ?? ""
  const secret = authString.slice(6)

  if (secret === process.env.AUTH0_POST_REGISTRATION_SECRET) {
    insertEntity("user")
                (req.body)
    .then(data => res.send(data))
  }

  else {
    res.status(401).send()
  }
})

usersRouter.get("/:id/libraries", checkJwt, (req, res) => {
  findEntity("user")({ _id: req.params.id })
  .then(userData => 
    findEntities("library")
                ({ id: { $in: userData?.libraries ?? [] } })
    .then(libs => res.send(libs))
  )
})

usersRouter.put("/:id", checkJwt, (req, res) => {
  updateEntity("user")(req.params.id)(req.body)
  .then(data => res.send(data))
})

module.exports = { usersRouter }