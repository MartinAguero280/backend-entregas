document.addEventListener('DOMContentLoaded', () => {
    const purchaseCartButton = document.getElementById('purchaseCartButton');

    purchaseCartButton.addEventListener('click', (event) => {
            const cartId = event.target.dataset.cartId;

            fetch(`/carts/${cartId}/purchase`, {
                    method: 'POST'
                });
                location.reload()
    });


    const deleteProductInCartButton = document.querySelectorAll('.deleteProductInCartButton');

    deleteProductInCartButton.forEach(button => {
        button.addEventListener('click', (event) => {
            const cartId = event.target.dataset.cartId;
            const productInCartId = event.target.dataset.productId

            fetch(`/api/carts/${cartId}/product/${productInCartId}`, {
                    method: 'DELETE'
                });
                location.reload()
        });
    });

    const deleteCartButton = document.getElementById('deleteCartButton');

    deleteCartButton.addEventListener('click', (event) => {
            const cartId = event.target.dataset.cartId;

            fetch(`/api/carts/${cartId}`, {
                    method: 'DELETE'
                });
                location.reload()
    });
});