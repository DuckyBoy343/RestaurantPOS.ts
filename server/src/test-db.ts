import db from '../utils/db';

async function testConnection() {
  try {
    console.log('Attempting to connect to the database...');
    
    // Fetch the first 5 users
    const mesas = await db('roles').select('*').limit(5);
    
    console.log('✅ Connection successful!');
    console.log('Found mesas:', mesas);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await db.destroy();
  }
}

testConnection();