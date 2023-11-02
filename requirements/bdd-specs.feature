Feature: Cliente online

    Quero que o sistema me mostre minhas compras
    Para eu poder controlar minhas despesas    
    
    Scenario: Obter dados da API
        Given que o cliente tem conexão com a iternet
        When o cliente solicitar para carregar suas compras
        Then o sistema deve exibir suas compras vindo de uma API
        And substituir os dados do cache com os dados mais atuais

Feature: Cliente offline

    Como um cliente offline
    Quero que o sistema me mostre minhas últimas compras gravadas
    Para eu poder ver minhas despesas mesmo sem ter internet

    Scenario: Obter dados do cache
        Given que o cliente não tem conexão com a internet
        And exista algum dados gravado no cache
        And os dados do cache forem mais novos que 3 dias
        When o cliente solicitar para carregar suas compras
        Then o sistema deve exibir suas compras vindas do cache