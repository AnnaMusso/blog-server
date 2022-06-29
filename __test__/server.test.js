const app = require('../app')
const request = require('supertest')
const fs = require('fs')

const savedPassword = require('../password')
const { notify } = require('../app')
const databaseUrl = './database.json'
const mockDatabaseUrl = '../__test__/mockDb.js'
const mockDb = require('./mockDb')

jest.mock('../helpers')
const helpers = require('../helpers')

let token 
beforeEach(() => {
    jest.clearAllMocks()
  })

describe('get /posts/', () => {
    it('sends posts in response', async () => {
        fs.readFile = jest.fn((path, options, callback) => { callback(null, JSON.stringify(mockDb)); });
        const res = await request(app).get('/posts/')
        expect(res.statusCode).toBe(200)
        expect(res.type).toEqual(expect.stringContaining('json'))
        // console.log(res.body)
        expect(res.body).toEqual(expect.any(Array))
        expect(res.body[0]).toMatchObject(mockDb.posts[0])
    })

    it('sends an empty array', async () => {
        const emptyDb = {posts : []}
        fs.readFile = jest.fn((path, options, callback) => { callback(null, JSON.stringify(emptyDb)); });
        const res = await request(app).get('/posts/')
        console.log(res.body)
        console.log(res.body[0])
        expect(fs.readFile).toHaveBeenCalledWith(databaseUrl, 'utf8', expect.any(Function))
        expect(res.body).toEqual([])
        
    })  
})

describe('post /login/', () => {
    it('handles correct password', async ()=> {
        const res = await request(app)
        .post('/login/')
        .set('Authorization', savedPassword)
        expect(res.statusCode).toBe(200)
        expect(res.text).not.toBe('')
        expect(res.text).toEqual(expect.any(String))
    })
    it('handles incorrect password', async () => {
        const res = await request(app)
        .post('/login/')
        .set('Authorization', '')
        expect(res.statusCode).toBe(401)

    })
})


describe('app.use', () => {
    it('rejects unauthorized requests', async ()=> {
        const res = await request(app)
        .delete('/posts/')
        .set('Authorization', '')
        expect(res.statusCode).toBe(401)
    })

    it('handles authorized requests', async () => {
        //make login request to get token
        const res = await request(app)
        .post('/login/')
        .set('Authorization', savedPassword)
        //make delete request with token
        expect(res.text).not.toBe('')
        await request(app)
        .delete('/posts/')
        //res.text is the token
        .set('Authorization', res.text)
        expect(res.statusCode).toBe(200)
        // expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.objectContaining({posts : []}))
        
        
    })
})

beforeEach( async () => {
    //login to get token
    const res = await request(app)
    .post('/login/')
    .set('Authorization', savedPassword)
    token = res.text
})

describe.only('delete /posts/:id', () => {
    it('deletes one post', async ()=> {
        const dbCopy = {posts : [...mockDb.posts]}
        const index = dbCopy.posts.findIndex(post => post.id === "xoxo")
        dbCopy.posts.splice(index, 1)
       
        const res = await request(app).delete('/posts/ciao').set('Authorization', token)
        console.log(helpers.writeJson.mock)
        expect(res.statusCode).toBe(200)
        expect(helpers.writeJson).toHaveBeenCalled()
        //FIXME: fails
        expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.objectContaining({posts : expect.any(Array)}))
    })
})

describe('delete /posts/', () => {
    it('deletes all posts', async () => {
        const res = await request(app).delete('/posts/').set('Authorization', token)
        expect(res.statusCode).toBe(200)
        console.log(helpers.writeJson.mock)
         expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.objectContaining({posts : []}))
        // expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.any(String))
    })
})

describe('post /posts/:id', () => {
    it('adds a new post', async () => {
        const res = await request(app).post('/posts/:id').set('Authorization', token)
        expect(res.statusCode).toBe(200)
        expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.objectContaining({posts : expect.any(Array)}))
    })
})

describe('put /put/:id', () => {
    it('edit a new post', async () => {
        const res = await request(app).put('/posts/:id').set('Authorization', token)
        expect(res.statusCode).toBe(200)
        expect(helpers.writeJson).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.any(String), expect.objectContaining({posts : expect.any(Array)}))
    })
})