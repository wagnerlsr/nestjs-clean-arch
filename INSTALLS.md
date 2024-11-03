
# S.O.L.I.D

### S - Single Responsibility Principle (Principio da responsabilidade única)

* Uma classe deve ter apenas uma responsabilidade. Este principio esta intimamente ligado com outro
  'Separation Concerns'.

### O - Open/closed principle (Principio do aberto/fechado)

* Modulos, classes, objetos e operações devem estar abertos para extensão, mas fechados para modificacões.

### L - Liskov substitution principle (Principio da substituição de Linkov)

* Se o(x) é uma propriedade demonstravel dos objetos x de tipo T, então o(y) deve ser verdadeiro para objetos
  y de tipo S onde S é um subtipo de T (subtipos precisam ser substituiveis por seus tipos de base).

* Subtipos precisam ser substituiveis por seus tipos de base.

* Se um programa espera um tipo Animal, algo do tipo Cachorro (que herda de Animal) deve servir como qualquer outro Animal.

### I - Interface segregation principle (Principio da segregação de Interface)

* Os clientes não devem ser forçados a depender de interfaces que não utilizam.

### D - Dependency inversion principle (Principio da inversão de dependencia)

* Modulos de alto nivel não devem ser dependentes de modulos de baixo nivel. ambos devem depender de abstrações.
  Detalhes devem depender das abstrações, não o inverso.

## Vantagens:

* Código modular
* Código reutilizável (D.R.Y. - Don't repeat yourself)
* Código testável
* Baixo acoplamento e alta coesão
* Separação de conceitos (Separations of concerns)
* Fácil manutenção

## Desvantagens:

* Complexidade
* Quantidade de código digitado aumenta
* Tempo de desenvolvimento aumenta
* Cuidados com: YAGNI (You aren't gonna need it), KISS (Keep it simple, stupid!)

#

---

---

# The Clean Architecture

---

## Enterprise Business Rules
  * Entities


    As Entidades são estruturas que lidam com as 
    regras de negócios da empresa.

## Application Business Rules
 * Use cases
   * Repositories


    Cada funcionalidade da aplicação se retrata em 
    um Caso de Uso que utiliza uma ou mais Entidades.


## Interface Adapters
 * Controllers
 * Presenters
 * Gateways

## Frameworks & Drivers
 * External interfaces
 * Devices
 * Web
 * DB
 * UI



#

---


---


---

# Configurações

## NodeJS

Update modules
 * `npx npm-check -u`

---

## Eslint / Prettier

* `npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`
####
* `npm i -D prettier eslint-config-prettier eslint-plugin-prettier`

---

## Eslint Imports
* `npm i -D eslint-plugin-simple-import-sort eslint-plugin-import`

---

## Validator / Transformer
* `npm i class-validator class-transformer`

---

## Jest

* `npm i -D jest ts-jest @types/jest`
####
* `npx ts-jest config:init` ou `npx jest --init`

---

## uuid

* `npm i uuid`
* `npm i -D @types/uuid`

---

## Faker

Biblioteca para gerar dados falsos.
* `npm i -D @faker-js/faker`

---

## Dotenv Cli

Biblioteca para indicar qual arquivo .env utilizar no comando.
* `npm i dotenv-cli`
* `npx dotenv-cli -e .env.development -- comando`

---

## NestJS
###
**Criar novo projeto :**
 * `nest new nome-projeto`

###
##### Adapter Fastify:

Doc NestJS: TECHNIQUES - Performance (Fastify)
 * `npm i @nestjs/platform-fastify`

###
##### Config:
 * `npm i @nestjs/config`
 * Criar modulo e serviço de configuração: `src/shared/infrastructure/env-config`

###
**Resource: criar um CRUD**
* `nest g res  users`



---

## Prisma

###
##### Config:
* `npm i -D prisma`
* `npm i @prisma/client`

###
Comandos:
* Schema: `npx prisma init`
* Generate: `npx dotenv-cli -e .env.development -- npx prisma generate --schema ./src/shared/infrastructure/database/prisma/schema.prisma`
* Migrate: `npx dotenv-cli -e .env.development -- npx prisma migrate dev --schema ./src/shared/infrastructure/database/prisma/schema.prisma`


* Modulo: `nest g module name`
* Service: `nest g service name`





#
#
#
#
#
#
