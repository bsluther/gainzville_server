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

module.exports = { main }