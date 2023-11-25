import { Router } from 'express'
import ChatManager from '../../dao/ChatManager.js'
import { bsonToObject } from '../../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const chatMessages = await ChatManager.getMessages()
    res.render('chat', { messages: bsonToObject(chatMessages)})
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error)
  }
})

export default router