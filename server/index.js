const express = require('express');
const cors = require('cors');
const controllers = require("./controllers/user")
const mongoose = require("mongoose");
const app = express()
const employeeRoutes = require("./routes/users")
const path = require("path");
const bodyParser = require("body-parser")
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

const PORT = process.env.port || 8080;
app.use("/files", express.static("./public/files"));
// app.use("/uploads", express.static("./public/files"));

app.get('/', employeeRoutes);
app.get('/employeeExport', employeeRoutes);
app.post("/employeeImport", employeeRoutes);
app.post("/create", employeeRoutes);
app.put("/update", employeeRoutes);
app.delete("/delete/:id", employeeRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/crudoperation", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to Database")
        app.listen(PORT, () => console.log(`server is running on port number ${PORT}`))
    })
    .catch((err) => { console.log(err) })
