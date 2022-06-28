const socket = io('/');
const videoElement = document.getElementById('video-area');
var ActiveUsers = {};
var UserVideoOn = {};
const myPeer = new Peer(undefined);
myPeer.on('open', async function (id) {
    USER_ID = id;
    socket.emit('join-room', ROOM_ID, id);
    console.log('My peer Id is: ', id);
    ActiveUsers[id] = 1;
});

var VideoDetails = {
    HighlightedVideo: undefined,
    myVideo: undefined,
    myScreenShare: undefined,
    myVideoStream: undefined,
    myScreenStream: undefined,
};

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

});
socket.on('user-disconnected', async (userId) => {
    console.log('User Disconnected from ClientSide', userId);
    delete ActiveUsers[userId];
    console.log(ActiveUsers);
    if (document.getElementById(userId)) {
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

//VideoDetails Object, which stores current videos etc.



myPeer.on('call', async function (call) {
    var userId = call.peer;
    console.log('I got a call');
    console.log(call);
    await call.answer(VideoDetails.myVideoStream);
    call.on('stream', async function (stream) {
        if (stream) {
            console.log('I am adding the call stream to video');
            await addVideoStream(stream, userId);
            ActiveUsers[userId] = 1;
            console.log(ActiveUsers);
        }

    });
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
socket.on('off-the-video', (userId) => {
    console.log('off-video-request-fired');
    console.log(userId);
    UserVideoOn[userId] = 0;
    if (document.getElementById(userId)) {
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
}
