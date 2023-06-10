const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

/** Middlewares */
app.use(cors());
app.use(express.json());

/** Mongodb client and database connection */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todos.ukwfq5e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    /** collection from database */
    const usersCollection = client.db("Edoofy").collection("users");

    /** api communication with client side */
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Edoofy Server is running"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
