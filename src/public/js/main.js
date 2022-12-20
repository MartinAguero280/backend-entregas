//import { json } from "express/lib/response";

const socket = io();

const productsContainer = document.getElementById("productsRealTime");
const createProductForm = document.getElementById("createProductForm")

socket.on("products", (products) => {
    
    const allProductsElements = products.map((products) => `
    <h4>Title</h4>
    <p>${products.title}</p><br>

    <h4>Description</h4>
    <p>${products.description}</p><br>

    <h4>price</h4>
    <p>${products.price}</p><br>

    <h4>Code</h4>
    <p>${products.code}</p><br>

    <h4>Stock</h4>
    <p>${products.stock}</p><br>

    <h4>Status</h4>
    <p>${products.status}</p><br>

    <h4>Category</h4>
    <p>${products.category}</p><br>

    <h4>Id:</h4>
    <p>${products.id}</p><br>
    <hr>
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