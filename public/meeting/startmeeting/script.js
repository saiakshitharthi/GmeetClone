const socket = io('/');
const videoElement = document.getElementById('video-area');
<<<<<<< HEAD
var ActiveUsers = {};
var UserVideoOn = {};
const myPeer = new Peer(undefined);
myPeer.on('open', async function (id) {
=======
let ActiveUsers = {};
let UserVideoOn = {};
let UserScreenShareOn = {};
let UserStreamwithId = {};
let UserIdName = {};
UserIdName[USER_ID] = username;
let USER_ID_ScreenShare;
const myPeer = new Peer(undefined);
var myPeer2;
myPeer.on('open', async function (id) {
    // I am the new user.
>>>>>>> master
    USER_ID = id;
    socket.emit('join-room', ROOM_ID, id);
    console.log('My peer Id is: ', id);
    ActiveUsers[id] = 1;
<<<<<<< HEAD
});

var VideoDetails = {
=======
    myPeer2 = new Peer(USER_ID + 'ScreenShare');
    myPeer2.on('open', async (id) => {
        console.log('My other Peer id is:', id);

    });
    myPeer2.on('call', async function (call) {

        let userId = call.peer;
        console.log('I got a call');
        console.log(call);
        await call.answer();
        call.on('stream', async function (stream) {
            if (stream) {
                console.log('I am adding the Screen Share stream to video');
                console.log(stream);
                userId = userId.substring(0, userId.length - 11);

                console.log(userId);
                await addVideoStream(stream, userId, 1);
                console.log(ActiveUsers);
            }

        });
    });
});
console.log(myPeer2);

socket.on('alert',(username)=>{
    let text = `A user with id ${username} has a request to join? Would you allow?`;
    if(confirm(text)==true){
        socket.emit('alert',1);
    }
    else{
        socket.emit('alert',0);
    }
})
let ButtonDetails = {
    onVideoButton: 0,
    screenShareButton: 0,
};
let VideoDetails = {
>>>>>>> master
    HighlightedVideo: undefined,
    myVideo: undefined,
    myScreenShare: undefined,
    myVideoStream: undefined,
    myScreenStream: undefined,
};

<<<<<<< HEAD
//If userId is predefined:
// socket.emit('join-room', ROOM_ID,USER_ID);
socket.on('newuserjoined', async (ListofAllUsers, userId) => {
    console.log('A new user joined, connect new user with stream');
    // displayNewUser(userId);
    for (let i = 0; i < ListofAllUsers.length; i++) {
        ActiveUsers[ListofAllUsers[i]] = 1;
    }
    console.log(ListofAllUsers);
    console.log(VideoDetails);
    ConnecttonewUser(userId, VideoDetails.myVideoStream);
=======
let initializeVideoStreamSetup = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    VideoDetails.myVideoStream = stream;
    ButtonDetails.onVideoButton = 1;
    await addVideoStream(stream, USER_ID)

}
initializeVideoStreamSetup();
//If userId is predefined:
socket.on('newuserjoined', async (userId) => {
    console.log(`I got a message that new user joined!,with id = ${userId}`);
    displayNewUser(userId);
    ActiveUsers[userId] = 1;
    // console.log(VideoDetails);
    // I am sending my stream to the new user.
    ConnecttonewUser(userId, VideoDetails.myVideoStream);
    ConnecttonewUser(userId,VideoDetails.myScreenStream,1);
>>>>>>> master

});
socket.on('user-disconnected', async (userId) => {
    console.log('User Disconnected from ClientSide', userId);
    delete ActiveUsers[userId];
    console.log(ActiveUsers);
    if (document.getElementById(userId)) {
<<<<<<< HEAD
        document.getElementById(userId).remove();
    }

});

socket.on('newmessage', displaychat);
submit.addEventListener("click", () => {

    const submit = document.getElementById("submit");
    const text = document.getElementById("chatbox");
    displaychat(text.value, 1);
    socket.emit('new-chat', text.value, ROOM_ID);
    text.value = "";

=======
        var elem = document.getElementById(userId);
        document.getElementById(userId).parentNode.removeChild(elem);
    }
    if(document.getElementById(userId+'ScreenShare')){
        var elem = document.getElementById(userId);
        document.getElementById(userId).parentNode.removeChild(elem);
    }
});

socket.on('newmessage', displaychat);
submit.addEventListener("click", async () => {
    const submit = document.getElementById("submit");
    const text = document.getElementById("chatbox");
    displaychat(text.value, 1);
    await socket.emit('new-chat', text.value, ROOM_ID);
    text.value = "";
>>>>>>> master
}
)
function displayNewUser(userId) {
    const message = document.createElement("h3");
    message.setAttribute("class", 'userjoined');
    const content = document.createTextNode(userId + ' has joined the channel');
    message.appendChild(content);
    document.getElementById('message-area').append(message);

}
function displaychat(chat, sender) {
    console.log(chat);
    if (sender) {
        const message = document.createElement("h3");
        message.setAttribute("class", 'chat-display-sender')
        const content = document.createTextNode(chat);
        message.appendChild(content);
        document.getElementById('message-area').append(message);
    }
    else {
        const message = document.createElement("h3");
        message.setAttribute("class", 'chat-display')
        const content = document.createTextNode(chat);
        message.appendChild(content);
        document.getElementById('message-area').append(message);
    }
}
//ALL VIDEO STUFF!!----------------------------------------------------------------------------------------------
<<<<<<< HEAD

//VideoDetails Object, which stores current videos etc.



myPeer.on('call', async function (call) {
    var userId = call.peer;
=======
myPeer.on('call', async function (call) {

    let userId = call.peer;
>>>>>>> master
    console.log('I got a call');
    console.log(call);
    await call.answer(VideoDetails.myVideoStream);
    call.on('stream', async function (stream) {
        if (stream) {
            console.log('I am adding the call stream to video');
<<<<<<< HEAD
            await addVideoStream(stream, userId);
            ActiveUsers[userId] = 1;
=======
            console.log(stream);
            const tracks = await stream.getTracks();
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].enabled) {
                    await addVideoStream(stream, userId);
                    break;

                }
            }
            ActiveUsers[userId] = 1;
            UserStreamwithId[userId] = stream;
>>>>>>> master
            console.log(ActiveUsers);
        }

    });
<<<<<<< HEAD
    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then(stream => {
    //     console.log('I have answered the call');
    //     call.answer(stream);
    //     call.on('stream', async function (stream) {
    //         if (ActiveUsers[userId]) {
    //         }
    //         else {

    //             console.log('Atleast I came here');
    //             await addVideoStream(stream, userId);
    //             ActiveUsers[userId] = 1;
    //             console.log(ActiveUsers);

    //         }
    //     });

    // })
});
//Screen Share button------------

const ScreenShare = document.getElementById('screenShare');
ScreenShare.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia(
        {
            video: {
                mediaSource: "screen",
            }
        }
    )
    addVideoStream(stream, USER_ID, 1);
});

