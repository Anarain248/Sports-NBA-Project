import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nba-management';
  const client = await MongoClient.connect(uri);
  const db = client.db('nba-management');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await db.collection('users').insertOne({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
    permissions: {
      teams: ['create', 'read', 'update', 'delete'],
      players: ['create', 'read', 'update', 'delete'],
      coaches: ['create', 'read', 'update', 'delete']
    }
  });

  // Also create a default non-admin user role structure
  await db.collection('roles').insertOne({
    role: 'user',
    permissions: {
      teams: ['read'],
      players: ['read'],
      coaches: ['read']
    }
  });

  console.log('Admin user and roles created successfully');
  await client.close();
}

createAdminUser().catch(console.error); 