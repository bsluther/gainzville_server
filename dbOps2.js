const { main } = require("./dbOps")

const findEntities = collection => queryObj =>
  main(client =>
        client
        .db("v1")
        .collection(collection)
        .find(queryObj)
        .toArray())

const findEntity = collection => queryObj =>
  main(client =>
        client
        .db("v1")
        .collection(collection)
        .findOne(queryObj))    

module.exports = {
  findEntities,
  findEntity
}