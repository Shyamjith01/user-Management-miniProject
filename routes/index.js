// const { log } = require('debug');
// const { response } = require('express');
var express = require('express');
const { Db } = require('mongodb');
const collection = require('../config/collection');
var router = express.Router();
var userHelpers = require('../userhelp/useHelp')
var objectId=require('mongodb').ObjectID



/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logedIn){
    res.render('user-home');
  }else{
    res.render('index')
    
  }
  
});

router.get('/index',(req,res)=>{
  if(!req.session.logedIn){
    res.render('index',{logedInErr:req.session.logedInErr})
    req.session.logedInErr=false
  }else{
    res.redirect('/')
  }
})


// router.get('/admin',(req,res)=>{
//   if(req.session.adminLogin){
//     userHelpers.getAllUser().then((users)=>{
//       res.render('admin',{users})
//     })}else{
//       res.render('admin-login')
//     }
// })

router.get('/admin',(req,res)=>{
  if(req.session.adminLogin){
    userHelpers.getAllUser().then((users)=>{
      res.render('admin',{users})
    })
  }else{
    res.render('admin-login')
  }
})

router.get('/adduser',(req,res)=>{
  if(req.session.adminLogin){
    res.render('addUser')
  }else{
    res.render('/admin-login')
  }
  
})


router.get('/index',(req,res)=>{
  res.render('index');
})
router.get('/signup',(req,res)=>{
  res.render('signup');
})

router.post('/signup',(req,res)=>{
  let account=req.body.name;
  console.log(account);
  userHelpers.dosignup(req.body).then((data)=>{
    console.log(data);
    console.log('account created');
    req.session.logedIn=true;

    res.render('user-home',{account})
  })
})


router.post('/user-login',(req,res)=>{
  
  userHelpers.dologin(req.body).then((response)=>{
    
    if(response.status){
      console.log('login user succes');
      req.session.logedIn=true;

      res.redirect('/')
    }else{
      console.log('loggin failed')
      
      req.session.logedInErr=true
      
      res.redirect('/index');

    }
  })    
})


router.post('/admin-login',(req,res)=>{
  userHelpers.doAdminLogin(req.body).then((adminResponse)=>{
    if(adminResponse.status){
      userHelpers.getAllUser().then((users)=>{
        req.session.adminLogin=true;
      req.session.admin=adminResponse;
        res.redirect('/admin')
      console.log('admin page rendered');

      })
      
  }else{
      console.log('admin page failed');
      req.session.logedInErr=true;
      res.redirect('/admin-login')
    }
  })
})



// router.post('/admin-login', (req, res,) => {
//   userHelpers.doAdminLogin(req.body).then((responseAdmin) => {
//    if (responseAdmin.status) {
//      req.session.admin = responseAdmin.admin
//      req.session.adminloggedIn = true
//      console.log(req.session.admin +"jgjhghgh");
//      res.redirect('/admin')
//    } else {
//      req.session.loggedInErr=true 
//      res.redirect('/admin-login')
//    }
//   })
// })



router.get('/admin-logout',(req,res)=>{
  req.session.adminLogin=false;
  res.redirect('/admin')
})  



router.get('/user-delete/:id',(req,res)=>{
  let userId=req.params.id;
  userHelpers.deleteUser(userId).then((response)=>{
    res.redirect('/admin')
  })
})


router.get('/edit-user/:id',async(req,res)=>{
  let userdata= await userHelpers.getUserDetails(req.params.id);
  console.log(userdata);
  res.render('edit-user',{userdata})

})



router.post('/edit-user/:id',(req,res)=>{
  userHelpers.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})



router.get('/logout',(req,res)=>{
  req.session.logedIn=false;
  req.session.destroy();
  res.redirect('/')
})

// router.post('/submit-adduser',(req,res)=>{
//   userHelpers.dosignup(req.body).then((userdata)=>{
//     res.redirect('/admin')
//   })
// })
router.post('/addUser',(req,res)=>{
  console.log('user created');
  userHelpers.dosignup(req.body).then((data)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
