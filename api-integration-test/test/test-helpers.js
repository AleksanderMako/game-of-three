function registerHelper(socket) {
    return new Promise((resolve, reject) => {
        socket.emit("register", "");
        socket.on("welcome", () => { });
        socket.on("register-response", function (registrationParameters) {
            console.log("DEBUG: "+JSON.stringify(registrationParameters));
            resolve(registrationParameters);
        });
    });

}
function getNumberHelper(socket) {
    return new Promise((resolve, reject) => {
        socket.on("get-number", function (number) {
            console.log("DEBUG: "+number);
            resolve(number)
        });
    });
}

function sendNumberHelper (socket,payload) {
    return new Promise((resolve,reject)=>{
        socket.emit("number", payload,function(ack){
            if (ack) resolve();
            reject();
        });
    });
}
module.exports = {
    registerHelper,
    getNumberHelper,
    sendNumberHelper
}