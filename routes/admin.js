var express = require('express');
const { response } = require('../app');
var router = express.Router();


var userHelpers = require('../helpers/user-helpers')

const adminEmail = 'likku@gmail.com'
const adminPassword = '0000'

//login admin
router.get('/',function(req,res){
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0,Pragma, no-cache,Expires, -1"
  );
  let user = req.session.admin
  if(user){
    
    res.redirect('/admin/adhomepage')
    
    
   
  }else {
    res.render('ad-login')
 }
  
})



/* GET home page. */
router.get('/adhomepage', function(req, res, next) {
  let userID  = req.session.admin
  console.log(userID)
  if(userID){
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    
    userHelpers.getAllUsers().then((users)=>{
      console.log(users)
      res.render('ad-homepage',{admin:true,users});
    })
   
  }else{
    console.log("error")
    
    res.redirect('/admin')
  }
 
});

router.post('/adhomepage',function(req,res){
  const userData ={email,password}= req.body
  if(email===adminEmail &&  password===adminPassword){
    
    req.session.admin = userData

    
   
    
    res.redirect('/admin/adhomepage')
     
    
  }else{
    console.log("error")
    
    res.redirect('/admin/errorpage')
  }
  
})

//add user

router.get('/add-user',function(req,res){

  let userID = req.session.admin
  if(userID){
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0,Pragma, no-cache,Expires, -1"
    );
    res.render('add-user',{admin:true})
  }else{
    console.log("error")
   
 res.redirect('/admin')}
 
}) 

router.post('/add-user',function(req,res){
  let userID = req.session.admin
  if(userID){
    console.log(req.body)
    userHelpers.addUser(req.body).then((response)=>{
      if(response.status==false){
        res.render('add-user',{'emailError':"User Already Exists"})
      }else{
        res.redirect('/admin/adhomepage')
      }
     
    }) 
  }else{
     console.log("error")
    
  res.redirect('/admin/errorpage')}
 
})  

//logout admin
router.get('/logout',function(req,res){
  
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0,Pragma, no-cache,Expires, -1"
  );

  req.session.destroy()
  res.redirect('/admin')
})

//error

router.get('/errorpage',function(req,res) {
 
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if(req.session.admin){
    
    res.redirect('/admin/adhomepage')
  }else{
    res.render('ad-login', { error: 'Invalid Credentials' })
  }
  
})

//delete 
router.get('/delete-user/:id',function(req,res){
  let userID = req.params.id
  userHelpers.deleteUser(userID).then((response)=>{
    res.redirect('/admin/adhomepage')
  })

})
 
//set route for data to be displayed on edit page fields
router.get('/edit-user/:id',async(req,res)=>{
  let userID = req.session.admin
  if(userID){
    let oneUserId = await userHelpers.getUserDetails(req.params.id)
    console.log(oneUserId)
    res.render('edit-user',{oneUserId,admin:true}) 
  }else{
    res.render('ad-login')
  }
 
})

//click update 
router.post('/edit-user/:id',(req,res)=>{
  
  userHelpers.updateUser(req.params.id,req.body).then((response)=>{
    if(response.status==false){
      res.render('edit-user',{'emailError':"User Already Exists"})
    }else{
      res.redirect('/admin/adhomepage')
    }
  }) 
   
}) 
module.exports = router;  
  