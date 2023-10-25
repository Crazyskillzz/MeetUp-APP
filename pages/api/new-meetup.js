import { MongoClient } from "mongodb";
require("dotenv").config();

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ovjjp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
