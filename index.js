const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

// const urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot'

//run when the client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);
    socket.join(user.room)

    //welcome thr current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })



  //listen for chatmessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //run when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

      //send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }

  });

});

// const urlencodedParser = bodyParser.urlencoded({ extended: false});
const port = process.env.PORT || 3000;

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts)

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());


app.set("layout", "./layouts/main");
app.set("view engine", 'ejs');



const routes = require('./server/routes/recipeRoutes.js');
app.use("/", routes)

app.get('/chatnow', function (req, res) {
  // console.log(req.body)
  //res.render('chat', {data: req.body})
  res.render('chat')
})



server.listen(port, () => console.log(`listening on port${port}`));