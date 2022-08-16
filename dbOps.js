const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;


async function main(operation) {
  const client = new MongoClient(MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();

    const result = await operation(client);

    return result;
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}



/***** ACTIVITY *****/

async function getActivityPair(instanceId) {
  const instance = await getActivityInstance(instanceId)
  const template = await getActivityTemplate(instance.id)
  return ({
    instance,
    template
  })
}

async function getUserActivityPairs(userId) {
  const instances = await getUserActivityInstances(userId)
  const templateIds = instances
                      .map(instance => instance.template)
                      .reduce((acc, x) => acc.includes(x) ? acc : acc.concat(x), [])
  const templates = await getActivityTemplates(templateIds)
  return ({ instances, templates })
}

/***** ACTIVITY - TEMPLATE *****/

async function getActivityTemplate(id) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .findOne({ _id: id }));
  return result;
}

async function getActivityTemplates(ids) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .find({
                                _id: {
                                  $in: ids
                                }
                              })
                              .toArray()
                            )
  return result
}

async function getAllActivityTemplates() {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .find()
                              .toArray());
  return result;
}

async function findActivityTemplate(name) {
  const regex = new RegExp(`${name}`, "ig")
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .find({ 
                                $or: [
                                  {
                                    name: {
                                      // $regex: `${name}`,
                                      $regex: regex,
                                      // $options: "i"
                                    }
                                  },
                                  { 
                                    aliases: { 
                                      $regex: regex,
                                      // $options: "i",
                                      $in: [name] 
                                    }
                                  }
                                ] 
                              })
                              .toArray())
  return result
}

async function insertActivityTemplate(template) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .insertOne(template))
  return result
}

async function setActivityTemplate(id, template) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .findOneAndReplace(
                                { _id: id },
                                template,
                              ))
  return result.value
}

async function deleteActivityTemplate(id) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_template")
                              .deleteOne({ _id: id }))

  return result
}


/***** ACTIVITY -  INSTANCE *****/

async function getActivityInstance(id) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .findOne({ _id: id }));
  return result;
}

async function setActivityInstance(id, instance) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .findOneAndReplace(
                                { _id: id },
                                instance,
                              ))
  return result.value
}

// THIS LOOKS BROKEN
async function getActivityInstances(ids) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .find({ _id: id })
                              .toArray())
  return result
}

async function getUserActivityInstances(userId) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .find({ user: userId })
                              .toArray())
  return result
}

async function insertActivityInstance(instance) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .insertOne(instance))
  return result
}

async function deleteActivityInstance(instanceId) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("activity_instance")
                              .deleteOne({ _id: instanceId }))
  return result
}

/***** TYPE - TEMPLATE *****/

async function getTypeTemplate(id) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("type_template")
                              .findOne({ _id: id }));
  return result
}

async function getUserTypeTemplates(userId) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("type_template")
                              .find()
                              .toArray())

  return result
}

/***** FACET - TEMPLATE *****/

async function getFacetTemplate(id) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("facet_template")
                              .findOne({ _id: id }));
  return result
}

async function getUserFacetTemplates(userId) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("facet_template")
                              .find()
                              .toArray())

  return result
}

async function insertFacetTemplate(template) {
  const result = await main(client =>
                              client
                              .db("v1")
                              .collection("facet_template")
                              .insertOne(template))
  return result
}



module.exports = {
  main,
  getActivityPair,
  getUserActivityPairs,
  getActivityTemplate,
  getAllActivityTemplates,
  deleteActivityTemplate,
  getActivityInstance,
  setActivityInstance,
  getActivityInstances,
  getUserActivityInstances,
  insertActivityInstance,
  deleteActivityInstance,
  insertActivityTemplate,
  setActivityTemplate,
  getTypeTemplate,
  getUserTypeTemplates,
  getFacetTemplate,
  findActivityTemplate,
  getUserFacetTemplates,
  insertFacetTemplate
}