const mongoose = require('mongoose');

const oldUri = "mongodb+srv://Muhad:Zenox%40123@zenoxcluster.bdlhg2h.mongodb.net/zenox_lighting?retryWrites=true&w=majority";
const newUri = "mongodb+srv://zenoxlighting4_db_user:3RCBf61wGckJMAN7@zenoxcluster-new.r8softi.mongodb.net/zenox_lighting?retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log('Connecting to old DB...');
    const oldConn = await mongoose.createConnection(oldUri).asPromise();
    console.log('Successfully connected to old DB!');
    
    // Check old projects
    const Project = oldConn.model('Project', new mongoose.Schema({}, { strict: false }));
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects in old DB.`);
    
    oldConn.close();
  } catch (error) {
    console.error('Error connecting to old DB:', error.message);
  }
}

testConnection();
