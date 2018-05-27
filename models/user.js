const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    username:{
        type:String,required:true,
    },
    email:{
         type: String,required:true,
    },
    phone:{
        type: String,
    },
    title:{
        type: String,
    },
    avatar:{
        type: String,
    },
    password:{
        type: String,required:true,
    }
},{ timestamps: { createdAt: 'created_at' }});

User.query.findUserByEmail = function(email){
    return this.find({email:email});
};

module.exports = mongoose.model('User', User);