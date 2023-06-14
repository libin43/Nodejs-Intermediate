var express = require('express');
var router = express.Router();

var usersdHelpers = require('../helpers/usersd-helpers')


const { response } = require('../app');

/* GET users listing. */
//signup
router.get('/signup', function(req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.render('signup');
});

router.post('/signup',function(req,res){
  usersdHelpers.doSignup(req.body).then((response)=>{
    if(response.status==false){
      res.render('signup',{'emailError':"User Already Exists"})
    }else{
      res.render('login')
    }
   
  })
  
  
}) 

//loginpage
router.get('/',function(req,res){

  let user = req.session.user
  if(user){
    
    res.redirect('/homepage')
  }else{
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.render('login')
  }
  
})

router.post('/',function(req,res){
  usersdHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/homepage')
    }else{
      res.redirect('/errorpage')
    }
  })
 
})

//homepage
router.get('/homepage',function(req,res){

  let user = req.session.user
  

  if(user){
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    
    let products =[{
      track: "Ole Melody",
      movie:"Thallu Maala",
      artist:"Vishnu Vijay",
    },{
      track: "Kannil Kannil",
      movie:"Sita Ramam",
      artist:"Vishal Chandrashekar",
    },{
      track: "Puthiyoru Lokam",
      movie:"Hridayam",
      artist:"Vimal Roy",
    },{
      track: "Uyire",
      movie:"Gauthamante Radham",
      artist:"Sid Sriram",
    }] 
  
    res.render('home',{products,user})
  }else{
    res.redirect('/')
  }

  
})
//logout
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
//error
router.get('/errorpage',function(req,res) {
  let user = req.session.user
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if(user){
    
    res.redirect('/homepage')
  }else{
    
  }
  res.render('login', { error: 'Invalid Credentials' })
})
 
module.exports = router; 
 