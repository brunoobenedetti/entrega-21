import CartModel from './models/cart.model.js'
import ProductManager from './ProductManager.js'
import { Exception } from '../utils.js'

class CartManager {
	static async getCarts() {
		return await CartModel.find()
	}
	static async addCart(cart) {
		const result = await CartModel.create(cart)
		console.log(result)
		return result
    }
	static async updateCart(cid, products) {
		try {
			const result = await CartModel.updateOne({_id: cid}, {products})

			if(result.matchedCount == 0) {
				throw new Error()
			}

			return await CartModel.findOne({_id: cid})
		}
		catch (error) {
			throw new Exception(`Cart with id "${cid}" not found`)
		}
	}
	static async getCartById(cid, populate=false) {
		try {
			const cart = await CartModel.findOne({_id: cid})
			if(populate) {
				return await cart.populate('products.product') 
			}
			return cart
		} 
		catch (error) {
			throw new Exception(`Cart with id "${cid}" not found`, 404)
		}
	}
	static async addProductToCart(cid, pid, quantity=null) {
		const cart = await CartManager.getCartById(cid)
		const validProduct = await ProductManager.productExists(pid)
	
		if(validProduct)
		{
			const productIndex = cart.products.findIndex(e => e.product.toString() == pid)

			if(productIndex != -1) {
				quantity? cart.products[productIndex].quantity = quantity : cart.products[productIndex].quantity++
			}
			else {
				cart.products.push({
					product: pid,
					quantity: quantity? quantity : 1
				})
			}

			let result = await CartManager.updateCart(cid, cart.products)
			return result
		}
	
		throw new Exception(`Product with id "${pid}" doesn't exist"`, 404)
	}
	static async deleteProductFromCart(cid, pid) {
		const cart = await CartManager.getCartById(cid)
		if(!cart) {
			throw new Exception(`Cart with id "${cid}" not found`, 404)
		}
		
		const productIndex = cart.products.findIndex(e => e.product.toString() == pid)

		if(productIndex != -1) {			
			cart.products.splice(productIndex, 1)
			return await CartManager.updateCart(cid, cart.products)
		}

		throw new Exception(`Product with id "${pid}" not found in cart with id "${cid}"`, 404)
	}
}

export default CartManager