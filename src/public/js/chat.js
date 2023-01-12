const socket = io();

let user;
let chatBox = document.getElementById("cahtBox")

swal.fire({
    title: "bienvenido al chat!!",
    text: "Introduce tu nombre",
    input: "text"
})