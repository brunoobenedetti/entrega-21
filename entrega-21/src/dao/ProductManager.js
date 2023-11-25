import ProductModel from './models/product.model.js'
import { Exception } from '../utils.js'
import { bsonToObject } from '../utils.js'

class ProductManager {
	static async productExists(pid) {
		console.log((await ProductModel.findOne({_id: pid})))
		try {
			return await ProductModel.findOne({_id: pid})
		} 
		catch (error) {
			return false
		}
	}
	static async deleteProduct(id) {
		if (await this.productExists(id)) {
			await ProductModel.deleteOne({_id: id})
		} else {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}
	static async updateProduct(id, options) {
		if (!await ProductModel.updateOne({_id: id}, { ...options })) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
		return await this.getProductById(id)
	}
	static async getProducts(limit=2, queryPage=1, querySort=null, queryFilters=null) {
		isNaN(queryPage) && (queryPage = 1)
		isNaN(limit) && (limit = 10)
		limit == 0 && (limit = 9999)

		let query = {}
		let sort = {price: querySort}
		querySort == 'desc' || querySort == 'asc' || (sort = {})

		if(queryFilters) {
			const { status, category } = queryFilters
			if(status && status == 'true' || status == 'false' ) {
				query = {status: status}
			}
			category && (query = { 
				...query, 
				category: category.toLowerCase()
			})
		}

		const { docs, totalPages, prevPage, nextPage, 
		page, hasPrevPage, hasNextPage } = await ProductModel.paginate(query, {limit, page:queryPage, sort})

		if(page > totalPages) {
			throw new Exception(`Page "${page}" not found`, 404)
		}

		return { 
			status: '201', 
			payload: bsonToObject(docs),
			totalPages,
			prevPage,
			nextPage,
			page,
			hasPrevPage,
			hasNextPage
		}
	}
	static async getProductById(id) {
		try {
			const product = await ProductModel.findOne({_id: id})
			return { 
				...product._doc
			}
		}
		catch (error) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}
	static async addProduct(productData) {
		try {
			productData.category = productData.category.toLowerCase()
			await ProductModel.create(productData)
		}
		catch (error) {
			if (error.code === 11000) {
				throw new Exception(`Product with code "${productData.code}" already exists. code must be unique`, 409)
			}
			throw new Exception("Product data is not valid", 400)
		}
    }
}

export default ProductManager