const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

/** Middlewares */
app.use(cors());
app.use(express.json());

/** VERIFY JWT TOKEN BASED AUTHENTIVCATION */
// const verifyJWT = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   /** Check token authorization */
//   if (!authorization) {
//     return res
//       .status(401)
//       .send({ error: true, message: "unauthorized access" });
//   }
//   const token = authorization.split(" ")[1];
//   /** Token verify */
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//     if (error) {
//       return res
//         .status(403)
//         .send({ error: true, message: "unauthorized access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

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
    const classesCollection = client.db("Edoofy").collection("classes");
    const selectedClassCollection = client
      .db("Edoofy")
      .collection("selectedclasses");

    /** api communication with client side */
    app.get("/users", async (req, res) => {
      const decoded = req.decoded;
      if (decoded?.email !== req.query.email) {
        return res.send({ error: 1, message: "Forbidden access" });
      }
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/selectedclasses", async (req, res) => {
      const result = await selectedClassCollection.find().toArray();
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const decoded = req.decoded;
      if (decoded?.email !== req.query.email) {
        return res.send({ error: 1, message: "Forbidden access" });
      }
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    /** JWT Oparetion */
    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    // });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post("/classes", async (req, res) => {
      const classInfo = req.body;
      const result = await classesCollection.insertOne(classInfo);
      res.send(result);
    });

    app.post("/selectedclasses", async (req, res) => {
      const classInfo = req.body;
      const result = await selectedClassCollection.insertOne(classInfo);
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedRole = req.body;
      const query = { _id: new ObjectId(id) };
      const updateInfo = {
        $set: {
          role: updatedRole.role,
        },
      };
      const result = await usersCollection.updateOne(query, updateInfo);
      res.send(result);
    });

    app.patch("/classes/:id", async (req, res) => {
      if (req.body.feedback) {
        // const id = req.params.id;
        // console.log(id);
        // const query = { _id: new ObjectId(id) };
        // const updatedFeedback = req.body;
        // const updateInfo = {
        //   $set: {
        //     feedback: updatedFeedback.feedback,
        //   },
        // };
        // const result = await classesCollection.updateOne(query, updateInfo);
        // res.send(result);
      } else if (req.body.status) {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedStatus = req.body;
        const updateInfo = {
          $set: {
            status: updatedStatus.status,
          },
        };
        const result = await classesCollection.updateOne(query, updateInfo);
        res.send(result);
      } else {
        ("");
      }
    });

    app.delete("/selectedclasses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await selectedClassCollection.deleteOne(query);
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
