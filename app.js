const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const fs = require('fs')
const helpers = require('./helpers')
const savedPassword = require('./password')
const port = 8000
const app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json

const databaseUrl = './database.json'
let token
app.get('/posts/', (req, res, next) => {
    // console.log(savedPassword)
    fs.readFile(databaseUrl, 'utf8', (err, jsonString) => {
        if (err) {
            next(err)
        } else {
            // console.log(jsonString)
            const data = JSON.parse(jsonString) 
            res.send(data.posts)
            // console.log(data.posts)
            res.end()
        }
    })
})

app.post('/login/', (req, res, next) => {
    let auth = req.headers.authorization
    if (!auth || auth !== savedPassword) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic')
        res.end('Unauthorized')
      } else {
        token = Math.random().toString()
        res.end(token)
      }
})

app.use((req, res, next) => {
    console.log(token)
    // console.log(req.body)
    // console.log(req.headers)
    let auth = req.headers.authorization

    if (!auth || auth !== token) {
        // console.log('token', token)
        // console.log('auth', auth)
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic')
        res.end('Unauthorized')
      } else {
        next()
      }
})    
  

app.delete('/posts/:id', (req, res, next) => {
        const db = require(databaseUrl)
        const index = db.posts.findIndex(post => post.id === req.params.id)
        db.posts.splice(index, 1)
    
        helpers.writeJson(res, next, databaseUrl, db)
})

app.delete('/posts/', (req, res, next) => {
    const db = require(databaseUrl)
    db.posts = []
    // console.log(helpers.writeJson)
    helpers.writeJson(res, next, databaseUrl, db)
})

app.post('/posts/:id', (req, res, next) => {
    // console.log(req.body)
    // console.log(req.headers)
    const db = require(databaseUrl)
    db.posts.push(req.body)

    helpers.writeJson(res, next, databaseUrl, db)    
})

app.put('/posts/:id', (req, res, next) => {
    const db = require('./database.json')
    const index = db.posts.findIndex(post => post.id === req.params.id)
    db.posts.splice(index, 1, req.body)

    helpers.writeJson(res, next, databaseUrl, db)
})

module.exports = app