//--------------------------------

//Show Video from our side:
function ConnecttonewUser(userId, stream) {
    console.log('I am stream');
    console.log(stream);
    var call = myPeer.call(userId, stream);
    console.log('I am call');
    console.log(call);
    if (call) {
        call.on('stream', async function (stream) {
            if (ActiveUsers[userId]) {
            }
            else {
                if (stream) {
                    await addVideoStream(stream, userId);
                }
            }
        });
    }
}
//off Video button
=======
});
//--------------------------------
//Show Video from our side:
async function ConnecttonewUser(userId, stream, isScreenShare) {
    if (isScreenShare) {
        let ScreenShareUser = userId + 'ScreenShare'
        console.log(ScreenShareUser);
        if ((ScreenShareUser) == (USER_ID_ScreenShare)) {
            return;
        }
        console.log('I am Screen Share stream');
        let call = await myPeer2.call(ScreenShareUser, stream);
        if (call) {
            call.on('stream', async function (stream) {
                if (stream) {
                    await addVideoStream(stream, userId, 1);
                }
            })
        }

    }
    else {
        if (userId == USER_ID) {
            return;
        }
        console.log('I am stream');
        console.log(stream);
        // stream.isVideoOn = ButtonDetails.onVideoButton;
        let call = await myPeer.call(userId, stream);
        if (call) {
            call.on('stream', async function (stream) {

                if (stream) {
                    UserStreamwithId[userId] = stream;
                    await addVideoStream(stream, userId);
                }
            });
        }
    }

}
//---------------------------------------------------------
//Onning Video:
const onVideo = document.getElementById('onVideo');
onVideo.addEventListener('click', async () => {
    if (ButtonDetails.onVideoButton == 0) {
        await VideoDetails.myVideoStream.getTracks().forEach(track => (track.enabled = !track.enabled));
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     video: true,
        //     audio: true
        // });
        // // stream.video = false;
        // // stream.getTracks().forEach(track => track.enabled = !track.enabled);
        // console.log('This is Stream');
        // console.log(stream);
        // VideoDetails.myVideoStream = stream;

        // // for (let i = 0; i < Object.keys(ActiveUsers).length; i++) {
        // //     await ConnecttonewUser(Object.keys(ActiveUsers)[i], stream);
        // // }
        await addVideoStream(VideoDetails.myVideoStream, USER_ID);
        socket.emit('on-the-video', USER_ID);
        ButtonDetails.onVideoButton = 1;
    }
    else {
        ButtonDetails.onVideoButton = 0;
        delete UserVideoOn[USER_ID];
        console.log(VideoDetails.myVideo);
        await VideoDetails.myVideoStream.getTracks().forEach(track => (track.enabled = !track.enabled));
        // if (VideoDetails.myVideo) {
        //     console.log('My Video got removed');
        var curVideo = document.getElementById(USER_ID);
        if(curVideo){
            curVideo.remove();
        }
        // document.getElementById(USER_ID).remove();
        VideoDetails.myVideo = undefined;
        // }
        // if (VideoDetails.myVideoStream) {
        //     console.log('My Video Stream got removed');
        //     // await VideoDetails.myVideoStream.getTracks().forEach(track => track.stop());
        //     console.log('This played after I removed tracks');
        //     await VideoDetails.myVideoStream.getTracks().forEach(track => (console.log(track.enabled)));
        //     // VideoDetails.myVideoStream = undefined;
        // }
        socket.emit('video-off', 'Off the Video');
    }
});
socket.on('on-the-video', (userId) => {
    console.log('Some one with userId, ' + userId + ' Called Me');
    addVideoStream(UserStreamwithId[userId], userId);

});
>>>>>>> master
socket.on('off-the-video', (userId) => {
    console.log('off-video-request-fired');
    console.log(userId);
    UserVideoOn[userId] = 0;
    if (document.getElementById(userId)) {
<<<<<<< HEAD
        document.getElementById(userId).remove();
    }
});
const offVideo = document.getElementById('offVideo');
offVideo.addEventListener("click", async () => {
    delete UserVideoOn[USER_ID];
    console.log(VideoDetails.myVideo);
    if (VideoDetails.myVideo) {
        console.log('My Video got removed');
        await VideoDetails.myVideo.remove();
        VideoDetails.myVideo = undefined;
    }
    if (VideoDetails.myVideoStream) {
        console.log('My Video Stream got removed');
        await VideoDetails.myVideoStream.getTracks().forEach(track => track.stop());
        VideoDetails.myVideoStream = undefined;
    }
    socket.emit('video-off', 'Off the Video');
});
//Onning Video:
const onVideo = document.getElementById('onVideo');
onVideo.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    VideoDetails.myVideoStream = stream;
    await addVideoStream(stream, USER_ID);
    for (let i = 0; i < Object.keys(ActiveUsers).length; i++) {
        ConnecttonewUser(Object.keys(ActiveUsers)[i], stream);
    }
});
socket.on('call-user', (userId) => {
    console.log('Some one with userId, ' + userId + ' Called Me');
    ConnecttonewUser(userId, VideoDetails.myScreenStream);
});


