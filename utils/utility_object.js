const mailer=require('nodemailer');

module.exports={
sendEmail:(clientEmail,data,resp)=>{
    let transprter=mailer.createTransport(
        {
            service:'gmail',
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASSWORD
            }
        }
    )


    let mailOptions={
        from:`kevin<${process.env.USER_EMAIL}>`,
        to:clientEmail,
        subject:"SpaceMeals email confirmation",
        text:"A simple verification email from the server",
        html:data
    };


try{
    transprter.sendMail(mailOptions,(e,info)=>{
        if(e){
            resp.status(402).json({message:"Email not sent..."});
            return console.log('Email sending error: '+e);
        }
        console.log('Email has been sent');
        Logger('Email has been sent');
        console.log('Preview:',mailer.getTestMessageUrl(info))
        Logger('Preview:',mailer.getTestMessageUrl(info));
        resp.status(200).json({message:"your password has been sent to your email"})
})
}
catch(e){
    console.log('Email sending error: '+e);
    resp.status(402).json({message:"Email not sent..."+e})
}

},

generateCode:()=>{
    let codeStr='';
   let cnt=3;
    while(cnt>=0){
        codeStr+=Math.floor(Math.random()*9)+1;
        --cnt;
    }
return codeStr;
},


Hash_password:(password)=>{
    let sha1,passwdHash;
      //encrpting password using sha1 algorithm
      sha1=crypto.createHash("sha1");
      sha1.update(password);
     passwdHash=sha1.digest("hex");
return passwdHash;
}


}

