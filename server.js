const express = require('express');
const bodyPareser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        // connectionString: process.env.DATABASE_URL,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        ssl: true
    }
});

// const db = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'root',
//         database: 'smart-brain'
//     }
// });

// const database = {
//     id: '123',
//     name: 'muath',
//     email: 'm@gmail.com',
//     password: '1234',
//     entries: 0,
//     joined: new Date()
// }

const app = express();
app.use(bodyPareser.json());
app.use(cors());

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
})

db.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('name', [100]);
    table.text('email').unique().notNullable();
    table.bigInteger('entries').defaultTo(0)
    table.timestamp('joined');
})
    .then(() => {
        db.destroy();
    })

db.schema.createTable('login', (table) => {
    table.increments().primary();
    table.string('hash', [100]).notNullable();
    table.text('email').unique().notNullable();
})
    .then(() => {
        db.destroy();
    })

app.get('/', (req, res) => { res.send('It is working') })

app.post('/signin', (req, res) => { signin.handelSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handelRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handelProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handelImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handelApiCall(req, res) })

// const findUser = (id, res) => {
//     let found = false;
//     database.users.forEach(user => {
//         if (user.id === id) {
//             found = true;
//             return res.json(user)
//         }
//     })
//     if (!found) {
//         res.status(400).json('not found')
//     }
// }