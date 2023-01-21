

const socket = io();

const productsContainer = document.getElementById("productsRealTime");
const createProductForm = document.getElementById("createProductForm")

socket.on("products", (products) => {
    
    const allProductsElements = products.map((products) => `
    <tr>
        <th scope="row"> ${products.title} </th>
        <th> ${products.description} </th>
        <th> ${products.price} </th>
        <th> ${products.code} </th>
        <th> ${products.stock} </th>
        <th> ${products.status} </th>
        <th> ${products.category} </th>
    </tr>
    `)
    .join(" ");

    productsContainer.innerHTML = allProductsElements;

})

createProductForm.addEventListener('submit',async (event) => {
    event.preventDefault();

    const product = {}
    const formData = new FormData(createProductForm);

    for (const field of formData.entries()) {
        product[field[0]] = field[1];
    }

    await fetch("/api/products", {
        body: JSON.stringify(product),
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    })
})