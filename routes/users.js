var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const bcrypt = require('bcrypt');
const User  = require('../models/user');

const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


let hashPwd;

// Create User
router.post('/user',[
  check('email')
      .custom(value => {
      return User.find({email:value}).then((user) => {
        if(user.hasOwnProperty('email')) throw new Error('this email is already in use');
      })
    }),
 
  check('username', 'Username must be atleast 5 characters long')
    .isLength({ min: 5 }),

  check('password', 'passwords must be at least 5 chars long')
  .isLength({ min: 5 })
 
],async function(req,res,next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const {username, phone, email, title, avatar, password} = req.body;

  hashPwd = bcrypt.hashSync(password, saltRounds);

  console.log(this.hashpwd);

  const user = new User({
      username:username,
      email: email,
      title:title,
      avatar:avatar,
      password:hashPwd
  });

  user.save().then((user) => res.status(201).send(user)).catch((err) => res.send(err));

});

router.get('/login',function(req,res){
  res.render('login');
});

router.post('/user/login',[check('username', 'Username must be atleast 5 characters long')
.isLength({ min: 5 }),

check('password', 'passwords must be at least 5 chars long')
.isLength({ min: 5 })

], async function(req,res,next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  let user;
  try{
     user = await User.findOne({username:req.body.username}).exec();
  }catch(e){
    console.log('Invalid user');
  }
  

  if(!user){
    res.status(404).send('User not found');
  }else if(user){
   
      const match = await bcrypt.compare(req.body.password, user.password);
   
      if(match) {
          console.log('Macthed');
          //req.session.maxAge = 365 * 24 * 60 * 60 * 1000;
          req.session.user  = user;
          res.send(user);
      }
  }
});

//OPTIONAL End Points
router.delete('/delete', function(req,res){
  User.remove().then(()=> res.send('deleted'));
});

router.get('/allusers', function(req,res){
  User.find().then((user)=> res.status(200).send(user));
});

router.get('/session', function(req,res){
  res.send(req.session);
});

router.get('/logout',function(req,res){
  req.session = null;
  res.send(req.session);
});

module.exports = router;
