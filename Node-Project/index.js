import express from "express";
const app = express();

const port = process.env.PORT || 8080;


//routes
app.get("/",(req,res)=>{
    res.type("text/plain")
    res.send("Hello My First backend project ")
})

app.get("/about",(req,res)=>{
    res.status(200).send("About my app")
})