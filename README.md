**INFORMAÇÕES DAS ROTAS**


O front end deve desenvolver uma lógica que logue o usuário e ele permaneça logado até fazer o logout
-----------------------------------------------------------------------------------------------------------------------------------------------


**AUTENTICAR LOGIN**
Rota = https://apipego.vercel.app/AuthLogin
Método = POST
Inputs Necessárias:
ºEmail (String)
ºPassword (String)


Exemplo De Retorno:
{
  "Id": 2,
  "Token": "$2a$10$9p.6WsJugsoNNOV0pJB.2umZbYlMkXkog31mplOhlYHgHXW2vb7UK"
}


Observações: O front-end deve salvar essas informações na memória local do dispositivo móvel, pois algumas rotas vão solicitar essas informações para rotas que necessitam estar logado para extrair, alterar e deletar dados.


-----------------------------------------------------------------------------------------------------------------------------------------------


**CADASTRAR USUÁRIO**
Observação inicial: Inicialmente foi definido que haveria dois tipos de cadastros, mas resolvi simplificar isso, agora haverá apenas um tipo de conta, depois que for criado uma conta de usuario ai será disponibilizado a opção de Criar loja, assim uma loja vai ficar atribuída a um usuário


Rota = https://apipego.vercel.app/UserRegister
Método = POST


Inputs Necessárias:
Email (String)
Password (String)
Name (String)
Cpf_Cnpj (String)
NumberPhone (String)


Exemplo De Retorno:
Se algum campo estiver vazio = Please fill in all fields
Se Ocorrer Sucesso = User Created Successfully
Se o email já constar em algum cadastro = User Already Exists


-----------------------------------------------------------------------------------------------------------------------------------------------


**CADASTRAR UMA LOJA**


Rota = https://apipego.vercel.app/StoreRegister
Método = POST


Inputs Necessárias:
    IdOwner (INT)
    Name (String)
    Description (String)
    Category (String)
    Email (String)
    NumberPhone (String)
    Address (String)
    City (String)
    State (String)
    Cep (String)
    AdressNumber (INT)
    OpeningHours (String)


Exemplo De Retorno:
Se algum campo estiver vazio = Please fill in all fields
Se Ocorrer Sucesso = Store Registered Successfully


-----------------------------------------------------------------------------------------------------------------------------------------------


**OBTER TODAS AS LOJAS**
Observações iniciais: Eu limitei a quantidade de atributos que será buscado no banco de dados para deixar essa busca mais performática


Rota = https://apipego.vercel.app/StoresListing
Método = Get


Exemplo De Retorno:
[
  {
    "id": 1,
    "StoreName": "Cuidadoso",
    "StoreCity": "Rio Acima",
    "StoreState": "Minas Gerais"
  },
  {
    "id": 2,
    "StoreName": "Sfizi",
    "StoreCity": "Belo Horizonte",
    "StoreState": "Minas Gerais"
  }
]


-----------------------------------------------------------------------------------------------------------------------------------------------


**OBTER INFORMAÇÕES DE UMA LOJA ESPECÍFICA**


Observações iniciais: A rota Precisa de uma variável na chamada da rota, que no caso é o id da loja


Rota = https://apipego.vercel.app/StoreData/"ID"
Método = Get


Exemplo De Retorno:
{
  "id": 2,
  "StoreIdOwner": 2,
  "StoreName": "Sfizi",
  "StoreDescription": "Pizzas e Esfihas",
  "StoreCategory": "Lanchonete",
  "StoreEmail": "Sfizi@gmail.com",
  "StoreNumberPhone": "31 994190706",
  "StoreAddress": "UniBh",
  "StoreCity": "Belo Horizonte",
  "StoreState": "Minas Gerais",
  "StoreCEP": "34300000",
  "StoreAdressNumber": "2003",
  "StoreOpeningHours": "9:00",
  "createdAt": "2025-03-29T19:51:59.236Z",
  "updatedAt": "2025-03-29T19:51:59.236Z"
}

-----------------------------------------------------------------------------------------------------------------------------------------------


**CADASTRAR UM PRODUTO**


Observações iniciais: Essa rota espera um arquivo 
Obs: Enviar como multpartform, e deve enviar no header o token e o id de quem está logado


Inputs Necéssarias:
StoreID
ProductName
ProductPrice
file




Exemplo de retorno
Se as inputs estiverem vazias: 
{
	"error": "Nenhum arquivo enviado"
}

Se estiver tudo correto 
{
	"success": true,
	"fileId": "1b7NcTUZB4E_wYetaagCokcsq2bqWDY15"
}

Se o token não for fornecido 
{
	"error": "Acesso negado. Token não fornecido."
}