const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Status = new schema({
    type:{type:String,required:true}
});

module.exports = mongoose.model('Status',Status);