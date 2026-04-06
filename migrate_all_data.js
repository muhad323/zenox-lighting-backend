const mongoose = require('mongoose');

const oldUri = "mongodb+srv://Muhad:Zenox%40123@zenoxcluster.bdlhg2h.mongodb.net/zenox_lighting?retryWrites=true&w=majority";
const newUri = "mongodb+srv://zenoxlighting4_db_user:3RCBf61wGckJMAN7@zenoxcluster-new.r8softi.mongodb.net/zenox_lighting?retryWrites=true&w=majority";

async function migrateAllData() {
  let oldConn, newConn;
  try {
    console.log('Connecting to old DB...');
    oldConn = mongoose.createConnection(oldUri);
    await oldConn.asPromise();
    console.log('✅ Successfully connected to old DB!');
    
    console.log('Connecting to new DB...');
    newConn = mongoose.createConnection(newUri);
    await newConn.asPromise();
    console.log('✅ Successfully connected to new DB!');

    // Get all collections from the old DB
    const collections = await oldConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate: \n`, collections.map(c => c.name).join(', '));

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const oldModel = oldConn.model(collectionName, new mongoose.Schema({}, { strict: false, collection: collectionName }));
      const newModel = newConn.model(collectionName, new mongoose.Schema({}, { strict: false, collection: collectionName }));
      
      const docs = await oldModel.find({}).lean();
      console.log(`Migrating ${docs.length} documents for ${collectionName}...`);
      
      if (docs.length > 0) {
        // Clear existing data in the new collection to avoid duplicates
        await newModel.deleteMany({});
        await newModel.insertMany(docs);
        console.log(`✅ Successfully migrated ${collectionName}`);
      }
    }
    
    console.log('🎉 Full Migration Completed!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    if (oldConn) { await oldConn.close(); }
    if (newConn) { await newConn.close(); }
    process.exit();
  }
}

migrateAllData();
