const { split, propOr, includes } = require("ramda")

const csvToArray = split(",")
const isPublic = propOr(false)("isPublic")
const isAdmin = userId => lib =>
  includes(userId)(lib.admins)

  module.exports = {
    csvToArray,
    isPublic,
    isAdmin
  }