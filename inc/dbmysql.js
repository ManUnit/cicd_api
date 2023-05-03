require('dotenv').config();
var mysql = require('mysql');

const  DB_HOST = process.env.DB_HOST;
const  DB_USER = process.env.DB_USER;
const  DB_PASS = process.env.DB_PASS;
const  DB_PORT = process.env.DB_PORT;
const  DB_DATABASE= process.env.DB_DATABASE;

var con = mysql.createConnection({
	host: DB_HOST,    // ip address of server running mysql
	  user: DB_USER,    // user name to your mysql database
	  port: DB_PORT,
	  password: DB_PASS, // corresponding password
	  database: DB_DATABASE // use the specified database
});

module.exports ={
	       con
}
