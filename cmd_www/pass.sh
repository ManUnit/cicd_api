#!/bin/bash
### ./pass.sh  /pathto/config/home.password anan 12345  // test
sudo -u $1  /usr/bin/htpasswd  -db -s  $2 $3  $4
