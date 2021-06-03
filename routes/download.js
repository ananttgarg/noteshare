const router=require('express').Router();
const File=require('../models/file');

//we are making a get request for download
//uuid will get added to the link we have given in server.js
router.get('/:uuid',async(req,res)=>
{
    //checking if file is there in db 
    const file=await File.findOne({uuid : req.params.uuid});
    //checking if file is there
    if(!file)
    {
        return res.render('download',{error: 'link has been expired'});
        //this will render same page download.ejs and will show error 
    }

    const filePath=`${__dirname}/../${file.path}`;
    //this the path of the file taken from path feild of file see the const above
    res.download(filePath);
    //now we it will fetch the file of the link written above

});
module.exports=router;