(function () {
    const testCartId = "6549554630bda401622de858"

    const addToCartButtons = document.querySelectorAll('.button_add_to_cart')
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.id
            fetch(`/api/carts/${testCartId}/products/${productId}`, { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    console.log(data, testCartId)
                    Swal.fire({
                        position: "center",
                        title: `Product successfully added to cart with id: ${testCartId}`,
                        showConfirmButton: true,
                        timer: 0
                      });
                })
            console.log("asd");
        })
    })
})()