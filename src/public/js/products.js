
const addToCartButton = document.querySelectorAll('.addToCartButton');

addToCartButton.forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.dataset.productId;
        const cartId = event.target.dataset.cartId;

        fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST'
            });
            location.reload()
    });
});

const deleteProductButton = document.querySelectorAll('.deleteProductButton');

deleteProductButton.forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.dataset.productId;
        const productOwner = event.target.dataset.productOwner

        fetch(`/api/products/${productId}?productOwner=${productOwner}`, {
                method: 'DELETE'
            });
            location.reload()
    });
});
