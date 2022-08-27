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

const replaceEntity = collection => entity =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .findOneAndReplace({ _id: entity._id }, entity))

const updateEntity = collection => id => entries =>
  main(client =>
    client
    .db("v1")
    .collection(collection)
    .findOneAndUpdate(
      { _id: id },
      entries
    ))

module.exports = {
  findEntity,
  findEntities,
  insertEntity,
  replaceEntity,
  updateEntity
}