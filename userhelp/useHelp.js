var db=require('../config/connection');
var collection = require('../config/collection')
const bcrypt =require('bcrypt');
var ObjectId=require('mongodb').ObjectID;
const { response } = require('express');
module.exports={


    dosignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })
    },
    dologin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log('entered the promise');
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('login succes');
                        response.user=user;
                        response.status=true;
                        resolve(response)
                    }else{
                        console.log('loggin failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('loggin pross failed');
                resolve({status:false})
            }
        })
        
    },
    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let responseAdmin = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email})
            if (admin) {
                if (adminData.pw == admin.pw) {
                    console.log("login success");
                    responseAdmin.admin = admin
                    responseAdmin.status = true
                    resolve(responseAdmin)
                } else {
                    console.log("Login Failed");
                    resolve({ status: false })
                }

            } else {
                console.log("Failed");
                resolve({ status: false })
            }
        })
    },
    getAllUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            console.log(ObjectId(userId));
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:ObjectId(userId)}).then((response)=>{
                resolve(response);
            })

        })
    },
    
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(userId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(userId,userdetails)=>{
        return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({_id:ObjectId(userId)},{
                    $set:{
                        name:userdetails.name,
                        email:userdetails.email,
                        mobile:userdetails.mobile
                    }
                }).then((response)=>{
                    resolve()
                })
        })
    }
          
    
 
}


