require('dotenv').config();

function getDBConnectionStr() {

    if(process.env.TOOL === "npm") return process.env.MONGO_ATLAS;
    return process.env.MONGODB_URL;
}
module.exports = {
    getDBConnectionStr
}