var express = require('express');
var router = express.Router();
const User  = require('../models/user');
const Member = require('../models/member_role');
const Project = require('../models/project');
const Status = require('../models/status');
const Task = require('../models/task');
const projectControllers = require('../controllers/projects');
const taskControllers = require('../controllers/tasks');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { header:'ASAP ITALIA',title: 'KABANA API Implementation' });
});

// Make sure User logged in
// router.use('/project(s)',function(req,res,next){
//   const checkUser = req.session.user;
//   console.log(checkUser)
//   if(checkUser)
//       next();
//   else{
//     res.status(403).json('Login Required');
//   }
// });

// Create new Project
router.post('/project',function(req,res,next){

  projectControllers.saveProject(req,res);
});

//GET Projects by role - creator / member
router.get('/projects/:role*?',async function(req,res){
  
  projectControllers.getProjects(req,res);
});

// GET project tasks or team by Project ID
router.get('/project/:projectId/:team',async function(req,res){
  let write_response = [];
  let filterBy = req.params.team;

  if(filterBy == 'task'){
    taskControllers.getTasks(req,res);
  }else{
    projectControllers.getTeam(req,res);
  }
  });


// Assign user to project *?
router.put('/project/:projectId/team/:userId',async function(req,res){

  projectControllers.assignUserToProj(req,res);
});

router.put('/project/:projectId/task/:taskId', async function(req,res){
  taskControllers.updateTask(req,res);
});

//Delete user from team
router.delete('/project/:projectId/team/:userId', async function(req,res){

  try{
    
    const write_response = [];
        
        const projects = await Project.findById({_id:req.params.projectId}).populate('creator')
        .populate('team')              
        .exec();
      
        const current_user = '5b05d74c0c6057687c85ee18'; // member in  a project
      if(projects!==null){
        
        if (projects.creator._id.equals(current_user)) {
          Project.findOneAndUpdate({_id:req.params.projectId},{ $pull: { "team" : req.params.userId }},function(err,project){
            if(err)
              console.log(err);
              else{
                console.log(project);
              }
          }) 
        }else{
          res.status(403).send('permission denied');
        }
      }


  }catch(e){
    res.status(403).send('Invalid ID');
  }

});


 //Task End Points

router.post('/project/:projectId/task',[
  check('title', 'Title must not be less than 3 Chars long')
    .isLength({ min: 3 }),

  check('description', 'Description must not be less than 5 Chars long')
  .isLength({ min: 5 })
 
], async function(req,res,next){
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  taskControllers.addTaskToProj(req,res);
});




//Optional End Points
//Get All members
router.get('/members',function(req,res){
  Member.find().then((member) => res.send(member));
 });

 //GET Statuses
 router.get('/statuses',function(req,res){
  Status.find().then((status) => res.send(status));
 });

 //GET tasks
 router.get('/tasks',async function(req,res){
  const tasks = await Task.find().populate('status').exec();
 res.status(200).json(tasks);
 });

  //Create Member
router.post('/member',function(req,res){
  let bulkSave = [{'type':'creator'},{'type':'member'}];
  Member.create(bulkSave).then((member) => res.send(member));

});

 //save Status
 router.post('/status',function(req,res){

  let bulkSave = [{'type':'todo'},{'type':'progress'},{'type':'done'}];

  Status.create(bulkSave).then((status) => res.send(status));

});

 router.delete('/projects',function(req,res){
  Project.remove().then((project) => res.send(project));
 });

 router.delete('/members',function(req,res){
  Member.remove().then((project) => res.send(project));
 });
module.exports = router;