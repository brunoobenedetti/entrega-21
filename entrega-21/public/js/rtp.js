(function () {
    const formAdd = document.getElementById('form_add_product')
    const inputName = document.getElementById('input_product_name')
    const inputPrice = document.getElementById('input_product_price')
    const inputStock = document.getElementById('input_product_stock')
    const inputDescription = document.getElementById('input_product_description')
    const inputCode = document.getElementById('input_product_code')
    const inputCat = document.getElementById('input_product_category')

    const formDelete = document.getElementById('form_delete_product')
    const inputDelete = document.getElementById('input_product_id')

    const socket = io()

    formAdd.addEventListener('submit', (e) => {
        e.preventDefault()
        const newProduct = { 
            name: inputName.value, 
            price: inputPrice.value, 
            stock: inputStock.value, 
            description: inputDescription.value,
            code: inputCode.value,
            category: inputCat.value
        }

        socket.emit('new-product', newProduct)
        // inputName.value = ''
        // inputPrice.value = ''
        // inputStock.value = ''
        // inputDescription.value = ''
        inputCode.value = ''
    })

    formDelete.addEventListener('submit', (e) => {
        e.preventDefault()
        socket.emit('delete-product', inputDelete.value)
        inputDelete.value = ''
        inputDelete.focus()
    })

    function updateProducts(newProducts) {
        const productsCont = document.querySelector('.products_container')
        productsCont.innerHTML = ''
            
        newProducts.forEach((e) => {
            const product = document.createElement('div')
            product.classList.add('product')
            product.id = e.id
            product.innerHTML = `
                <p><strong>ID: </strong>${e._id}</p>
                <p><strong>Nombre: </strong>${e.title}</p>
                <p><strong>Precio: </strong>${e.price.$numberDecimal}</p> 
                <p><strong>Categoria: </strong>${e.category}</p>
                <p>Stock:${e.stock}</p>
                <p>Descripción:${e.description}</p>`
            productsCont.appendChild(product)
        })
    }

    socket.on('update-products', (products) => {
        updateProducts(products)
    })

    socket.on('error-adding', (error) => {
        console.log(error)
        Swal.fire({
            position: "center",
            icon: 'error',
            title: `Error adding product`,
            text: error,
            showConfirmButton: true,
            timer: 0
        });
    })

    socket.emit('send-products')
})()