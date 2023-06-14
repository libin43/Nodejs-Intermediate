const { ObjectID } = require('bson')
const { response } = require('../app')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')

module.exports ={
    addUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection('people').findOne({email:userData.email})
            if(user){
                resolve({status:false})

            }else{
                userData.password =await bcrypt.hash(userData.password,10)
            db.get().collection('people').insertOne(userData).then((response)=>{
                resolve({status:true})
            })
            }

        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection('people').find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userID)=>{
        return new Promise ((resolve,reject)=>{
            console.log(userID)
            console.log(objectId(userID))
            db.get().collection('people').deleteOne({_id:objectId(userID)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getUserDetails:(userID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('people').findOne({_id:objectId(userID)}).then((user)=>{
                console.log(user)
                resolve(user)
            })
        })

    },
    updateUser:(userID,userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection('people').findOne({email:userDetails.email})
            if(user){
                resolve({status:false})
            }
            else{
                db.get().collection('people').updateOne({_id:objectId(userID)},{
                    $set:{
                        firstName: userDetails.firstName,
                        lastName:userDetails.lastName,
                        email:userDetails.email 
                    }
                }).then((response)=>{
                    resolve({status:true})
                })
            }
           
        })
    }
}