require("dotenv").config()
const express = require("express")
const helmet = require("helmet")
const { librariesRouter } = require("./routers/librariesRouter")
const { activityInstancesRouter } = require("./routers/activityInstancesRouter")
const { activityTemplatesRouter } = require("./routers/activityTemplatesRouter")
const { usersRouter } = require("./routers/usersRouter")
const { facetTemplatesRouter } = require("./routers/facetTemplatesRouter")
const typeTemplatesRouter = require("./routers/typeTemplatesRouter")


const server = express();
const apiRouter = express.Router()
const PORT = process.env.PORT || 7777

server.use(express.json())
server.use(helmet())

/***** DEPLOYMENT TEST *****/

server.get("/", (req, res) => {
  res.send("greetings planet")
})

/***** V2 ******/


server.use("/api", apiRouter)
apiRouter.use("/libraries", librariesRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/activity/instances", activityInstancesRouter)
apiRouter.use("/activity/templates", activityTemplatesRouter)
apiRouter.use("/facet/templates", facetTemplatesRouter)
apiRouter.use("/type/templates", typeTemplatesRouter)





server.listen(PORT, () => {
  console.log(`Gainzville server running on port ${PORT}...`)
})