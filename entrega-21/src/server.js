import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import ProductManager from './dao/ProductManager.js'
import ChatManager from './dao/ChatManager.js'
import { init } from './db/mongodb.js'
import CartManager from './dao/CartManager.js'

await init()

const server = http.createServer(app)
const socketServer = new Server(server)
const PORT = 8080

const getProducts = async () => {
    return (await ProductManager.getProducts(0)).payload
}

socketServer.on('connection', async (socket) => {
    // Productos
    socket.on('send-products', async () => {
        socketServer.emit('update-products', await getProducts())
    })

    socket.on('new-product', async ({name, price, stock, description, code, category}) => {
        const testThumbnail = './thumbnail1.webp'
        const newProduct = {
            title:name, 
            description, 
            code, 
            price, 
            status:true, 
            stock, 
            thumbnail:testThumbnail,
            category: category
        }
        try {
            await ProductManager.addProduct(newProduct)
        }
        catch (error) {
            socketServer.emit('error-adding', error.message)
            return
        }
    
        socketServer.emit('update-products', await getProducts())
    })
    
    socket.on('delete-product', async (pid) => {
        await ProductManager.deleteProduct(pid)
        socketServer.emit('update-products', await getProducts())
    })
    
    // Chat
    socket.on('send-chat', async () => {
        socket.emit('update-chat', await ChatManager.getMessages())
    })

    socket.on('new-message', async ({user, message}) => {
        await ChatManager.addMessage({user, message})
        socketServer.emit('update-message', {user, message})
    })
})

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}/login`)
})