#!/bin/bash

result="{"

i=0
for container in $(docker ps -a --format '{{.Names}}'); do
    container_info=$(docker inspect --format='{{.State.Status}}|{{index .Config.Labels "com.docker.compose.project"}}|{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}|{{range $p, $conf := .NetworkSettings.Ports}}{{if $conf}}{{range $i, $v := $conf}}{{$p}} -> {{$v.HostPort}} {{end}}{{end}}{{end}}|{{.Id}}|{{.Config.Image}}|{{.State.StartedAt}}|{{.Created}}|{{index .Config.Labels "com.docker.compose.project.working_dir"}}' $container)
    IFS='|' read -ra container_fields <<< "$container_info"
    status=${container_fields[0]}
    project=${container_fields[1]}
    ip=${container_fields[2]}
    ports=${container_fields[3]}
    container_id=${container_fields[4]}
    image=${container_fields[5]}
    uptime=$(($(date +%s) - $(date -d "${container_fields[6]}" +%s)))
    uptime=$(date -d@$uptime -u +%H:%M:%S)
    created=$(date -d "${container_fields[7]}" +"%Y-%m-%d %H:%M:%S")
    working_dir=${container_fields[8]}
    result="$result \"$i\":{\"Name\":\"$container\", \"Project\":\"$project\", \"IPAddress\":\"$ip\", \"Ports\":\"$ports\", \"ContainerID\":\"$container_id\", \"Status\":\"$status\", \"Image\":\"$image\", \"Uptime\":\"$uptime\", \"CreatedDate\":\"$created\", \"WorkingDir\":\"$working_dir\"},"
    i=$((i+1))
done

result=${result%?}
result="$result}"

echo $result

