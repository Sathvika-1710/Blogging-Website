const mongoose=require('mongoose')
var schema_new2=new mongoose.Schema({
    username:{
        type:String,
        required:"this field is required",
        unique:true
    },
    email:{
        type:String,
        required:"this field is required"
    },
    password:{
        type:String,
        required:"this field is required"
    },
    phno:{
        type:String,
        required:"this field is required"
    },

})
mongoose.model('users',schema_new2)

var schema_new3=new mongoose.Schema({
    image_name:{
        type:String
    },
    image:{
        data:Buffer ,
        contentType:String
    },
    authorname:{
        type:String,
        required:"this field is required"
    },
    title:{
        type:String,
        required:"this field is required"
    },
    category:{
        type:String,
        required:"this field is required"

    },
    content:{
        type:String,
        required:"this field is required"
    },
    bookmarked:{
        type:Boolean,
        default:false
    },
    

    
})
mongoose.model('blogs',schema_new3)