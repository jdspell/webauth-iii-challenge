const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({message: "testing"});
});

server.get('/api/users', async (req, res) => {
    try {
        const users = await db('users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.post('/api/register', async (req, res) => {
    try {
        //inserts the user in the db and destructs the id from the array that is returned
        const [id] = await db('users').insert(req.body);
        console.log(id);
        //finds the user in the db by id and returns the user as json
        const newUser = await db('users')
            .where({ id: id })
            .first();
        console.log(newUser);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.post('/api/login', async (req, res) => {
    try {
        res.status(200).json({ message: "logged in" });
    } catch (error) {
        res.status(500).json(error);
    }
})

port = 5000;
server.listen(port, () => {
    console.log(`\n** Running on port ${port} **\n`)
});