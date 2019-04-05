const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('./api/secrets.js');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({message: "testing"});
});

server.get('/api/users', restricted, async (req, res) => {
    try {
        const users = await db('users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.post('/api/register', async (req, res) => {
    try {
        const newUser = req.body;

        //hash the user password
        newUser.password = bcrypt.hashSync(newUser.password, 8);

        //inserts the new user from the request  in the db and destructs the id from the array that is returned
        const [id] = await db('users').insert(newUser);
        
        //finds the user in the db by id and returns the user as json
        const user = await db('users')
            .where({ id: id })
            .first();
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.post('/api/login', async (req, res) => {
    try {
        //destructs username and password from request
        const { username, password } = req.body;
        
        //finds the user with the matching username in the database
        const user = await db('users')
            .where({ username: username })
            .first();
        
        //if the user with the corresponding username is found 
        //and the password matches the user's password found in the database then log in the user
        if(user && bcrypt.compareSync(password, user.password)) {
            
            //create token
            const token = generateToken(user);
            
            res.status(200).json({
                message: "logged in",
                token
            });
        } else{
            res.status(401).json({ message: "Invalid Credentials" });
        }

    } catch (error) {
        res.status(500).json(error);
    }
})


function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    };

    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
};


function restricted(req, res, next) {
    const token = req.headers.authorization;
    
    //checks if token exists and whether it is valid
    if(token){
        jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
            if(error) {
                //the token is invalid
                res.status(401).json({ message: "You shall not pass!" });
            } else {
                //the token is valid
                req.decodedJwt = decodedToken;

                next();
            }
        });
    }else {
        res.status(401).json({ message: "No token provided." });
    }
};


port = 5001;
server.listen(port, () => {
    console.log(`\n** Running on port ${port} **\n`)
});