require('dotenv').config();
function setEnvVariables() {

    const tool = process.env.TOOL;
    if (tool === "npm"){
        process.env.SOCKET_URL = "http://localhost:3000";
        process.env.LOW=3;
        process.env.HIGH=2000;
    } 
    else process.env.SOCKET_URL = "http://api:3000";
}
module.exports = setEnvVariables;