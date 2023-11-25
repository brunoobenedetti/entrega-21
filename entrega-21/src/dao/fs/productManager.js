import fs from 'fs'

const filePath = './src/modules/productos.json'

class ProductManager {
    constructor() {
		this.dbPath = filePath
    }
	validateProps({title, description, code, price, stock}) {
		return (title && description && code && price && stock)
	}
	async deleteProduct(id) {
		let productsDb = await this.loadDb()
		let index = productsDb.findIndex(e => e.id === parseInt(id))
		if (index !== -1) {
			productsDb.splice(index, 1)
			await this.saveDb(productsDb)
            console.log(`deleteProduct: Producto id:${id}, borrado con exito.`)
			return true
		}
        console.warn(`deleteProduct: Error, no se encontro el producto con el id: "${id}"`)
		return false
	}
	async updateProduct(id, {title, description, code, price, status, stock, thumbnail}) {
		let productsDb = await this.loadDb()
		let index = productsDb.findIndex(e => e.id === parseInt(id))

		if (index !== -1) {
			let product = productsDb[index]

			title && (product.title = title)
			description && (product.description = description)
			code && (product.code = code)
			price && (product.price = parseFloat(price))
			if(status) {
    			status === "false" ? product.status = false : product.status = true
			}
			stock && (product.stock = parseInt(stock))
			thumbnail && (product.thumbnail = thumbnail)
	
			productsDb[index] = product

			await this.saveDb(productsDb)
            console.log(`updateProduct: Producto id:${productsDb[index].id}, updateado con exito.`)
			return product
		}
		
        console.warn(`updateProduct: Error, no se encontro el producto con el id: "${id}"`)
        return false
	}
	async getProducts() {
		return await this.loadDb()
	}
	async getProductById(id) {
		let products = await this.loadDb()
		return products.find(e => e.id === parseInt(id))
	}
	async addProduct(product) {
		if(!this.validateProps(product)) {
			console.warn(`addProduct: Error, todos los campos son obligatorios a excepcion de thumbnails`)
			return false
		}

		let productsDb = await this.loadDb()
		
		if(productsDb.find(e => e.code === product.code)) {
			console.warn(`addProduct: Error, ya existe un producto con el code: "${product.code}"`)
			return false
		}

		product.setId(productsDb.length + 1)
		productsDb.push(product)
		await this.saveDb(productsDb)

		console.log(`addProduct: Producto "${product.title}" (id:${product.id}), agregado con exito.`)
        return product
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

class Product {
	constructor(title, description, code, price, status=true, stock, thumbnail) {
		this.title = title
		this.description = description
		this.code = code
		this.price = price
        this.status = status
		this.stock = stock
		this.thumbnail = thumbnail
		this.id = null
	}
	setId(id) {
		this.id = id
	}
}

export { ProductManager, Product }