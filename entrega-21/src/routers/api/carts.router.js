import { Router } from 'express'
import CartManager from '../../dao/CartManager.js'
import ProductManager from '../../dao/ProductManager.js'
import { Exception } from '../../utils.js'

const router = Router()

router.post('/', async (req, res) => {
  let result = await CartManager.addCart({})
  res.status(201).json(result)
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    const cart = await CartManager.getCartById(cid, true)

    res.status(201).json(cart.products)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
    return
  }
})

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    const result = await CartManager.addProductToCart(cid, pid)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try {
    await CartManager.deleteProductFromCart(cid, pid)
    res.status(201).send(`Product with id "${pid}" in cart with id "${cid}" deleted successfully.`)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.put('/:cid', async (req, res) => {
  const { cid } = req.params

  if(!Array.isArray(req.body)) {
    res.status(400).send('Body must be an array.')
    return
  }

  try {
    const newProducts = []

    for(const e of req.body) {
      if(isNaN(e.quantity)) {
        e.quantity = 1
      }

      if(!await ProductManager.productExists(e.product)) {
        throw new Exception(`Product with id "${e.product}" doesn't exist.`, 404)
      }

      newProducts.push({...e})
    }

    let result = await CartManager.updateCart(cid, newProducts)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  if(isNaN(quantity)) {
    res.status(400).send(`The field "quantity" in the body must be a number, got "${quantity}" instead.`)
    return
  }

  try {
    const result = await CartManager.addProductToCart(cid, pid, quantity)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    let result = await CartManager.updateCart(cid, [])
    res.status(201).send(`Successfully deleted all products in cart with id "${cid}".`)
    // res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router