const express = require('express')
const app = express();
const cors = require('cors');
const fs = require("fs")
const port = 3000;
const users = require('./sample.json');


app.use(cors({
  origin : "http://localhost:5173",
  methods: ["GET","POST","PATCH","DELETE"  ]
}));

app.use(express.json())

app.get('/users', (req, res) => {
    return res.json(users);
  });
  

app.delete('/users/:id',(req,res) => {
  let id = Number(req.params.id);
  let filterdUsers = users.filter((user)=> user.id !== id);
  fs.writeFile('./sample.json',JSON.stringify(filterdUsers), (err,data) => {
    return res.json(filterdUsers);
  }
)
})

app.patch('/users/:id',(req,res) => {
  let id = Number(req.params.id)
  let {name,age,city} = req.body;
  if(!name || !age || !city){
    res.status(400).send({Message : "All Field Required"})
  }
  
  let index = users.findIndex((user)=> user.id == id);
  users.splice(index,1,{...req.body})
  fs.writeFile('./sample.json',JSON.stringify(users), (err,data) => {
    return res.json({Message : "User Details Added success"})
  }
)
})

app.post('/users',(req,res) => {
  let {name,age,city} = req.body;
  if(!name || !age || !city){
    res.status(400).send({Message : "All Field Required"})
  }
  let id = Date.now();
  users.push({id,name,age,city})
  fs.writeFile('./sample.json',JSON.stringify(users), (err,data) => {
    return res.json({Message : "User Details Added success"})
  }
)

  
})

app.listen(port, (err) => {
    console.log(`The App is Running in Port ${port}`)
})
