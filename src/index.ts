import { join } from 'path'
import express, { json } from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import SessFileStore from 'session-file-store'
import { FrontURL } from './constants'

import { router } from './routes'

const app = express()

app.use(cookieParser())

app.use(cors({
  origin: FrontURL,
  credentials: true
}))

const FileStore = SessFileStore(session)

app.use(session({
  store: new FileStore({ path: join(__dirname, '../sessions/') }),
  secret: 'Hhcdu767d8fkjdfisf76sdf6sdf65sdf8d7fsdfg',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true, maxAge: 29999999 }
}))

console.log(process.env.NODE_ENV)

app.use(json())

app.use('/api/v1', router)

app.listen(4321)