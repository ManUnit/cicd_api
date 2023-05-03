const { response } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const shell = require("shelljs");
const svntools = require("./inc/svn_tools.js");
const wwwtools = require("./inc/web.js");
const dockertools = require("./inc/docker_tools.js");
const db = require("./inc/dbmysql.js");
const cmd = require("./inc/cmd.js");
const config = require("./config/env.json");
const app = express();
const auth = require('basic-auth');
const { spawn } = require('node:child_process');
const exec  = spawn('/usr/bin/python3', ['list.py']);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var data = "";
var outer = "" ;

//Global API body variable  
//let  ipcall,username,password,caller,command,argv1,argv2,argv3,argv4,rev  

    app.get("/", function (req, res) {
        res.send( " Nothing +++ "  ) ;
      
    });

    app.post("/", function (req, res) {
      data = req.body.load_data;
	    if ( req.query.director == null   ) {
         	  console.log( " DIR null " ) ;
	    }else{
         	  console.log( "====>" +  req.query.directory  ) ;
	    }
     console.log(req.headers);
      res.send( {
	"done" : true ,      
	"param-directory" : req.query.directory  ,
        'response' : req.headers,
	      "Nothing" : "work"   
      });
    });
    app.get('/svn', function(req, res) {
      var child = spawn('/usr/bin/python3', ['list.py']);
      //child.stdout.pipe(res);
      child.stdout.pipe(res);
    });
app.post('/docker', function(request, response) {
	     getbody(request) ;  // get Valuee from http API
             if ( caller == config.api.serverkey   ){
                if (username && password && caller )   {
                   db.con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                                if (error) throw error;
                                let mix_operator =  0 ;
                                if ( results.length > 0 ){
                                    mix_operator_host_allow = results[0].host.toString() == '%' ;  // NODEJS limitation can not mix operator
                                    mix_operator_host_allow = mix_operator_host_allow || results[0].host.toString() == ipcall ;
                                };
                                if (results.length > 0 &&
                                        results[0].username.toString() == username &&
                                        mix_operator_host_allow

                                    ){
                                     docker_res =  docker_call({ 'rev':rev, 'command':command,'argv1':argv1,'argv2':argv2,'argv3':argv3,'argv4':argv4 } ) ;
                                     response.send( { "ERROR" : false , "DATA": {docker_res}    });
                                     response.end();
                                }else {
                                     response.send({"ERROR": true  , 'DATA' :  "Permission deny" , "IP" : request.headers['cf-connecting-ip'] });
                                     response.end();

                                }
                                        });
                                } else {
                                                //response.send('Please enter Username and Password!');
                                      response.send({ "ERROR": true , "DATA": request.headers });
                                      response.end();
                                }
             }  //end if caller
             else {
                response.send({"ERROR": true , "DATA" : " ID Mismatch" });
             }
       });


app.post('/webtools', function(request, response) {
	     getbody(request) ; // get values from  http API
             if ( caller == config.api.serverkey  ){
                if (username && password && caller )   {
                       db.con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                            if (error) throw error;
                            let mix_operator =  0 ;
                            if ( results.length > 0 ){
                                    mix_operator_host_allow = results[0].host.toString() == '%' ;  // NODEJS limitation can not mix operator
                                    mix_operator_host_allow = mix_operator_host_allow || results[0].host.toString() == ipcall ;
                             };
                             if (results.length > 0 &&
                                      results[0].username.toString() == username &&
                                        mix_operator_host_allow

                               ){
                                     web_res =  wwwtools.web_call({ 'command':command,'argv1':argv1,'argv2':argv2,'argv3':argv3,'argv4':argv4 } ) ;
                                                    response.send( { "ERROR" : false , "DATA": {web_res}    });
                                                    response.end();
                               }else {
                                                response.send({"ERROR": true  , 'DATA' :  "Permission deny" , "IP" : request.headers['cf-connecting-ip'] });
                                                response.end();

                                }
                                        });
                                } else {
                                                //response.send('Please enter Username and Password!');
                                                response.send({ "ERROR": true , "DATA": request.headers });
                                                response.end();
                                }
             }  //end if caller
             else {
                response.send({"ERROR": true , "DATA" : " ID Mismatch" });
             }
       });


