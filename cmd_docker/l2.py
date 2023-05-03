#!/usr/bin/env python3
import subprocess
import json

result = {}
i = 0

for container in subprocess.check_output("docker ps -a --format '{{.Names}}'", shell=True).decode().split():
    status = subprocess.check_output("docker inspect --format='{{.State.Status}}' " + container, shell=True).decode().strip()

    if status == "exited":
        result[i] = {
            "Name": container,
            "Project": "",
            "IPAddress": "",
            "Ports": "",
            "ContainerID": "",
            "Status": status,
            "Image": "",
            "Uptime": ""
        }
    else:
        project = subprocess.check_output("docker inspect --format='{{index .Config.Labels \"com.docker.compose.project\"}}' " + container, shell=True).decode().strip()
        ip = subprocess.check_output("docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' " + container, shell=True).decode().strip()
        ports = subprocess.check_output("docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if $conf}}{{range $i, $v := $conf}}{{$p}} -> {{$v.HostPort}} {{end}}{{end}}{{end}}' " + container, shell=True).decode().strip()
        container_id = subprocess.check_output("docker inspect --format='{{.Id}}' " + container, shell=True).decode().strip()
        image = subprocess.check_output("docker inspect --format='{{.Config.Image}}' " + container, shell=True).decode().strip()
        uptime = subprocess.check_output("docker inspect --format='{{.State.StartedAt}}' " + container, shell=True).decode().strip()
        uptime = int(subprocess.check_output(["date", "+%s", "-d", uptime]).decode().strip())
        uptime = str(subprocess.check_output(["date", "-d", "@"+str(uptime), "-u", "+%H:%M:%S"]).decode().strip())

        result[i] = {
            "Name": container,
            "Project": project,
            "IPAddress": ip,
            "Ports": ports,
            "ContainerID": container_id,
            "Status": status,
            "Image": image,
            "Uptime": uptime
        }

    i += 1

print(json.dumps(result, indent=4))

