const shell = require("shelljs");
const fs = require('fs');
var found = false;

var adduser = function (owner , file , user  , password) {
   finduser =  shell.exec( `grep -r -i ` + '"^'+user+':" ' + file    )  ; 
   console.log("code ===>",finduser);
 // out =  shell.exec(__dirname + "/.." + `/cmd_www/pass.sh ` +  owner + " "  + file + " " + user  + ' '  +  password  )  ;
  if ( finduser.code  == 0  ){   
     return { "error" : true , "data" :  "already user " +  user + " can not add"}  ;	
  }else{
     out =  shell.exec(__dirname + "/.." + `/cmd_www/pass.sh ` +  owner + " "  + file + " " + user  + ' '  +  password  )  ;
     return { "error" : false, "data" : "user "+ user + " added to login password file"  } ;	
  }
}

var changepass = function (owner , file , user  , password) {

  finduser =  shell.exec( `grep -r -i ` + '"^'+user+':" ' + file    )  ; 
 if ( finduser.code == 0  ){   
     out =  shell.exec(__dirname + "/.." + `/cmd_www/pass.sh ` +  owner + " "  + file + " " + user  + ' '  +  password  )  ;
     return { "error" : false , "data" : "user" + user + " updated password" }  ;	
 }else{
     return { "error" : true, "data" : "user " + user + " not found !" } ;	
 }
}

var listusers = function (owner , file ) {
     out =  shell.exec( 'cut -d":" -f1 ' + file   ).stdout  ;
     return { "error" : true , "data" :  out }  ;	
}


 module.exports ={
	        listusers,adduser , changepass
	     }

