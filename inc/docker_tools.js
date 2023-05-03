const shell = require("shelljs");
const fs = require('fs');


var dock_start = function( dir , container ){
 var cout ;
 check_container_name =  shell.exec(  ` grep  container_name:`  + " " + dir + "/docker-compose.yml | grep   ' " + container + "' | wc -l "  ).stdout.replaceAll('\n','<br>'  )  ;
 console.log("aaaaaaa----- STAT -----");
 if (fs.existsSync(dir)){
      if ( parseInt(check_container_name) == 1 ){
         // findtext = shell.exec( ` docker inspect ` + container  + " | grep Status | grep running | wc -l "   )  ;
         // findtext = shell.exec( ` docker inspect ` + container  + " | grep Status | grep running | wc -l "   )  ;
          findtext   =  shell.exec(  ` docker ps | grep  ` + "' " +container + "$' | wc -l"  ).stdout.replaceAll('\n','<br>'  )  ;

	 if ( parseInt(findtext) == 0 ){
             shell.exec(__dirname + "/.." + `/cmd_docker/start.sh ` + dir  )  ;
             letstart = shell.exec(  ` docker inspect   ` + container   )  ;
             return { "status" : { "been" :  false },
		     "data" :  JSON.parse(letstart) 
	     } 
	 }else{
             letstart = shell.exec(  ` docker inspect   ` + container   )  ;
             return {"status" : { "been": true },
		     "data" :  JSON.parse(letstart)  
	     } ;
	 }
         
	 return "FIND : " + findtext + " " +  res  ;
      }else{   
        return  { 'Error': true , 'response' : "Container "+  container +  " not found in "  + dir } ;
      }
  }else{
     cout = "{ 'Error': true , 'response' : 'Directory not found' }" ;
  } 
  return cout ;
}

var dock_stop = function( dir , container ){
   var cout ;
   var  res = shell.exec(  ` docker ps | grep  ` + "' " +container + "$' | wc -l"  ).stdout.replaceAll('\n','<br>'  )  ;
   if ( parseInt(res) == 0  ) {
	    inspect =  shell.exec(  ` docker inspect  ` + container   )  ;

       return { "ERROR": false ,
	        "status" : "Server was stoped " ,
	        "exited" : true,
	        "data" : JSON.parse(inspect) 
              };
   }
   if (fs.existsSync(dir) ) { 

      check_container_name =  shell.exec(`grep  container_name:` + " " + dir + "/docker-compose.yml | grep   ' " + container + "' | wc -l "  ).stdout.replaceAll('\n','<br>'  )    ;
      if (parseInt(check_container_name) == 0  ){  
           return {"error" : true , "data" :  "not found container name " +   container + "  in stack " + dir + " !!" } ;
      } 
      cout = shell.exec(__dirname + "/.." + `/cmd_docker/stop.sh ` + dir + "  " + container   ).stdout.replaceAll('\n','<br>')  ;
      rechk = shell.exec(  ` docker inspect  ` + container   )  ;
        
      return {"ERROR" : false ,  
	      "status" : "Server stoped" ,
	        "exited" : true ,
	        "data" : JSON.parse(rechk) } 
      

   } else {
      cout = "{ 'Error': true , 'response' : 'Directory not found' }" ;
   } 
   return cout ;
}

var dock_stat = function( dir , container ){
   var cout ;
   console.log("=======",container);
   var res=shell.exec(  ` docker ps | grep   ` + container   ).stdout.replaceAll('\n','<br>'  )  ;
   rechk = shell.exec(  ` docker inspect  ` + container   )  ;
   rechk = backetRemove(rechk); 
   if ( res.search(container)== -1  ) {
       return { "status" : false  , "data": JSON.parse(rechk) };
   }else{
       return { "status" : true , "data": JSON.parse(rechk) } ;
   }
}

var dock_mon  = function( container ){
   var cout ;
   var getstat ;
   getrun = shell.exec(  ` docker ps -f ` +  'name='+'"'+ container +'" ' + "  | tail -1 | grep -v 'IMAGE' | wc -l "  )  ;
   if (parseInt(getrun) == 1 ){
          getstat=shell.exec(  ` docker stats  ` + container + '  --no-stream | tail -1  '   )  ;
	  getstat = getstat.trim().match(/[^ ,]+/g).join(',').split(",")  ;
	  return { "stat" : true , "data" : {"host" : getstat[0] , "container":getstat[1],"cpu":getstat[2] , "MemUsage": getstat[3]+"/"+getstat[5] ,
	          "mem": getstat[6]
                  ,"net_tx_rx" : getstat[7]+"/"+getstat[9]
	    }   } 
   }else{
         return { "stat" : false , "data": ''   } ;
   }
}

var dock_list  = function(  ){
   var cout ;
   var getstat ;
   //getrun = shell.exec(  `  docker ps --format '{"Name":"{{.Names}}", "Project":"{{.Label "com.docker.compose.project"}}"}'`   )  ;
   getrun = shell.exec( __dirname + "/.." + `/cmd_docker/list.sh `   )  ;
   const jsonString = getrun ;
   const obj = JSON.parse(jsonString);
   return obj  ;
}


var stdoutToArr = function( str  ){
    var jsonArr = [] ;
    var lines = str.split("<br>") ;
    for ( var i=0 ; i < lines.length; i++ ){
             jsonArr.push(lines[i]);
         }
   return  jsonArr  ;
}

var backetRemove = function(data){
    return data.trim().substring(1).slice(0, -1)
}

module.exports ={
	       dock_start,dock_stop,dock_stat,dock_mon,dock_list
	     }

