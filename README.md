# Food delivery

## Requisitos do usuário

**Restaurante**

- Gerenciar cardápio
- Gerenciar pedidos de clientes.

**Cliente**

- Visualizar cardápio
- Simular frete e previsão de entrega
- Gerenciar itens da sacola
- Realizar pagamento e fazer pedido
- Monitorar andamento do pedido.

## Requisitos de sistema

**Requisitos funcionais:**

- Autenticação de administrador;
- Cadastro e login de clientes; ✔
- Exibir cardápio; ✔
- Calcular frete e tempo previsto de entrega;
- Gerenciamento de sacola;
- Escolher método e/ou fazer pagamento;
- Realizar pedido;
- Gerenciar cardápio; ✔
- Gerenciar pedidos;
- Exibir progresso do pedido.

**Requisitos não funcionais**

- Utilizar PostgreSQL e PrismaORM;
- Utilizar NestJS;
- Autenticação com JWT;
- _...quais as integrações de pagamento e localização?_

## Regras de negócio

- Preço mínimo de X reais ou quantidade miníma de Y itens;
- Realizar pedido apenas quando autenticado;
- Raio de entrega de Z km;
- Após cliente fazer pedido, restaurante deve confirmar;
- Métodos de pagamento: dinheiro, pix, cartão de crédito ou débito.
