const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const Project = new Schema({
    name:{
        type:String,
    },
    creator:{
         type: Schema.Types.ObjectId, ref: 'User',
    },
    role:{
        type: Schema.Types.ObjectId, ref: 'MemberRole',
    },
    team:[
        {type: Schema.Types.ObjectId, ref: 'User'}],
},{ timestamps: { createdAt: 'created_at' } });


module.exports = mongoose.model('Project', Project)