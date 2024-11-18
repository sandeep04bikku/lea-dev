require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const route_manager = require("./modules/v1/route_manager");
var apidoc = require("./modules/v1/api_document/index");

app.use(cors());


// Setting up express for text/json parser
// app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));


app.use('/v1/api_document/',apidoc);
app.use('', route_manager)








// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
//   });

try {
    app.listen(process.env.PORT);
    console.log(`Server ${process.env.PORT} is running`);
} catch (error) {
    console.log("Server failed: ", +error);
}

