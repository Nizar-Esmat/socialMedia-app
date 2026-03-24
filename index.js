import express from "express";
import bootStrap from "./src/app.controller.js";

const app = express();


bootStrap(app, express)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
});