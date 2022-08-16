require("dotenv").config()
const express = require("express")
const helmet = require("helmet");
const { checkJwt, decodeJwt } = require("./authz/checkJwt");
const { getActivityTemplate, getAllActivityTemplates, getTypeTemplate, getFacetTemplate, getActivityInstance, getActivityInstances, getUserActivityInstances, findActivityTemplate, setActivityInstance, getUserFacetTemplates, insertActivityInstance, deleteActivityInstance, insertActivityTemplate, setActivityTemplate, deleteActivityTemplate, getUserTypeTemplates, getActivityPair, getUserActivityPairs, insertFacetTemplate } = require("./dbOps")
const { findEntities, findEntity } = require("./dbOps2")
const { librariesRouter } = require("./routers/librariesRouter")
const { activityInstancesRouter } = require("./routers/activityInstancesRouter");
const { activityTemplatesRouter } = require("./routers/activityTemplatesRouter");


const server = express();
const apiRouter = express.Router()
// const activityRouter = express.Router()

const usersRouter = express.Router()
const PORT = process.env.PORT || 7777

server.use(express.json())
server.use(helmet())
server.use("/api", apiRouter)
// apiRouter.use("/activity", activityRouter)
apiRouter.use("/libraries", librariesRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/activity/instances", activityInstancesRouter)
apiRouter.use("/activity/templates", activityTemplatesRouter)

/***** V2 ******/

// activityRouter.get("/templates/:id", (req, res) => {
//   findEntity("activity_template")({ _id: req.params.id })
//   .then(data => {
//     if (data) res.send(data)
//     if (!data) res.status(404).send({ message: "Not found" })
//   })
// })





/***** V1 *****/

server.post("/activity/instance", (req, res) => {
  console.log(req.body)
  insertActivityInstance(req.body)
  .then(data => res.send(data))
})



usersRouter.get("/:id", checkJwt, (req, res) => {
  findEntity("user")({ _id: req.params.id })
  .then(data => res.send(data))
})


/***** AUTH *****/
server.post("/login", (req, res) => {
  res.send({ token: "test123" })
})


/***** ACTIVITY *****/

server.get("/activity/pair/:id", (req, res) => {
  getActivityPair(req.params.id)
  .then(data => res.send(data))
})

server.get("/user/activity/pair/:userId", (req, res) => {
  getUserActivityPairs(req.params.userId)
  .then(data => res.send(data))
})

/***** ACTIVITY TEMPLATE *****/

server.get("/activity/template", (req, res) => {
  getAllActivityTemplates()
  .then(data => res.send(data))
})

server.get("/activity/template/:id", (req, res) => {
  getActivityTemplate(req.params.id)
  .then(data => res.send(data))
})

server.get("/search/activity/template/:name", (req, res) => {
  findActivityTemplate(req.params.name)
  .then(data => res.send(data))
})

server.post("/activity/template", (req, res) => {
  insertActivityTemplate(req.body)
  .then(data => res.send(data))
})

server.put("/activity/template/:id", (req, res) => {
  setActivityTemplate(req.params.id, req.body)
  .then(data => res.send(data))
})

server.delete("/activity/template/:id", (req, res) => {
  deleteActivityTemplate(req.params.id)
  .then(data => res.send(data))
})



/***** ACTIVITY INSTANCE *****/

server.get("/activity/instance/:id", (req, res) => {
  getActivityInstance(req.params.id)
  .then(data => res.send(data))
})

server.put("/activity/instance/:id", (req, res) => {
  setActivityInstance(req.params.id, req.body)
  .then(data => res.send(data))
})

server.delete("/activity/instance/:id", (req, res) => {
  deleteActivityInstance(req.params.id)
  .then(data => res.send(data))
})

server.post("/activity/instance", (req, res) => {
  console.log(req.body)
  insertActivityInstance(req.body)
  .then(data => res.send(data))
})

server.get("/user/activity/instance/:userId", (req, res) => {
  getUserActivityInstances(req.params.userId)
  .then(data => res.send(data))
})



/***** TYPE TEMPLATE *****/

server.get("/type/template/:id", (req, res) => {
  getTypeTemplate(req.params.id)
  .then(data => res.send(data))
})

server.get("/user/type/template/:userId", (req, res) => {
  getUserTypeTemplates(req.params.userId)
  .then(data => res.send(data))
})

/***** FACET TEMPLATE *****/

server.get("/facet/template/:id", (req, res) => {
  getFacetTemplate(req.params.id)
  .then(data => res.send(data))
})

server.get("/user/facet/template/:userId", (req, res) => {
  getUserFacetTemplates(req.params.userId)
  .then(data => res.send(data))
})

server.post("/facet/template", (req, res) => {
  insertFacetTemplate(req.body)
  .then(data => res.send(data))
})


server.listen(PORT, () => {
  console.log(`Gainzville server running on port ${PORT}...`)
})



// const { MongoClient } = require("mongodb");

// const uri = process.env.MONGO_URI;
// console.log(uri)

// const client = new MongoClient(uri);

// async function run() {
//   try {
//     await client.connect();

//     const database = client.db("v1");
//     const activityTemplates = database.collection("activity_template");

//     const query = { name: "Pull Up"};
//     const pullUpTemplate = await activityTemplates.findOne(query);
    
//     console.log(pullUpTemplate);
//   } finally {
//     await client.close();
//   }
// }

// run().catch(console.dir);