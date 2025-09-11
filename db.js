import { Pool } from 'pg';

const database = process.env.PG_DATABASE;
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = process.env.PG_PORT;

console.log(
    {
        database,
        user,
        password,
        host,
        port
    }
)

const pool = new Pool({
    user,
    password,
    host,
    port: Number(port),
    database
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Successfully connected to database');
        release();
    }
});

export { pool };
