const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri =
	"mongodb+srv://mongouser1:UCEDKtwShGMD8VTV@cluster0.g07pe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const userCollection = client.db("foodExpress").collection("users");

		app.get("/user", async (req, res) => {
			const query = {};
			const cursor = userCollection.find(query);
			const users = await cursor.toArray();
			res.send(users);
		});

		app.get("/user/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.findOne(query);
			res.send(result);
		});

		app.post("/user", async (req, res) => {
			const newUser = req.body;
			console.log("adding new user", newUser);
			const result = await userCollection.insertOne(newUser);
			res.send(result);
		});

		app.put("/user/:id", async (req, res) => {
			const id = req.params.id;
			const updatedUser = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updatedDoc = {
				$set: {
					name: updatedUser.name,
					email: updatedUser.email,
				},
			};
			const result = await userCollection.updateOne(filter, updatedDoc, options);
			res.send(result);
		});

		app.delete("/user/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.deleteOne(query);
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Running Node Mongo Crud server");
});

app.listen(port, () => {
	console.log("node mongo crud server running in port:", port);
});

// user: mongouser1
// pass: UCEDKtwShGMD8VTV
