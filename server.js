// const express=require("express")
// const app=express()

// const PORT =process.env.PORT || 3000
// const http=require("http").createServer(app)
// http.listen(PORT,()=>{
//     console.log(`Server is running at ${PORT}`)
// })

// app.use(express.static(__dirname + '/public'))
// app.get('/',(req,res)=>{
//     res.sendFile(__dirname + '/index.html')
// })


// //Socket connection
// const io=require('socket.io')(http)
// io.on('connection',(socket)=>{
//     console.log("Connected..")
//     socket.on('message',(msg)=>{
//       socket.broadcast.emit('message',msg)
//     })

//       // Handle box position updates
//   socket.on('boxPosition', (position) => {
//     // Broadcast the new position to all connected clients
//     socket.broadcast.emit('boxPosition', position);
//   });
// })

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);
http.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket connection
const io = require('socket.io')(http);

// Keep track of the client with control access
let controllingClientSocket = null;

io.on('connection', (socket) => {
  console.log("Connected..");

  // Assign control access to the first connected client
  if (!controllingClientSocket) {
    controllingClientSocket = socket;
    socket.emit('controlAccess', true);
  } else {
    socket.emit('controlAccess', false);
  }

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });

  // Handle box position updates only for the controlling client
  socket.on('boxPosition', (position) => {
    if (socket === controllingClientSocket) {
      // Broadcast the new position to all connected clients
      socket.broadcast.emit('boxPosition', position);
    }
  });
});


