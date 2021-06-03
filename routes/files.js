const router=require('express').Router();
const multer=require('multer');//for storing files
const path=require('path');
const File=require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),//storing image in uploads
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;/*unique file name*/
        cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile');

router.post('/',(req,res)=>{
   
   //Store file
   upload(req,res,async (err) => {
    //validate request
   if(!req.file)/* file is the name given through front end */
   {
       return res.json({error:'All fields are required.'});
   }
    if(err){
        return res.status(500).send({error:err.message});
    }
    
    //Store into DB
    const file=new File({
        filename:req.file.filename,
        uuid:uuidv4(),
        path:req.file.path,
        size:req.file.size
    });
     const response=await file.save();  
     return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
   });

   

   //Response file link
});
router.post('/send',async(req,res)=>{
    const {uuid,emailTo,emailFrom}=req.body;
    //validate request
    if(!uuid|| !emailTo || !emailFrom)
    {
        return res.status(422).send({error:'all feilds are required.'});
    }

    //get data from database or fetch the file we need
    const file=await File.findOne({uuid: uuid});
    //we dont want to send receiver the same file many times so we are checking if sender and receiver feild is there or not
    if(file.sender)
    {
        return res.status(422).send({error:'email already sent.'});
    }
    file.sender=emailFrom;
    file.receiver=emailTo;
//here we are saving the feilds sender and receiver email address for a particular file
    const response=await file.save();

    // send email
    //here we will import the module and that module file will be in sevices folder
     const sendMail=require('../services/emailService');
     //below function will send the mail and this function's code is in services folder....we will pass parameters for the function
     sendMail({
         from: emailFrom,
         to: emailTo,
         subject:'insharing file sharing',
         text:`${emailFrom} shared a file.`,
         html: require('../services/emailTemplate')(
             {
                 emailFrom: emailFrom,
                 downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
                 size: parseInt(file.size/1000)+'KB',
                 expires: '24 hours'
             }
         )

   

     });
     return res.send({success: true});

});

module.exports=router;