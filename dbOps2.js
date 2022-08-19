const { main } = require("./dbOps")

const findEntity = collection => queryObj =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .findOne(queryObj))

const findEntities = collection => queryObj =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .find(queryObj)
    .toArray())

const insertEntity = collection => newEntity =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .insertOne(newEntity))

const updateEntity = collection => updatedEntity =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .findOneAndReplace({ _id: updatedEntity._id }, updatedEntity))

module.exports = {
  findEntity,
  findEntities,
  insertEntity,
  updateEntity
}