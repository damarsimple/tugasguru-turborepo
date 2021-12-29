
server {
    listen 80;
    server_name parent.tugasguru.com;
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/ssl/certs/tugasguru.com.pem;
    ssl_certificate_key /etc/ssl/private/tugasguru.com-key.pem;

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    access_log /var/log/nginx/parent.tugasguru.com.access.log;
    error_log /var/log/nginx/parent.tugasguru.com.error.log;
    
    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3004;
    }
}
