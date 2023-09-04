const mongoose = require("mongoose");
// Schema 
const schemaData = mongoose.Schema({
    employee: String,
    name: String,
    email: String,
    photo: String,
    phoneNumber: String,
    birthDate: String,
}, {
    timestamps: true
})

userModel = mongoose.model("user", schemaData)
module.exports = userModel;