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
//shows list of tasks, filtred by status, id or full list without filter
router.get('/', (req, res) => {
  const filter = {};

  req.body.status?filter['status']=[req.body.status]:filter['status']=['View', 'In Progress', 'Done']
  req.body.id?filter['id']=req.body.id:filter['id']={ from: 1, to: 10000 }

  knex
    .select('*')
    .from('tasks')
    .whereIn( 'status', filter.status )
    .whereBetween('id', [filter.id.from, filter.id.to])
    .then(data => {
      const allTasks = JSON.stringify(data);
      res.json(JSON.parse(allTasks));
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

//POST
//creates new task with only permited status values and only existing in users table executor
router.post('/', (req, res) => {
  knex
    .select('first_name', 'last_name')
    .from('users')
    .where({
      first_name: req.body.executor.split(' ')[0],
      last_name: req.body.executor.split(' ')[1]
    })
    .then(data => {
      knex('tasks')
        .insert({
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          status: req.body.status=='View'?'View':req.body.status=='In Progress'?'In Progress':req.body.status=='Done'?'Done':null,
          executor: data[0]?req.body.executor:null
        })
        .then(() => {
          res.json({ status: 'ok', success: true })
        })
        .catch(err => {
          console.log(err);
          res.json({ status: 'bad', success: false })
        });
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

//PUT
//changes task by id
router.put('/', (req, res) => {
  const changeFields = {}

  req.body.title?changeFields['title']=req.body.title:null
  req.body.description?changeFields['description']=req.body.description:null
  req.body.status?changeFields['status']=req.body.status=='View'?'View':req.body.status=='In Progress'?'In Progress':req.body.status=='Done'?'Done':null:null
  if (req.body.executor) {
    knex
      .select('first_name', 'last_name')
      .from('users')
      .where({
        first_name: req.body.executor.split(' ')[0],
        last_name: req.body.executor.split(' ')[1]
      })
      .then(data => {
        changeFields['executor']=data[0]?req.body.executor:null
      })
      .catch(err => console.log(err))
  }

  setTimeout(() => {
    knex('tasks')
      .where({
        id: req.body.id,
      })
      .update(changeFields)
      .then(() => res.json({ status: 'ok', success: true }))
      .catch(err => {
        console.log(err);
        res.json({ status: 'bad', success: false });
      });
    }, 1100)
});

//DELETE
//delete any task that has definited values
router.delete('/', (req, res) => {
  const deleteFields = {};

  req.body.id?deleteFields['id']=req.body.id:null
  req.body.title?deleteFields['title']=req.body.title:null
  req.body.description?deleteFields['description']=req.body.description:null
  req.body.status?deleteFields['status']=req.body.status:null
  req.body.executor?deleteFields['executor']=req.body.executor:null

  knex('tasks')
    .where(deleteFields)
    .del()
    .then(() => res.json({ status: 'ok', success: true }))
    .catch(err => {
      console.log(err);
      res.json({ status: 'bad', success: false });
    });
});

module.exports = router;
