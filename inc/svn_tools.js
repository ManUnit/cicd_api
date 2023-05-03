 const shell = require("shelljs");
 const fs = require('fs');
var commit = function( owner , username , password , dir ){
   return  shell.exec(__dirname + "/.." + `/cmd_svn/checkout.sh ` + username + ' ' + password + ' ' + dir ).stdout.replaceAll('\n','<br>'  )  ;
}

var isWorkdir = function (owner , dir) {

 out =  shell.exec(__dirname + "/.." + `/cmd_svn/info.sh ` + owner  + ' '  +  dir )  ;
 if ( out.code == 0  ){   
     return [ true ,out.stdout.replaceAll('\n','<br>') ]  ;	
 }else{
     return [ false,out.stderr.replaceAll('\n','<br>') ] ;	
 }
}

var checkout = function(owner,username,password,dir,rev ){
   var cout ;
   workdir = isWorkdir(owner,dir) ; 
   if (fs.existsSync(dir) && workdir[0] == true  ) {
      
      cout = shell.exec(__dirname + "/.." + `/cmd_svn/checkout.sh ` + owner  + ' '  + username + ' ' + password + ' ' + dir + ' ' + rev ).stdout.replaceAll('\n','<br>'  )  ;
	   
   } else if ( workdir[0] == false  )   {
      cout =  workdir[1]    
   } else {
      cout = " Error : undefinded " ;
   } 
   return cout ;
}

var info = function( owner, dir_svn ){
   workdir = isWorkdir(owner,dir_svn) ; 
    if (workdir[0]){
     eout =  shell.exec(__dirname + "/.." + `/cmd_svn/info.sh ` + owner  + ' '  +  dir_svn ).stdout.replaceAll('\n','<br>'  )  ;
     return  stdoutToJson(eout)   ;
    }else{
      return {'ERROR' :  workdir[1] } 
    }
}

var stdoutToJson = function( str  ){
    var jsonArr   ;
    let objs = {} ;
    var lines = str.split("<br>") ;
    for ( var i=0 ; i < lines.length; i++ ){
             rentext = lines[i] + "'}"  ;
             rentext =rentext.replace(/:\s/g,'\':\'')
             rentext =rentext.replace(/^/g,'{\'')
             rentext =rentext.replace(/{\'\'}/g,'{}')
             jsonArr = JSON.stringify(rentext) ;
	     obj = eval("("+JSON.parse(jsonArr)+")") ;
		     for (var key in obj){
			     objs[key]= obj[key] ;
		     }
         }
   return  objs  ;
}

var stdoutToArr = function( str  ){
    var jsonArr = [] ;
    var lines = str.split("<br>") ;
    for ( var i=0 ; i < lines.length; i++ ){
             jsonArr.push(lines[i]);
         }
   return  jsonArr  ;
}


 module.exports ={
	        checkout,commit,info
	     }

