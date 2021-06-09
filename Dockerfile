# spa-app
FROM docker-reg.devops.xiaohongshu.com/library/fe-nginx:v0.1.1
# Add file
# static file
COPY public/ data/public/

# spa landing page
COPY public/index.html data/index.html
