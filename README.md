# Projeto de API
Stack nodejs + typescript + TypeORM
Este é um projeto de API para testar as rotas localmente.

## Pré-requisitos

- Ter uma versão do npm compatível instalada em sua máquina.

## Instalação

1. Clone o repositório para sua máquina local.
2. Navegue até o diretório raiz do projeto.
3. Execute o comando abaixo para instalar as dependências:

    ```bash
    npm install
    ```

## Executando a Aplicação

1. Após instalar as dependências, execute o comando abaixo para iniciar a aplicação:

    ```bash
    npm start
    ```

2. As rotas de teste estarão disponíveis no `localhost` na porta `3000`.

http://localhost:3000/

## Testando as Rotas da API

- Há um arquivo na raiz do projeto que pode ser importado para o [Insomnia](https://insomnia.rest/) e utilizado para testar as rotas da API.
- Importe o arquivo no Insomnia e você terá acesso às rotas configuradas para facilitar o processo de teste.
- Insomnia_2024-06-21.json

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

fazer login, existem dois usuarios pre cadastrados no banco, admin e user, somente admin pode cadastrar produtos, lembre de fazer login como admin copiar o token e cola-lo no bearer.
![Login](https://github.com/filipecavalc/back-sunset/assets/15673929/d70d502b-6133-416d-9c28-096629d59077)

Criar produto
![Criar produto](https://github.com/filipecavalc/back-sunset/assets/15673929/5a66985e-b74d-489a-aa12-2211e8716947)
![Criar produto 2](https://github.com/filipecavalc/back-sunset/assets/15673929/565ab094-92ac-40f2-80c3-5eca47b58c78)

Ler produto pelo id
![Ler produto](https://github.com/filipecavalc/back-sunset/assets/15673929/70df4218-25af-4e33-bb9f-66310b6f05ff)

Listar todos os produtos
![Ler todos os produtos](https://github.com/filipecavalc/back-sunset/assets/15673929/e5fe8758-d85e-4be6-b054-503cfc98c5e9)

Ler 10 produtos aleatorios
![Ler 10 produtos aleatorios](https://github.com/filipecavalc/back-sunset/assets/15673929/006048ea-3ec3-4bde-8d8d-48bd0d87203f)

Gerar feed de produtos em formato xml para integracao com google shopping
![Gerar feed de produto para integracao com google shopping](https://github.com/filipecavalc/back-sunset/assets/15673929/f6b578ff-18c1-43d5-af0b-d8ec4e390d8b)
