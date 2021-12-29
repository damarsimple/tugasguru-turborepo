import sys
import os
import shutil

dev = len(sys.argv) > 1 and sys.argv[1] == "dev"
domain = "localhost" if dev else "tugasguru.com"

ports = {
    3000: ".",

    4000: "gql",

    3001: "account",
    3002: "meet",

    3003: "student",
    3004: "teacher",
    3004: "parent",
    3005: "admin",

    3006: "admission",
    3006: "bimbel",
    3006: "toko",
    3006: "quiz",

    3005: "admin"


}


def format(subdomain): return subdomain + "." if subdomain != "." else ""


def createNginxTemplate(subdomain):
    return """
server {
    listen 80;
    server_name {subdomain}{domain};
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    ssl_certificate /etc/ssl/certs/{domain}.pem;
    ssl_certificate_key /etc/ssl/private/{domain}-key.pem;

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    access_log /var/log/nginx/{subdomain}{domain}.access.log;
    error_log /var/log/nginx/{subdomain}{domain}.error.log;
    
    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3002;
    }
}
""".replace("{subdomain}", subdomain).replace("{domain}", domain)


def createHostTemplate(subdomain):
    return f"127.0.0.1 {subdomain}{domain}"


hosts = []

for i in ports:
    subdomain = format(ports[i])

    hosts.append(createHostTemplate(subdomain))

    with open(f"sites-enabled/{subdomain}{domain}", mode="w+") as f:
        f.write(createNginxTemplate(subdomain))


with open(f"hosts", mode="w+") as f:
    f.write("\n".join(hosts))


if os.name == "posix":
    shutil.copyfile("hosts", "/etc/hosts")

    if os.path.exists("/etc/nginx/sites-enabled"):
        shutil.rmtree("/etc/nginx/sites-enabled")

    shutil.copytree("sites-enabled", "/etc/nginx/sites-enabled")
