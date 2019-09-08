require('dotenv').config();

function getDBConnectionStr() {

    if (process.env.ENV === "production") {
        if (process.env.TOOL === "npm") return process.env.MONGO_ATLAS;
        return process.env.MONGODB_URL;

    } else if (process.env.ENV === "test") {
        if (process.env.TOOL === "npm") return process.env.MONGO_ATLAS_TEST;
        return process.env.MONGODB_URL_TEST;

    }
}
module.exports = {
    getDBConnectionStr
}