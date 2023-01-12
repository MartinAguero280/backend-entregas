const socket = io();

let user;
let chatBox = document.getElementById("chatBox")

swal.fire({
    title: "bienvenido al chat!!",
    text: "Introduce tu nombre",
    input: "text",
    inputValidator: value => {
        return !value && "Necesita un nombre"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    let txtUserName = document.getElementById("username");
    txtUserName.innerHTML = user;
    socket.emit("authenticated", user)
});

chatBox.addEventListener("keyup", event => {
    if (event.key == "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user,
                message: chatBox.value
            })
            chatBox.value = ""
        }
    }
})

socket.on("messageLogs", data => {
    let log = document.getElementById("messageLogs");

    let messages = "";

    data.forEach(message => {
        messages += `<b>${message.user}</b>: ${message.message}<br>`
    })

    log.innerHTML = messages
})