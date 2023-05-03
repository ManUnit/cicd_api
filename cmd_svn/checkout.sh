#!/bin/bash
#source /opt/api_sync/.env 
source $(pwd)"/.env"

sudo -u $1  svn cleanup  $4
sudo -u $1  svn  co -r$5  $SVN_REPOSITORY --username $2  --password $3  $4 | grep -v 'Restored '
