const User  = require('../models/user');
const Member = require('../models/member_role');
const Project = require('../models/project');
const Status = require('../models/status');
const Task = require('../models/task');

// Save Project
exports.saveProject = async function(req,res){

    const project = new Project({
        name:req.body.name,
        creator:req.body.creator,
        role:req.body.role,
        team:req.body.team,
      });
      
      project.save().then((project) => res.send(project)).catch((err) => res.send(err));

};

// Get all projects
exports.getProjects = async function(req,res){
  let projects_list = [];
  let write_response = [];
  let roleParam = req.params.role;

  try{
    const projects = await Project.find()
    .populate('creator')
    .populate('role')
    .populate('team')              
    .exec();
  
    if(projects){
      let current_user = req.session.user._id;
     
      for (let project in projects){
  
        let creator = projects[project].creator;
      if(typeof roleParam === 'undefined'){
        if (creator._id.equals(current_user)) {
          write_response.push(projects[project]);
        }
  
        let members  = projects[project].team;
       
        members.map((member) => {if (member._id.equals(current_user)) {
          write_response.push(projects[project]);
        }});
      }else if(roleParam.toLowerCase() === 'creator'){
        if (creator._id.equals(current_user)) {
          write_response.push(projects[project]);
          
         
        }}else if(roleParam.toLowerCase() === 'member'){
          let members  = projects[project].team;
          
          members.map((member) => {if (member._id.equals(current_user)) {
            write_response.push(projects[project]);
          }});
  
        }
      }
      if(write_response.length===0){
          res.status(403).json('permission denied');
        }else{
        res.json(write_response);
        }
    }else{
      res.status(404).send('Project not found');
    }
     
    }catch(e){
        res.status(404).send('Invalid ID');
    }
};

// Get team of the Project
exports.getTeam = async function(req,res){
    try{
        const {write_response,projects} = await this.findAndWriteResponse(req.params.projectId,req.session.user._id);
        
      if(projects){
        if(write_response.length===0){
            res.status(403).send('permission denied');
          }else{
            let members = write_response;
            for (let member of members){
                res.json(member);
            }
        }
      }else{
        res.status(404).send('Project not found');
      }
    }catch(e){
        res.status(403).send('Invalid ID');
    }
};

// Assing user to the Project
exports.assignUserToProj = async function(req,res){
  let user = req.params.userId;
  let project_id = req.params.projectId;
 
  try{

    const {projects,creator} = await this.findAndWriteResponse(req.params.projectId,req.session.user._id);
        
      if(projects){
        if(creator){

    let userObject = await User.findOne({_id:user}).exec();
    
      Project.findByIdAndUpdate(project_id,
      {$push: {team: userObject}},
       {safe: true, upsert: true},
         function(err, project) {
        if(err){
        console.log(err);
        }else{
          res.status(200).json(project);
         }
         });
           
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




exports.findAndWriteResponse =async function  (projectId,login_user){
  let creator =false;
 
  const projects = await Project.findById({_id:projectId}).populate('creator')
  .populate('role')
  .populate('team')              
  .exec();

  const current_user = login_user; // member in  a project
  const write_response = [];

if(projects!==null){
  
  if (projects.creator._id.equals(current_user)) {
   creator = true;
    write_response.push(projects);
  }

  let members  = projects.team;
  
  for (let member of members){
    if (member._id.equals(current_user)) {
      creator = false;
      write_response.push(projects);;
    }
  }

  return {projects ,write_response,creator};
}}