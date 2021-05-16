import { MongoClient } from "mongodb";
const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;
    const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
    const db = client.db();
    const meetupCollection = db.collection("meetups");

    await meetupCollection.insertOne(data);
    client.close();
    res.status(201).json({
      message: "meetup inserted",
    });
  }
};

export default handler;
