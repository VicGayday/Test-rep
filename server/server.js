/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import Html from '../client/html'

const { readFile, writeFile, stat, unlink } = fs.promises

const saveFile = async(users) => {
  const fileContent = await writeFile(`${__dirname}/test.json`, JSON.stringify(users), { encoding: 'utf8' })
      .then((data) => console.log(data))
  return fileContent
}

const getFile = async() => {
  const fileContent = await readFile(`${__dirname}/test.json`, { encoding: "utf8" })
    .then(data => JSON.parse(data))
    .catch(async() => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
    })
  return fileContent
}

let connections = []

const port = process.env.PORT || 3000
const server = express()

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', 'bf20e70d-e50c-4bf9-8092-69c044c07b08')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users/', async (req, res) => { 
  const users = await getFile()
  res.json(users)
}) 

server.post('/api/v1/users/:name', async (req, res) => {
  const users = await getFile()
  const userId = users.length + 1
  const newUser = { id: userId, name: req.params.name }
  const newUsers = [...users, newUser]
  saveFile(newUsers)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/', async (req, res) => {
  await stat(`${__dirname}/test.json`)
  .then(async() => {
  await unlink(`${__dirname}/test.json`) 
  res.send('delete successfully')
}) 
.catch(() => res.send('File not found'))
})

server.patch('/api/v1/users/:userId', async(req, res) => {
  const userId = parseInt(req.params.userId, 10)
  const users = await getFile()
  const newUser = { id: userId, ...req.body } // { id: userId, name: 'newName'...}
  const filteredUsers = users.filter((user) => user.id !== userId)
  saveFile([...filteredUsers, newUser])
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async(req, res) => { // удаление пользователя
  const userId = parseInt(req.params.userId, 10)
  const users  = await getFile() // получили всех пользователей с файла                     
  const filteredUsers = users.filter((user) => user.id !== userId) // удалить элемент массива
  saveFile(filteredUsers)
  res.json({ status: 'success', id: userId })
}) 
server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)