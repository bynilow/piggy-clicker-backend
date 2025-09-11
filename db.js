import { Pool } from 'pg';

const database = process.env.PG_DATABASE;
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = process.env.PG_PORT;

const pool = new Pool({
    user,
    password,
    host,
    port,
    database
});

export { pool };
