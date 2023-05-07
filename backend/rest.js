const express = require('express');
const bodyParser = require('body-parser');
const CalendarModel = require('./calendar-model');
const mongoose = require('mongoose');
const UserModel = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const dbUrl = 'mongodb://localhost:5000/r4m32j_db'

mongoose.connect(dbUrl)    
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Error connecting to MongoDB');
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.delete('/remove-todo/:id', (req, res) => {
    CalendarModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            message: 'Post Deleted'
        })
    })
})

app.put('/update-todo/:id', (req, res) => {
    const updatedTodo = new CalendarModel({_id: req.body.id, date: req.body.date, todo: req.body.todo})
    CalendarModel.updateOne({_id: req.body.id}, updatedTodo)
        .then(() => {
            res.status(200).json({
                message: 'Update completed'
            })    
        })
})

app.post('/add-todo', (req, res, next) => {
   
    try{
        const token = req.headers.authorization;
        jwt.verify(token, "secret_string")
        next();
    }
    catch(err){
        res.status(401).json({
            message:"Error with Authentication token"
        })
    }
    
}, (req,res) => {
    const CalendarSchema = new CalendarModel({date: req.body.date, todo: req.body.todo, user: req.body.user});
    CalendarSchema.save()
        .then(() => {
            res.status(200).json({
                message: 'Post submitted'
            })
        })
})

app.get('/calendar-entries',(req, res, next) => {
    CalendarModel.find()
    .then((data) => {
        res.json({'calendarEntries': data});
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
})

app.post('/sign-up', (req,res, next) => {

            const userModel = new UserModel({
                username: req.body.username,
                password: req.body.password
            })

            userModel.save()
            .then(result => {
                res.status(201).send({message: 'Successfull sign up'})
            })
            .catch(err => {
                res.status(500).send(err)
            })
})

app.post('/login', (req,res) => {

    let userFound;

    UserModel.findOne({username: req.body.username})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            userFound = user
            return bcrypt.compare(req.body.password, user.password)
        })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }

        const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string")
        return res.status(200).json({
            token: token,
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Error with authentication'
        })
    })
})

module.exports = app;
