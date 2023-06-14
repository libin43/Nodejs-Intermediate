var db = require('../config/connection')

const bcrypt = require('bcrypt')
const { response } = require('../app')
module.exports ={
    doSignup:(userData)=>{
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
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response={}
            let user = await db.get().collection('people').findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})  
            }
        })
    }
}