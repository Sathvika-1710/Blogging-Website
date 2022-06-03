
require('./data/db')
const express=require('express');
const path=require('path')
const Handlebars = require('handlebars')
const exhbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyparser=require('body-parser');


const app=express();
app.use(express.static(path.join(__dirname,'/uploads')))

app.listen(3000,()=>{
    console.log("app is listening on port 3000")
})

app.use(bodyparser.urlencoded({
    extended:true
}))

app.use(bodyparser.json())

app.set('view engine','handlebars')
app.engine('handlebars',exhbs.engine({
    handlebars:allowInsecurePrototypeAccess(Handlebars)
}));

app.use('/',require('./controllers/route.js'))





