const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("wellcome to our TODO APP");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do24a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const todoCollection = client.db("todoApp").collection("todos");

		// post a todo item
		app.post("/todo", async (req, res) => {
			const todo = req.body;
			const result = await todoCollection.insertOne(todo);
			res.send(result);
		});

		// get all todos
		app.get("/todo", async (req, res) => {
			const todos = await todoCollection.find().toArray();
			res.send(todos);
		});

		// delete a spesific todo item
		app.delete("/todo/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await todoCollection.deleteOne(query);
			res.send(result);
		});

		// make a user admin
		app.put("/todo/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };

			const updateDoc = {
				// update and add a new method is complete: true
				$set: { complete: true },
			};
			const result = await todoCollection.updateOne(filter, updateDoc);
			res.send(result);
		});
	} finally {
	}
}

run().catch(console.dir);

app.listen(port, console.log("server is runing"));
