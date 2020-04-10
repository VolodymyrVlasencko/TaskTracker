const express = require('express');
require('dotenv').config();
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  }
});

const router = express.Router();

//GET
//shows list of users in databse
router.get('/', (req, res) => {
  knex
    .select('*')
    .from('users')
    .then(data => {
      const allUsers = JSON.stringify(data);
      res.json(JSON.parse(allUsers));
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

//POST
//create new user
router.post('/', (req, res) => {
  knex('users')
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name
    })
    .then(data => res.json({ status: 'ok', success: true }))
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

//PUT`
//change user info in database
router.put('/', (req, res) => {
  const changeFields = {}

  req.body.first_name?changeFields['first_name']=req.body.first_name:null
  req.body.last_name?changeFields['last_name']=req.body.last_name:null

  knex('users')
    .where({
      user_id: req.body.user_id,
    })
    .update(changeFields)
    .then(data => res.json({ status: 'ok', success: true }))
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

//DELETE
//delete any user which has same values as definited
router.delete('/', (req, res) => {
  const deleteFields = {}

  req.body.user_id?deleteFields['user_id']=req.body.user_id:null
  req.body.first_name?deleteFields['first_name']=req.body.first_name:null
  req.body.last_name?deleteFields['last_name']=req.body.last_name:null

  knex('users')
    .where(deleteFields)
    .del()
    .then(data => res.json({ status: 'ok', success: true }))
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

module.exports = router;
