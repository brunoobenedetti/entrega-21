import express from 'express';
import passport from 'passport';
import handlebars from 'express-handlebars'
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path'
import { __dirname } from './utils.js'
import {init as initPassportConfig} from './config/passport.config.js'
import  {URI} from '../src/db/mongodb.js';

import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import productsRouter from './routers/views/products.router.js'
import cartsRouter from './routers/views/carts.router.js'
import rtpRouter from './routers/views/rtp.router.js'
import chatRouter from './routers/views/chat.router.js'
import indexRouter from './routers/views/login.router.js';

import sessionsRouter from './routers/views/sessions.router.js';


const app = express()

const SESSION_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: URI,
    mongoOptions: {},
    ttl: 120,
  }), 
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'handlebars')

app.use('/', indexRouter);
app.use('/api', sessionsRouter);

app.use('/api/products', productsApiRouter)
app.use('/api/carts', cartsApiRouter)

app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/realtimeproducts', rtpRouter)
app.use('/chat', chatRouter)

initPassportConfig();

app.use(passport.initialize());
app.use(passport.session())

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app