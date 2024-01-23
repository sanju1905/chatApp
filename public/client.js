const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// do {
//   name = prompt("Enter the User Name:");
// } while (!name);

// textarea.addEventListener("keyup", (e) => {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     sendMessage(e.target.value);
//   }
// });

// function sendMessage(message) {

//   let msg = {
//     user: name,
//     message: message.trim(),
//   };

//   //append

//   appendMessage(msg, "outgoing");
//   textarea.value=''
//   scrollToBottom()

//   // send mweeage to server

//   socket.emit("message", msg);
// }

// function appendMessage(msg, type) {

//   let mainDiv = document.createElement("div");
//   let className = type;
//   mainDiv.classList.add(className, "message");

//   let markup = `
// <h4>${msg.user}</h4>
// <p>${msg.message}</p>
// `;

//   mainDiv.innerHTML = markup;
//   messageArea.appendChild(mainDiv);
// }
// //recive the message
// socket.on('message',(msg)=>{
//     appendMessage(msg,'incoming')
//     scrollToBottom()
//   })

//   function scrollToBottom() {
//     messageArea.scrollTop = messageArea.scrollHeight
// }


let draggableBox = document.getElementById('draggableBox'); // Reference to the draggable box



// Receive box position updates from the server
socket.on('boxPosition', (position) => {
  // Set the new position received from the server
  draggableBox.style.left = position.x + 'px';
  draggableBox.style.top = position.y + 'px';
});

// Set the initial box position
socket.on('initialBoxPosition', (position) => {
  draggableBox.style.left = position.x + 'px';
  draggableBox.style.top = position.y + 'px';
});

// Make the box draggable
let offsetX, offsetY, isDragging = false;

// Event listener for mouse down on the draggable box
draggableBox.addEventListener('mousedown', (e) => {
  // Set the dragging flag to true
  isDragging = true;

  // Calculate the offset of the mouse click relative to the top-left corner of the box
  offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
  offsetY = e.clientY - draggableBox.getBoundingClientRect().top;

  // Add the 'dragging' class to apply specific styling
  draggableBox.classList.add('dragging');
});

// Event listener for mouse move
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    // Calculate the new position of the box based on the mouse movement
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Set the new position using the 'left' and 'top' CSS properties
    draggableBox.style.left = x + 'px';
    draggableBox.style.top = y + 'px';

    // Emit the new position to the server
    socket.emit('boxPosition', { x, y });
  }
});

// Event listener for mouse up
document.addEventListener('mouseup', () => {
  if (isDragging) {
    // Reset the dragging flag to false
    isDragging = false;

    // Remove the 'dragging' class to revert the styling
    draggableBox.classList.remove('dragging');
  }
});
