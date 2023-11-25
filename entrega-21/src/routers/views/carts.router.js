import { Router } from 'express'
import CartManager from '../../dao/CartManager.js'

const router = Router()

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  
  try {
    const cart = await CartManager.getCartById(cid, true)

    const products = cart.products.map(e => {
      return {...e.product._doc, quantity: e.quantity}
    })

    res.render('cart', { cartId: cid, products })
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router