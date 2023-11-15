import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});
 
console.log('pool');
 
const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});
 
await client.connect();
 
console.log('connected');
 
await client.end();

export const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}