//Highlighting Video:

const hightlightVideo = (videoElement) => {
    const highlightDiv = document.getElementById('highlighted-video');
    videoElement.remove();
    highlightDiv.append(videoElement);
    videoElement.setAttribute('class', 'col-8');
    videoElement.isHighlighted = true;
    if (VideoDetails.HighlightedVideo) {
        VideoDetails.HighlightedVideo.style.width = "200px";
        VideoDetails.HighlightedVideo.isHighlighted = false;
    }
    VideoDetails.HighlightedVideo = videoElement;

}
//adding Video Stream, and setting up things.

async function addVideoStream(stream, userId, isScreenShare) {
    console.log('I am add Video Stream function');
    if (UserVideoOn[userId]) {
        return;
    }
    console.log('I have passed the barrier of UserVideoOn');
    UserVideoOn[userId] = 1;
    const myVideo = document.createElement('video');
    myVideo.setAttribute('class', 'col-4');
    if (userId) {
        if (isScreenShare) {

            myVideo.setAttribute('id', userId + 'ScreenShare');
        }
        else {
            myVideo.setAttribute('id', userId);
        }
    }
    if (userId == USER_ID) {
        if (isScreenShare) {
            VideoDetails.myScreenShare = myVideo;
        }
        else {

            VideoDetails.myVideo = myVideo;
        }
    }
    myVideo.muted = true;
    myVideo.srcObject = stream;
    myVideo.addEventListener("loadedmetadata", () => {
        console.log('Video is Playing');
        myVideo.play();
        videoElement.append(myVideo);
        console.log(myVideo);
        myVideo.addEventListener('click', () => {
            if (myVideo.isHighlighted) {
                myVideo.setAttribute('class', 'col-4');
                myVideo.isHighlighted = false;
                if (VideoDetails.HighlightedVideo == myVideo) {
                    VideoDetails.HighlightedVideo = undefined;
                }
            }
            else {
                hightlightVideo(myVideo);
            }
        })
    });
=======
        var elem = document.getElementById(userId);
        elem.remove();
        // document.getElementById(userId).parentNode.removeChild(elem);
    }
});

