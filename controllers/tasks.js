const User  = require('../models/user');
const Member = require('../models/member_role');
const Project = require('../models/project');
const Status = require('../models/status');
const Task = require('../models/task');
const projectController = require('./projects');

//Get all tasks of Project
exports.getTasks = async function(req,res){
    try{
      
      const {write_response,projects} = await projectController.findAndWriteResponse(req.params.projectId,req.session.user._id);
      console.log('projects')
         if(projects){
           if(write_response){
               
              const tasks = await Task.find({projectId:req.params.projectId}).populate('status').exec();
              res.status(200).json(tasks);
            
           }else{
            res.status(403).send('permission denied');
           }
         }else{
           res.status(404).send('Project not found');
         }
       }catch(e){
         res.status(403).send('Invalid ID');
       }
};

//Add task to a project
exports.addTaskToProj = async function(req,res){
    try{
       
        const {write_response,projects} = await projectController.findAndWriteResponse(req.params.projectId,req.session.user._id);
        console.log(projects)
         if(projects){
           if(write_response){
             const newTask  = new Task({
               title:req.body.title,
               description:req.body.description,
               status:req.body.status_id,
               projectId:projects._id
             });
     
             newTask.save().then((task) => res.status(201).send(task)).catch((err) => console.log(err));
           }else{
            res.status(403).send('permission denied');
           }
        }else{
           res.status(404).send('Project not found');
         }
       }catch(e){
         res.status(403).send(e);
       }
};

exports.updateTask = async function (req,res){
  try{
       
    const {write_response,projects} = await projectController.findAndWriteResponse(req.params.projectId,req.session.user._id);
    
     if(projects){
       if(write_response){
         
        const task = await Task.findOne({projectId:req.params.projectId}).populate('status').exec();
        
        if(task.projectId == req.params.projectId){
          Task.update({_id:req.params.taskId},{'title':req.body.title,'status':req.body.status},function (err,task){
            if(err)
            console.log(err);
            else{
              res.status(201).json(task);
            }
          })
        }else{
          res.status(403).send('permission denied, not a team member');
        }
    
         
       }else{
        res.status(403).send('permission denied');
       }
    }else{
       res.status(404).send('Project not found');
     }
   }catch(e){
     res.status(403).send('Invalid ID');
   }
};
