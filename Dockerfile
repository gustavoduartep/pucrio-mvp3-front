# Use uma imagem base leve, como o servidor web Nginx.
FROM nginx:alpine

# Copie os arquivos HTML, CSS e JS para o diretório raiz do servidor web.
COPY . /usr/share/nginx/html

# Exponha a porta 80 para que a aplicação web seja acessível.
EXPOSE 80

# O comando CMD é usado para iniciar o servidor web quando o contêiner for iniciado.
CMD ["nginx", "-g", "daemon off;"]
