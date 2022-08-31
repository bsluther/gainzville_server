const express = require("express")
const { split, reduce, includes, ifElse, propOr, append, assoc } = require("ramda")
const { checkJwt, decodeJwt } = require("../authz/checkJwt")
const { findEntity, findEntities, replaceEntity, insertEntity } = require("../dbOps2")
const { csvToArray, isPublic, isAdmin } = require("../utility/fns")

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




const assignTruthy = (acc, [comparator, obj]) =>
  comparator
    ? Object.assign({}, acc, obj)
    : acc

// this might be overly clever:
// is the preferable behavior for the request to be rejected with status 401
// if /any/ part of it is unauthorized?
// the client may be surprised that some of the requested ids were not returned
librariesRouter.get("/", decodeJwt, (req, res) => {
  const ids = csvToArray(req.query.id ?? "")
  const userId = req.auth.sub
  // Need to firm this up: a request with a bracket in it crashes the server.

  // const queryObject = reduce(assignTruthy)
  //                           ({})
  //                           ([
  //                             [req.query.id, { _id: { $in: ids } }],
  //                             [req.query.user, { }]
  //                           ])

  if (Object.keys(req.query).length === 0) {
    findEntity("user")
              ({ _id: req.auth.sub })
    .then(userData =>
      findEntities("library")
                  ({ _id: { $in: userData.libraries } })
    ).then(libs => res.send(libs))

  } else {
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
  }
})

librariesRouter.put("/:id", checkJwt, (req, res) => {
  replaceEntity("library")(req.body)
  .then(data => res.send(data))
})

librariesRouter.post("/", checkJwt, (req, res) => {
  insertEntity("library")(req.body)
  .then(data => res.send(data))
})

module.exports = {
  librariesRouter
}