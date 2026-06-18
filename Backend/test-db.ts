import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// 1. Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});

// 2. Initialize the Prisma Adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to the PostgreSQL database!');
    
    const result = await prisma.$queryRaw`SELECT current_database();`;
    console.log('📦 Connected to database:', result);
    
  } catch (error) {
    console.error('❌ Failed to connect to the database.');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    // Wait for the pool to drain
    await pool.end();
  }
}

main();
