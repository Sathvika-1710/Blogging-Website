const express = require('express')
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
var db = require('../data/db');
const req = require('express/lib/request');
const ObjectId = require('mongoose').ObjectId
var fs = require('fs');
const path = require('path');
var blog = mongoose.model('blogs')
const multer = require('multer')
const Storage = multer.diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
            cb(null, file.originalname)
      }
})
const upload = multer({
      storage: Storage
})
var user_id;


const router = express.Router();
var User = mongoose.model('users')
router.get('/:id/:title/sss', (req, res) => {
      res.render('_.handlebars', {
            id: req.params.id,
            title: req.params.title
      });

})

router.post('/:id/:title/sss', upload.single('image'), (req, res) => {
      blog.updateOne({ title: req.params.title }, {

            image: {
                  data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                  contentType: 'image/png'
            }, image_name: req.file.filename
      }, (err, data) => {
            if (!err) {
                  res.redirect('/'+req.params.id)
            }
            else {
                  console.log("updation was not successfull")
            }
      })
})


router.get('/', (req, res) => {
      res.render('home')
})


router.get('/login', (req, res) => {
      res.render('login');
})

router.get('/signup', (req, res) => {
      res.render('signup')
})



router.post('/signup', (req, res) => {

      var num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      password = req.body.password
      var len_pass = password.length
      var phno_len = 0
      for (var i = 0; i < req.body.phno.length; i++) {
            for (var j = 0; j < num.length; j++) {
                  if (req.body.phno[i] == num[j]) {
                        phno_len = phno_len + 1;

                  }
            }
      }

      var obj = {
            status: "ok",
            error: "no error"
      }

      if (req.body.username.length > 10) {
            obj = {
                  status: "error",
                  error: "Username length exceeded"
            }
      }

      if (phno_len != 10) {
            obj = {
                  status: "error",
                  error: "Number of digits in phone number is not 10"
            }
      }
      var p = 0;
      for (var i = 0; i < req.body.password.length; i++) {
            for (var j = 0; j < num.length; j++) {
                  if (password[i] == num[j]) {
                        p = p + 1;
                  }
            }
      }
      if (p > 1 && len_pass > 5) {

      }
      else {
            obj = {
                  status: "error",
                  error: "password doesnot satisfy all the conditions"
            }
      }

      if (obj.error == "no error") {
            var pass_new = bcrypt.hashSync(req.body.password, 10);
            try {
                  User.insertMany({
                        username: req.body.username,
                        password: pass_new,
                        email: req.body.email,
                        phno: req.body.phno

                  }, (err, data) => {
                        if (!err) {
                              res.render('succ')
                        }
                        else {

                              res.send(err.message)
                        }
                  })
            } catch (error) {
                  res.send(error.message)
            }
      }
      else {
            res.json(obj)
      }


})


router.post('/login', async (req, res) => {
      var data = await User.find({ username: req.body.username }).lean(true)
      try {
            if (bcrypt.compareSync(req.body.password, data[0].password)) {

                  var add = "./" + data[0]._id
                  user_id = data[0]._id
                  res.redirect(add);

            }
            else {
                  res.send("insuccesful login")
            }
      } catch (error) {
            res.send("insuccesful login")
      }
})



router.get('/:id', async (req, res) => {
      var u = await User.find({ _id: req.params.id })
      var blo = await blog.find({ authorname: u[0].username })
      res.render('home_blog', {
            title: "My Blogs",
            username: u[0].username,
            userid: u[0]._id,
            list: blo

      })
})
router.get('/:id/bookmarks_blogs', async (req, res) => {
      var u = await User.find({ _id: req.params.id })
      var blo = await blog.find({ authorname: u[0].username, bookmarked: true })
      res.render('bookmark', {
            
            list: blo

      })
})

router.get('/:id/create', (req, res) => {

      res.render('create_blog', {
            title: "create blog",
            id: req.params.id
      })
})

router.post('/:id/create_blog', async (req, res) => {
      var id = req.params.id
      p = req.params.id
      var user = await User.find({ _id: req.params.id }).lean()
      if (req.body.title == '' || req.body.category == '' || req.body.content == '') {
            res.json({ status: "error", error: "field cannot be empty" })
      }
      else {
            try {
                  blog.insertMany({
                        authorname: user[0].username,
                        title: req.body.title,
                        category: req.body.category,
                        content: req.body.content



                  }, (err, data) => {
                        if (!err) {
                              res.redirect('/' + id + "/" + req.body.title + '/sss');


                        }
                        else {
                              res.send(err.message)
                        }
                  })
            }
            catch (error) {
                  res.send("Title already exists")
            }


      }
})


router.get('/:id/readmore', async (req, res) => {
      var bio=await blog.find({_id:req.params.id})
      res.render('readmore',{
            list:bio[0]
      })
      
})
router.get('/:id/update', async (req, res) => {
      var blo = await blog.find({ _id: req.params.id }).lean()
      res.render('update', {
            title:blo[0].title,
            content:blo[0].content,
            category:blo[0].category,
            id:req.params.id
      })

})
router.post('/:id/update_blog', (req, res) => {
      blog.findByIdAndUpdate({_id:req.params.id},{title: req.body.title, category: req.body.category,content: req.body.content},(err,data)=>{
            if(!err){
                  res.send("updated succesfully")
            }
            else{
                  res.send("there is some error in updating")
            }
      })
})
router.get('/:id/delete',(req,res)=>{
      blog.findByIdAndDelete({_id:req.params.id},(err,data)=>{
            if(!err){
                  res.send("Deleted succesfully")
            }
            else{
                  res.send(err.message)
            }
      })
})
router.get('/:id/bookmark',(req,res)=>{
      blog.findByIdAndUpdate({_id:req.params.id},{
            bookmarked:true
      },(err,data)=>{
            if(!err){
                  res.send("bookmark added successfully")
            }
            else{
                  res.send(error.message)
            }
      })
})


router.get('/:id/remove_bookmark',(req,res)=>{
      blog.findByIdAndUpdate({_id:req.params.id},{
            bookmarked:false
      },(err,data)=>{
            if(!err){
                  res.send("bookmark removed successfully")
            }
            else{
                  res.send(error.message)
            }
      })
})



module.exports = router;












