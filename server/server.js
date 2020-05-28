/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import fs from 'fs'
import cookieParser from 'cookie-parser'
import Html from '../client/html'

const { readFile, writeFile, stat, unlink } = fs.promises

const saveFile = async (users) => {
  const fileContent = await writeFile(`${__dirname}/test.json`, JSON.stringify(users), {
    encoding: 'utf8'
  })
  return fileContent
}
const getFile = async () => {
  const fileContent = await readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
      return users
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

server.get('/api/v1/users', async (req, res) => {
  // чтение
  const users = await getFile()
  res.json(users)
})

server.post('/api/v1/users/', async (req, res) => {
  // добавить нового пользователя
  const users = await getFile() // получили всех пользователей с файла
  const userId = users.length + 1 // length will return 10 in case there are 10 users, so the last one will be with id 10 the same as length of users array and a new user will have an id of 11, which is suitable and prevent storing duplicates in our “database”
  const newUser = { id: userId, ...req.body } // новый пользователь,составленный из id и параметров запроса
  const newUsers = [...users, newUser] // добавить элемент в массив с помощью спреда
  saveFile(newUsers) // сохраняем нового пользователя
  res.json({ status: 'success', id: userId }) // посылаем клиенту id нового пользователя
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  // изменить пользователя с userId
  const userId = parseInt(req.params.userId, 10)
  const users = await getFile()
  const newUsers = users.map((item) => {
    if (+item.id === userId) {
      const newU = { ...item, ...req.body } // { id + параметры body }
      return newU
    }
    return item
  })
  saveFile(newUsers) // сохраняем нового пользователя
  res.json({ status: 'success', id: userId }) // изменен или добавлен, если его не было
})

server.delete('/api/v1/users', async (req, res) => {
  // удаление файла
  await stat(`${__dirname}/test.json`)
    .then(async () => {
      await unlink(`${__dirname}/test.json`)
      res.send('delete successfuly')
    })
    .catch(() => res.send('file not found'))
})
server.delete('/api/v1/users/:userId', async (req, res) => {
  // удаление пользователя
  const userId = parseInt(req.params.userId, 10)
  const users = await getFile() // получили всех пользователей с файла
  const filteredUsers = users.filter((user) => user.id !== userId) // все элементы массива, кроме userId
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
