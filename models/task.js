const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const task = new Schema({
    title:{type:String,required:true},
    description:{type:String, required:true},
    status:{type: Schema.Types.ObjectId, ref: 'Status'},
    projectId:{type:String}
},{ timestamps: { createdAt: 'created_at' , updatedAt:'updated_at'}});


module.exports = mongoose.model('task',task);