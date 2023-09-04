const nodemailer = require('nodemailer');
const userModel = require("../model/userModel")
const csv = require("fast-csv");
const fs = require("fs");
const csv2 = require('csvtojson');
const ITEMS_PER_PAGE = 5;

// Reading the data
const fetchData = async (req, res) => {
    try {
        const data = await userModel.find({})
        const page = req.query.page || 1;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        const itemsOnPage = data.slice(startIndex, endIndex);
        res.json({
            items: itemsOnPage,
            currentPage: page,
            totalPages: Math.ceil(data.length / ITEMS_PER_PAGE),
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error in fetching data:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

// Export csv
const exportEmployee = async (req, res) => {
    try {
        const employeeData = await userModel.find({});

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/")
            }

            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export")
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        )

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `http://localhost:8080/files/export/users.csv`
            })
        })

        if (employeeData.length > 0) {
            employeeData.map((employee) => {
                csvStream.write({
                    employee: employee.employee ? employee.employee : "",
                    name: employee.name ? employee.name : "",
                    email: employee.email ? employee.email : "",
                    phoneNumber: employee.phoneNumber ? employee.phoneNumber : "",
                    birthDate: employee.birthDate ? employee.birthDate : "",
                })
            })
        }

        csvStream.end();
        writablestream.end();
    } catch (error) {
        console.log(error)
    }
}

// Import csv 
const importEmployee = (req, res) => {
    console.log(req);
    try {
        let employeeData = [];
        csv2()
            .fromFile(req.file.path)
            .then(async (res) => {
                for (var i = 0; i < res.length; i++) {
                    employeeData.push({
                        employee: res[i].employee,
                        name: res[i].name,
                        email: res[i].email,
                        phoneNumber: res[i].phoneNumber,
                        birthDate: res[i].birthDate
                    })
                }
                await userModel.insertMany(employeeData)
            })
        res.send({ status: 200, success: true, message: "csv imported" })
    } catch (error) {
        res.send({ status: 400, success: false, message: error.message })
    }
}

// Creating
const createRecord = async (req, res) => {
    try {
        const data = new userModel({
            employee: req.body.employee,
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
            phoneNumber: req.body.phoneNumber,
            birthDate: req.body.birthDate,
        });
        await data.save()
        res.send({ success: true, message: "Data created succesfully", data: data })

        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Update with your email service
            auth: {
                user: 'jaydeepmane4329@gmail.com',
                pass: 'fjwmhpncjxsmuuau',
            },
        });

        // Setup email data
        const mailOptions = {
            from: 'jaydeepmane4329@gmail.com',
            to: data.email,
            subject: 'Form Submission Confirmation',
            text: 'Welcome!',
        };

        // Send the email
        transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
};

// updating the data  
const updateRecord = async (req, res) => {
    try {
        const { _id, ...rest } = req.body

        const data = await userModel.updateOne({ _id: _id }, rest)
        res.send({ success: true, message: "Data Updated successfully", data: data })
    } catch (error) {
        console.error('Error in updating data:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

const deleteRecord = async (req, res) => {
    try {
        const id = req.params.id
        const data = await userModel.deleteOne({ _id: id })
        res.send({ success: true, message: "data deleted succesfully", data: data })
    } catch (error) {
        console.error('Error in deleting  data:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

module.exports = {
    fetchData,
    exportEmployee,
    importEmployee,
    createRecord,
    updateRecord,
    deleteRecord
}