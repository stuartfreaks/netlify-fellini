const express = require('express');
const res = require('express/lib/response');

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

router.get('/movies', (req, res) => {
    res.json({
        'here are the' : 'movies'
    });
});

//get movies by title

router.get('/movies/:Title', (req, res) => {
    res.json({
        'here is the' : 'Title'
    });
});

//get genre by name

router.get('/movies/genres/:Name', (req, res) => {
    res.json({
        'here is the' : 'Genre Name'
    });
});

//get director by name

router.get('/movies/directors/:Name', (req, res) => {
    res.json({
        'here is the' : 'Directors Name'
    });
});

//get all users

router.get('/users', (req, res) => {
    res.json({
        'here are' : 'The Users'
    });
});




app.use('/.netlify/functions/api',router)


module.exports.handler = serverless(app);