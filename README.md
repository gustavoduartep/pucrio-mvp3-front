![MVP PUC-Rio - Gustavo Duarte Pedrosa](./assets/sushipuc-banner-repo.jpg)

#

&nbsp;
&nbsp;

# Sobre o MVP

A aplicação consiste no projeto de conclusão de Sprint do MBA em Engenharia de Software pela PUC-Rio.

# Tecnologias

- Python
- Flask
- OpenAPI
- SQLite
- SQLAlchemy
- HTML5
- CSS3
- Bootstrap
- JQuery

# API Externa

- [Google reCAPTCHA](https://www.google.com/recaptcha/about/)

  > Utilizo o reCAPTCHA antes de submeter a finalização da compra.

# Como executar?

A aplicação está dividida em 2 repositórios, sendo:

- [Back-end](https://github.com/gustavoduartep/pucrio-mvp-api)
- Front-end (Este repositório)

```powershell
# Acesse a pasta do da aplicação no terminal
$ cd pucrio-mvp-front

# Execute o arquivo index.html para abrir o front-end em seu browser
```

# Docker

Para construir a imagem Docker, utilize o comando:

```
docker build -t sushiweb .
```

Para executar o container, esteja em modo Administrador e utilize o comando:

```
docker run -d -p 8080:80 sushiweb
```

> O argumento **-d** executa o container em segundo plano e o **-p** mapeia as portas.

Em caso de dificuldades, por favor, entre em contato.
