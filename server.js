const express = require('express');
const mongoose = require('mongoose');

app = require('./app')('express');

const mongoURl = 'mongodb://hari:hari@ds235860.mlab.com:35860/testdb_kaban';
//const mongoURl = 'mongodb://hareesh_tate:tate_007@ds141274.mlab.com:41274/tate_noder';
const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  
};

mongoose.connect(mongoURl, options,function(error){
    if(error)
      console.log(error);
});


const connection = mongoose.connection;
connection.once('open',() => {
console.log('Database connected');
global.server = connection;
});
connection.on('error',(err) => {
  console.log(err)
});

app.listen(8080,function(){
    console.log('Server listening on 3000');
});
module.exports = app;