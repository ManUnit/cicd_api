const wwwtools  = require(__dirname + "/www_tools.js");
var web_call =  function ({ command,argv1,argv2,argv3,argv4}={} ){
   switch(command) {
    case 'changepass':
      return wwwtools.changepass(argv1,argv2,argv3,argv4 );
      break;
    case 'adduser':
      return wwwtools.adduser(argv1,argv2,argv3,argv4 );
      break;
    case 'listusers':
      return wwwtools.listusers(argv1,argv2,argv3,argv4 );
      break;
    default:
      return {"ERROR" : "Command  -> " + command + "  not found " } ;
   }
 }


 module.exports ={
                web_call
             }


             
