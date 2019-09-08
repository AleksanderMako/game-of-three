require("dotenv").config();

function setApiUrl() {
    if (process.env.TOOL === "npm") process.env.SOCKET_URL = "http://localhost:3000";
    else process.env.SOCKET_URL = "http://api:3000";
}
module.exports = setApiUrl;