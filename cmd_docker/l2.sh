#!/bin/bash

result="{"

i=0
for container in $(docker ps -a --format '{{.Names}}'); do
  # Remove leading slash from container name
  name=${container}
  
  status=$(docker inspect -f '{{.State.Status}}' $container)
  if [ "$status" == "exited" ]; then
    result="$result \"$i\":{\"Name\":\"$name\", \"Project\":\"\", \"IPAddress\":\"\", \"Ports\":\"\", \"ContainerID\":\"\", \"Status\":\"$status\", \"Image\":\"\", \"Uptime\":\"\"},"
  else
    inspect=$(docker inspect -f '{"Name":"{{.Name}}", "Project":"{{index .Config.Labels "com.docker.compose.project"}}", "IPAddress":"{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}", "Ports":"{{range $p, $conf := .NetworkSettings.Ports}}{{if $conf}}{{range $i, $v := $conf}}{{$p}} -> {{$v.HostPort}} {{end}}{{end}}{{end}}", "ContainerID":"{{.Id}}", "Status":"{{.State.Status}}", "Image":"{{.Config.Image}}", "Uptime":"{{.State.StartedAt}}" }' $container)
    result="$result \"$i\":$inspect,"
  fi
  i=$((i+1))
done

result=${result%?}
result="$result}"

echo "$result" 

