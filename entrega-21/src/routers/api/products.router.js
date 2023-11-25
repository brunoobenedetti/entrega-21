import { Router } from 'express'
import ProductManager from '../../dao/ProductManager.js'
import { getLinkToPage } from '../../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  const { limit, page, sort } = req.query
  try {
    let result = await ProductManager.getProducts(limit, page, sort)

    result = { 
      ...result,
      prevLink: result.hasPrevPage ? getLinkToPage(req, result.prevPage) : null,
      nextLink: result.hasNextPage ? getLinkToPage(req, result.nextPage): null
    }

    res.status(result.status).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  try {
    const product = await ProductManager.getProductById(pid)
    res.status(201).json(product)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.post('/', async (req, res) => {
  let { title, description, code, price, status, stock, thumbnail, category} = req.query
  
  let boolStatus = status? status.toLocaleLowerCase() == 'true' : true

  const productData = { 
    title,
    description, 
    code, 
    price: parseFloat(price), 
    status: boolStatus, 
    stock: parseInt(stock), 
    thumbnail: thumbnail? thumbnail: "./thumbnail1.webp", 
    category 
  }

  try {
    await ProductManager.addProduct(productData)
    res.status(201).json("Product created successfully.")
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  if(req.body.status && typeof req.body.status == 'string') {
    req.body.status = req.body.status.toLocaleLowerCase() == 'true'
  } 
    
  try {
    let result = await ProductManager.updateProduct(pid, {...req.body})
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    await ProductManager.deleteProduct(pid)
    res.status(201).send(`Product with id "${pid}" deleted successfully.`)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router