require('dotenv').config();
function getSocketUrl() {

    const tool = process.env.TOOL;
    if (tool === "npm") process.env.SOCKET_URL = "http://localhost:3000";
    else process.env.SOCKET_URL = "http://api:3000";
}
module.exports = getSocketUrl;