// doing  
app.post('/svn', function(request, response) {
	    getbody(request) ;
	    console.log(username,password,caller,config.api.serverkey);
	    if ( caller == config.api.serverkey  ){ 	
		if (username && password && caller )   {
			db.con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
				if (error) throw error;
			        let mix_operator =  0 ;
				if ( results.length > 0 ){   
                                    mix_operator_host_allow = results[0].host.toString() == '%' ;  // NODEJS limitation can not mix operator 
                                    mix_operator_host_allow = mix_operator_host_allow || results[0].host.toString() == ipcall ;
				};  
				if (results.length > 0 &&
					results[0].username.toString() == username && 
					mix_operator_host_allow 

				    ){
				      cmd_response =  cmd_call({ 'rev':rev, 'command':command,'argv1':argv1,'argv2':argv2,'argv3':argv3,'argv4':argv4 } ) ;
				      response.send( { "ERROR" : false , "DATA": {cmd_response}    });
				      response.end();
				}else {
				      response.send({"ERROR": true  , 'DATA' :  "Permission deny" , "IP" : request.headers['cf-connecting-ip'] });
				      response.end();

				}
					});
				} else {
						//response.send('Please enter Username and Password!');
				      response.send({ "ERROR": true , "DATA": request.headers });
				      response.end();
				}
	     }  //end if caller
	     else {
		response.send({"ERROR": true , "DATA" : " ID Mismatch" });
	     }
                            });

    app.listen(3000, '0.0.0.0' ,  function () {
      console.log("Starting server at port 3000...");
    });
  
 function cmd_call({ command,argv1,argv2,argv3,argv4,rev}={} ){
   switch(command) {
    case 'checkout':
		   //console.log(  argv1,argv2,argv3,argv4 ,rev ) ; 
      console.log('================') ;
      return svntools.checkout( argv1,argv2,argv3,argv4 ,rev );     
      break;
   case 'info' :
      //console.log(argv1,argv4) ;
      //console.log('================') ;
      return svntools.info(argv1,argv4);     
      break;
  /* case 'docker-qa-start' : 
      return dockertools.qa_start(argv1,argv2);     
      break;
   case 'docker-qa-stop' : 
      return dockertools.qa_stop(argv1,argv2);     
      break;
   case 'docker-qa-stat' : 
      return dockertools.qa_stat(argv1);     
      break;
   case 'docker-mon' : 
      return dockertools.dock_mon(argv1);     
      break;
   */
    default:
      return {"ERROR" : "Command  -> " + command + "  not found " } ;
   }	
 }


 function docker_call({ command,argv1,argv2,argv3,argv4,rev}={} ){
   switch(command) {
   case 'docker-start' :
      return dockertools.dock_start(argv1,argv2);
      break;
   case 'docker-stop' :
      return dockertools.dock_stop(argv1,argv2);
      break;
   case 'docker-stat' :
      console.log("xxxxxxxxxxxxxxxxx");
      return dockertools.dock_stat(argv1,argv2);
      break;
   case 'docker-mon' :
      return dockertools.dock_mon(argv1);
      break;
   case 'docker-list' :
      return dockertools.dock_list();
      break;
    default:
      return {"ERROR" : "Command  -> " + command + "  not found " } ;
   }
 }

 function getbody (request){
      username = request.headers['username'];
      password = request.headers['crypt'] ;
      caller = request.headers['serverkey'];
      command  = request.headers['command'];
      argv1  = request.headers['argv1'];
      argv2  = request.headers['argv2'];
      argv3  = request.headers['argv3'];
      argv4  = request.headers['argv4'];
      rev  = request.headers['revision'];
      ipcall= request.headers['cf-connecting-ip']
 }
