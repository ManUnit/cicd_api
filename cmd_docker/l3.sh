#!/bin/bash

containers=( $(docker ps --format '{{.Names}}') )
result='{'
for container in "${containers[@]}"; do
status=$(docker inspect --format='{{.State.Status}}' $container)
if [ "$status" == "exited" ]; then
result="$result "{\"Name\":\"$container\", \"Project\":\"", \"IPAddress\":\"", \"Ports\":\"", \"ContainerID\":\"", \"Status\":\"$status\\\", \\\"Image\\\":\\\"\", \\\"Uptime\\\":\\\"\"\", "
else
project=$(docker inspect --format='{{index .Config.Labels "com.docker.compose.project"}}' container)ip=(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container)ports=(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if $conf}}{{range $i, $v := $conf}}{{$p}} -> {{$v.HostPort}} {{end}}{{end}}{{end}}' container)container 
i
​
 d=(docker inspect --format='{{.Id}}' container)image=(docker inspect --format='{{.Config.Image}}' container)uptime=(docker inspect --format='{{.State.StartedAt}}' container)uptime=(($(date +%s) - $(date -d "uptime"+uptime=(date -d@$uptime -u +%H:%M:%S)
result="$result "{\"Name\":\"$container\", \"Project\":\"$project\", \"IPAddress\":\"$ip\", \"Ports\":\"$ports\", \"ContainerID\":\"$container_id\", \"Status\":\"$status\", \"Image\":\"$image\", \"Uptime\":\"$uptime\\\"}\", "
fi
done
result=${result%?}
result="$result}"

echo $result | jq '.'
