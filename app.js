var express = require('express');
const { Socket } = require('socket.io');
var app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const url = "mongodb://localhost:27017/chat_app";
const userRoute = require('./routes/user');
const meetingRoute = require('./routes/meeting');
const flash = require('connect-flash');

app.use(session({
    secret: 'whatever you want',
    resave: false,
    saveUninitialized: false
}));
mongoose.connect(url).then((ans) => {
    console.log("ConnectedSuccessfully")
}).catch((err) => {
    console.log("Error in the Connection")
})
app.set('view engine', 'ejs');
//in the below line, if you use a route as /something/id, then that will look at something folder in public.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//models
var User = require('./models/user');
var Meeting = require('./models/meetings');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var CurrentUserID = null;
//When you even redirect from any route, it will come below first, I mean the request will re propagate.
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure') || req.flash('error');
    if(req.user){
        CurrentUserID = req.user._id;
    }
    else{
        CurrentUserID = null;
    }
    next();
})


app.use("/user",userRoute);   
app.use("/meeting",meetingRoute);   
app.get('/', (req, res) => {
    res.render('home.ejs');
})

//To answer, why this roomId and userId is still valid, assume that you are running a function witch socket, and there are many places where you are running the function. Now, the function is a infinite function, and whenever you delete, then it will emit that in that particular event. thats it 
const ListofAllUsers = [];
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        ListofAllUsers.push(userId);
        console.log('LIST OF ALL USERS');
        console.log(ListofAllUsers);
        console.log(roomId, userId);
        socket.join(roomId);
        // console.log(roomId, userId );
        io.to(roomId).emit('newuserjoined', ListofAllUsers,userId);
        socket.on('pass-video', ()=>{
            console.log('I have just turned on my video, my name is I have emitted message', userId);
            socket.to(roomId).emit('call-user',userId);
        })
        socket.on('disconnect', () => {
            console.log('User disconnected');
            const index = ListofAllUsers.indexOf(userId);
            if(index>-1){
                ListofAllUsers.splice(index,1);            
            }
            console.log(userId);
            socket.to(roomId).emit('user-disconnected', userId);

        });
        socket.on('video-off',()=>{
            console.log('User Video is OFF');
            console.log(userId);
            socket.to(roomId).emit('off-the-video', userId);
        })
    })
    socket.on('new-chat', (message, roomId) => {
        console.log(message);
        socket.to(roomId).emit('newmessage', message);
    })
});

server.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected!");
    }
})
