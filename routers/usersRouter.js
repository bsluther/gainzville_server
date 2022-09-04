const express = require("express")
const { reduce, union } = require("ramda")
const { checkJwt, decodeJwt } = require("../authz/checkJwt")
const { findEntity, findEntities, updateEntity, insertEntity } = require("../dbOps2")

const usersRouter = express.Router()

usersRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("user")({ _id: req.params.id })
  .then(data => res.send(data))
})

usersRouter.post("/", decodeJwt, (req, res) => {
  insertEntity("user")
              (req.body)
  .then(data => {
    console.log("DATA: ", data)
    console.log("BODY: ", req.body)
    return data
  })
  .then(data => res.send(data))
})

const collectAllElements = libs =>
  reduce((acc, lib) => union(acc)(lib.elements))
        ([])
        (libs)

usersRouter.get("/:id/libraries", checkJwt, (req, res) => {
  findEntity("user")({ _id: req.params.id })
  .then(userData => 
    findEntities("library")
                ({ id: { $in: userData.libraries } })
    .then(libs => res.send(libs))
  )
})

usersRouter.put("/:id", checkJwt, (req, res) => {
  updateEntity("user")(req.params.id)(req.body)
  .then(data => res.send(data))
})

module.exports = { usersRouter }