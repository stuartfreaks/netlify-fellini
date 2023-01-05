const express = require('express');

const serverless = require('serverless-http');

const app = express();

const  router  = express.Router();

//Get 'hello' & Test 2

router.get('/', (req, res) => {
    res.json({
        'hello' : 'hi!'
    });
});

router.get('/test', (req, res) => {
    res.json({
        'hello' : 'test2'
    });
});

//get all movies

router.get(
    '/movies', (req, res) => {
        res.json({
            'Here are the Movies!' : Movies
        });
    });




app.use('/.netlify/functions/api',router)


module.exports.handler = serverless(app);