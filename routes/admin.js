var express = require('express');
var router = express.Router();
var collection = require('../config/collection');
var userHelpers = require('../userhelp/useHelp')
var objectId=require('mongodb').ObjectID

router.get('/admin',(req,res)=>{
    res.render('/admin-login')
})


  
  module.exports=router;