const { split, propOr, includes, ifElse, pipe, dissoc, identity, assoc } = require("ramda")

const csvToArray = split(",")
const isPublic = propOr(false)("isPublic")
const isAdmin = userId => lib =>
  includes(userId)(lib.admins)

const nameQuery = string => {
  const nameRegex = new RegExp(string, 'ig')

  return ({
    $or: [
      { name: { $regex: nameRegex } },
      { aliases: { $regex: nameRegex }}
    ]
  })
}

const idsQuery = idsString => ({
  id: { $in: idsString.split(",") }
})


const transformQuery = makeQuery => key => queryObj =>
  ifElse(queryObj => queryObj.hasOwnProperty(key))
        (queryObj => pipe(
          dissoc(key),
          obj => Object.assign({}, obj, makeQuery(queryObj[key]))
        )(queryObj))
        (identity)
        (queryObj)

  module.exports = {
    csvToArray,
    isPublic,
    isAdmin,
    nameQuery,
    idsQuery,
    transformQuery
  }