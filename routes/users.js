import express from 'express'
import axios from 'axios'
import chalk from 'chalk'

let router = express.Router();

let users = [
    {name: "Daniel", gender: "male"},
    {name: "Vanessa", gender: "female"}
];

router.get('/add/', async function (req, res, next) {
    let {name, gender = ''} = req.query;
    if (name) {
        users.push({
            name, gender
        });
        res.send({status: "success"});
    } else {
        res.send({status: "success"});
    }
});

router.get('/', async function (req, res, next) {
    let {gender = ''} = req.query;
    
    let filteredUsers = users.filter(x => !gender || x.gender === gender);
    
    res.send(filteredUsers);
});

module.exports.path = '/user';
module.exports.router = router;