//Sharing screen to all
const screenShare = document.getElementById('screenShare');
screenShare.addEventListener('click', async () => {
    if (myPeer2 == undefined) {
        console.log('myPeer2 variable is not defined');
        return;
    }
    console.log('Screen SHare button was clicked!');
    console.log(ActiveUsers);
    if (!VideoDetails.myScreenShare) {
        const stream = await navigator.mediaDevices.getDisplayMedia(
            {
                video: {
                    mediaSource: "screen",
                }
            }
        );
        if (stream) {

            await addVideoStream(stream, USER_ID, 1);
            VideoDetails.myScreenStream = stream;
            console.log('My screen share stream is ');
            console.log(stream);
            for (let i = 0; i < Object.keys(ActiveUsers).length; i++) {
                await ConnecttonewUser(Object.keys(ActiveUsers)[i], stream, 1);
            }
            ButtonDetails.screenShareButton = 1;
        }
    }
    else {
        ButtonDetails.screenShareButton = 0;
        await VideoDetails.myScreenStream.getTracks().forEach(track => track.stop());
        VideoDetails.myScreenShare = undefined;
        UserScreenShareOn[USER_ID] = 0;
        socket.emit('screen-share-off', USER_ID);
        console.log('I have sent message through socket');
        let screenShareid = USER_ID + 'ScreenShare';
        if (document.getElementById(screenShareid)) {
            document.getElementById(screenShareid).remove();
        }
    }
});
socket.on('screen-share-off', userId => {
    console.log('I got screen share off request from server');
    let screenShareid = userId + 'ScreenShare';
    UserScreenShareOn[userId] = 0;
    if (document.getElementById(screenShareid)) {
        var elem = document.getElementById(screenShareid);
        document.getElementById(screenShareid).parentNode.removeChild(elem);
    }
})
//----------------------------------------------------------
//Highlighting Video:

//--------------------------------------------------------
//adding Video Stream, and setting up things.
//Video Element name is user name, 
async function addVideoStream(stream, userId, isScreenShare) {
    console.log('I am add Video Stream function');
    //if already users video is On!
    if(!stream){
        return;
    }
    if (isScreenShare) {
        if(UserScreenShareOn[userId]){
            return;
        }
        UserScreenShareOn[userId] = 1;
        const myVideo = document.createElement('video');
        const newVideodiv = document.createElement('div');
        const foot = document.createElement('p');
        const node = document.createTextNode(userId);
        foot.appendChild(node);
        newVideodiv.setAttribute('id', userId + 'ScreenShare');
        newVideodiv.setAttribute('class','innervideo');
        if (userId == USER_ID) {
            
            VideoDetails.myScreenShare = myVideo;
            
        }
        // myVideo.muted = true;
        myVideo.srcObject = stream;
        myVideo.addEventListener("loadedmetadata", () => {
            console.log('Video is Playing');
            myVideo.play();
            newVideodiv.append(myVideo);
            newVideodiv.append(foot);
            videoElement.append(newVideodiv);
            console.log(myVideo);
        });
    }
    else {
        if (UserVideoOn[userId]) {
            return;
        }

        UserVideoOn[userId] = 1;
        const myVideo = document.createElement('video');
        const newVideodiv = document.createElement('div');
        const foot = document.createElement('p');
        const node = document.createTextNode(userId);
        foot.appendChild(node);
        newVideodiv.setAttribute('id', userId);
        newVideodiv.setAttribute('class','innervideo');
            
        
        if (userId == USER_ID) {
            
            VideoDetails.myVideo = myVideo;
        }
        myVideo.muted = true;
        myVideo.srcObject = stream;
        myVideo.addEventListener("loadedmetadata", () => {
            console.log('Video is Playing');
            myVideo.play();
            newVideodiv.append(myVideo);
            newVideodiv.append(foot);
            videoElement.append(newVideodiv);
            console.log(myVideo);
        });
    }
>>>>>>> master
}
