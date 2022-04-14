const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDb = require("./db/connect")
const port = process.env.PORT || 5000;

connectDb()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tags", require("./routes/tagRoutes"));

//Serve frontend  "client side"
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"))
    });
}else{
    app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})