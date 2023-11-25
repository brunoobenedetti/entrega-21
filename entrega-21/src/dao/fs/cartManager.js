import fs from 'fs'

const filePath = './src/modules/carritos.json'

class CartManager {
    constructor() {
		this.dbPath = filePath
    }
	async getCarts() {
		return await this.loadDb()
	}
	async getCartById(id) {
		let carts = await this.loadDb()
		let foundCart = carts.find(e => e.id === parseInt(id))
		
		if (!foundCart) {
			return false
		}

		return new Cart(foundCart.id, foundCart.products)
	}
	async addCart(cart) {
		let cartDb = await this.loadDb()
		
		if(cartDb.find(e => e.id === cart.id)) {
			return false
		}

		cart.setId(cartDb.length + 1)
		cartDb.push(cart)
		await this.saveDb(cartDb)

        return cart
    }
	async updateCart(id, products) {
		let cartDb = await this.loadDb()
		let index = cartDb.findIndex(e => e.id === parseInt(id))

		if (index !== -1) {
			let cart = cartDb[index]

			cart.products = products
			cartDb[index] = cart

			await this.saveDb(cartDb)
			return cart
		}
		
        console.warn(`updateCart: Error, no se encontro el carrito con el id: "${id}"`)
        return false
	}
	async saveDb(data) {
		const newDb = JSON.stringify(data, null, '\t')
		try {
			await fs.promises.writeFile(this.dbPath, newDb)
		} 
		catch (error) {
			let err = `El archivo ${this.dbPath} no pudo ser escrito. ${error}`
			throw new Error(err)
		}
	}
	async loadDb() {
		let db = []
		try {
			db = await fs.promises.readFile(this.dbPath, 'utf-8')
		} 
		catch (error) {
			console.warn(`El archivo ${this.dbPath} no pudo ser leido.`)
			return db
		}

		try {
			return JSON.parse(db)
		} 
		catch (error) {
			let err = `El archivo ${this.dbPath} no tiene un formato JSON válido.`
			throw new Error(err)
		}
	}
}

class Cart {
	constructor(id=null, products=[]) {
		this.id = id
		this.products = products
	}
	setId(id) {
		this.id = id
	}
	addProduct(pid) {
		let productExists = this.products.find(e => e.id === parseInt(pid))
		if(productExists) {
			productExists.quantity++
			return
		}
		let product = {
			id: parseInt(pid), 
			quantity: 1
		}

		this.products.push(product)
	}
}

export { CartManager, Cart }