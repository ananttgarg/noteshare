const nodemailer=require('nodemailer');
async function sendMail({from,to,subject,text,html})
{
let transporter=nodemailer.createTransport(
    {
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure:false,
        auth :{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }

    });

    let info=await transporter.sendMail({
// from:from,
// to:to,
// subject:subject,
// text: text,
// html: html....this is correct but in java script if key and value are same then we can use only key/value
    from :`noteshare <${from}>`,
    to,
    subject,
    text,
    html
});
}
module.exports=sendMail;