# Back-end para a tela de login proposta como desafio pela empresa Bemol.
## O front-end com a aplicação que faz acesso a essa aplicação está disponível em: https://desafiobemol.netlify.app/

# O software compreende duas lambdas.
## 1. login. Responsável pela validação (Pacote Hapi/Joi) do e-mail e password enviados pelo usuário
### após a validação é feita uma query ao banco de dados AWS/DynamoDB para a busca e comparação do e-mail e password requisitados.
### caso as informações de login sejam válidas é enviado um token json (JWT) para o usuário seguir logado durante um tempo determinado.
## 2. create. Responsável pela validação (Pacote Hapi/Joi) e gravação de novo usuário na base de dados AWS/Dynamo.
### Há também uma terceira lambda. Authorizer. Para onde o token é enviado sempre que uma nova página restrita for acessada. (não utilizada pelo front-end).

# Para instalar a aplicação:
## Necessário possuir Node.js e NPM instalados.
## Possuir conta na AWS e o pacote serverless que faz o upload dos dados para a núvem.
## Baixar esse repositório.
### Rodar o comando npm i para instalar as dependências.
### Rodar o comando serverless deploy para enviar os dados para a núvem e receber os links de endpoint.
