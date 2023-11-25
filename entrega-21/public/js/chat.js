(function () {
    const chatContainer = document.getElementById('chat')
    const formChat = document.getElementById('chat_form')
    const inputUser = document.getElementById('user_input')
    const inputMsg = document.getElementById('msg_input')

    const socket = io()

    formChat.addEventListener('submit', (e) => {
        e.preventDefault()
        const newMessage = { 
            user: inputUser.value, 
            message: inputMsg.value, 
        }
        socket.emit('new-message', newMessage)
        inputMsg.value = ''
        inputMsg.focus()
    })
    
    function updateMessage({user, message}) {
        
        const div = document.createElement('div')
        div.classList.add('chat_msg')
        div.innerHTML = `<p><strong>${user}:</strong> ${message}</p>`
        chatContainer.appendChild(div)
        chatContainer.scrollTop = chatContainer.scrollHeight
    }
    
    socket.on('update-message', ({user, message}) => {
        updateMessage({user, message})
    })

    socket.emit('send-chat')
})()