var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'asaiakshith03@gmail.com',
        pass: 'fhpcvpluyrrdwdhg'
    }
});
var hostName = "localhost:3000";
function giveText(username,roomId){

    var text = "Hello! "+ username + "\n. Here is a gentle remainder for your meet. Your meet will start in less than 15 minutes.\n"+ "Here is the meeting Link:\n" +  hostName+ "/meeting/startmeeting/" + roomId;
    return text;
}
var mailOptions = {
    from: 'asaiakshith03@gmail.com',
    to: 'sowjanyaarthi@gmail.com',
    subject: 'Gentle remainder about your scheduled meet!',
    text: 'Pampina choosko'
}

async function emailSender(email){
    
    return new Promise((resolve, reject)=>{
        mailOptions.to = email;
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                reject(error);
            }
            else{
                resolve(info);
            }
        });
    })
    
}
async function sendEmailtoUsers(userEmails){
    
    for(let i = 0;i<userEmails.length;i++){
        await emailSender(userEmails[i]);
        console.log("Sent Email to " + userEmails[i]);
    }
};
module.exports = sendEmailtoUsers;
