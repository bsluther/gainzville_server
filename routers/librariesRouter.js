const express = require("express")
const { split, reduce, includes, ifElse, propOr, append } = require("ramda")
const { checkJwt, decodeJwt } = require("../authz/checkJwt")
const { findEntity, findEntities } = require("../dbOps2")

const librariesRouter = express.Router()


librariesRouter.get("/:id", decodeJwt, (req, res) => {
  findEntity("library")({ _id: req.params.id })
  .then(lib => {
    if (lib.isPublic) {
      res.send(lib)
    }
    else if (lib.admins.includes(req.auth?.sub)) {
      res.send(lib)
    }
    else {
      res.status(401).send({ message: "Unauthorized" })
    }
  })
})


const csvToArray = split(",")
const isPublic = propOr(false)("isPublic")
const isAdmin = userId => lib =>
  includes(userId)(lib.admins)

// this might be overly clever:
// is the preferable behavior for the request to be rejected with status 401
// if /any/ part of it is unauthorized?
// the client may be surprised that some of the requested ids were not returned
librariesRouter.get("/", decodeJwt, (req, res) => {
  const ids = csvToArray(req.query.id)
  const userId = req.auth.sub
  
  findEntities("library")
              ({ _id: { $in: ids } })
  .then(libs => 
    reduce((acc, lib) =>
              ifElse(lib => isPublic(lib) || isAdmin(userId)(lib))
                    (lib => append(lib)(acc))
                    (() => acc)
                    (lib))
          ([])
          (libs)
  )
  .then(data => res.send(data))
})

module.exports = {
  librariesRouter
}