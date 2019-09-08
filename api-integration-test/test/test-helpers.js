function registerHelper(socket) {
    return new Promise((resolve, reject) => {
        socket.emit("register", "");
        socket.on("welcome", () => {});
        socket.on("register-response", function (registrationParameters) {
            resolve(registrationParameters);
        });
    });

}

function getNumberHelper(socket) {
    return new Promise((resolve, reject) => {
        socket.on("get-number", function (number) {
            resolve(number)
        });
    });
}

function sendNumberHelper(socket, payload) {
    return new Promise((resolve, reject) => {
        socket.emit("number", payload, function (ack) {
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