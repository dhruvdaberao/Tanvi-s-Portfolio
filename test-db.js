const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("No MONGO_URI");
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    
    console.log("Connected to DB.");

    // Let's try to update just like route.ts does
    const fakeContent = {
      hero: { name: "Test Hero" },
      writings: [{ id: "1", title: "Writing 1" }],
      // Test with keys that might cause issues
      // What if it has $ or . in keys? We'll see.
    };

    console.log("Attempting to save to 'content' collection...");
    await db.collection("content").updateOne(
      { key: "portfolioContent" },
      {
        $set: {
          key: "portfolioContent",
          content: fakeContent,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log("Successfully saved to 'content' collection.");

    // Let's fetch using the get logic
    const globalContent = await db.collection("site_content").findOne({ key: "global" });
    console.log("Fetched from site_content global:", globalContent ? "FOUND" : "NOT FOUND");

    const oldContentDocs = await db.collection("content").find({}).toArray();
    console.log("Docs in 'content' collection:", oldContentDocs.length);
    console.log("Keys in 'content' doc:", oldContentDocs[0] ? Object.keys(oldContentDocs[0]) : "none");

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.close();
  }
}

run();
