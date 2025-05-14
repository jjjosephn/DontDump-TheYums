# Built with:

* [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

* [![PostgresSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

* [![Prisma](http://made-with.prisma.io/dark.svg)](https://prisma.io)

* [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)

* [![Redux Logo](images/redux-logo.png)](https://redux.js.org/)

* [![Tailwind CSS Logo](images/tailwindcss-logo.png)](https://tailwindcss.com/)

* [![Clerk Logo](images/clerk-logo.png)](https://clerk.dev/)

# Getting started:
This is an example of how to setup the project locally.

## Prerequisites:
* npm
> ```
> npm install npm@latest -g
> ```
* PostgresSQL (For MacOS install using Homebrew)
* PGAdmin

## Installation:
1. Clone the repository
> ```
> git clone https://github.com/jjjosephn/DontDump-TheYums.git
> ```
2. Install NPM packages in frontend folder
> ```
> cd frontend
> npm install
> ```
3. Install NPM packages in backend folder
> ```
> cd backend
> npm install
> ```
4. Create a .env and .env.local file  
   In the .env file in backend folder
> ```
> DATABASE_URL="postgresql://${pg_name}:${password}@localhost:5432/${db_name}?schema=public"
> PORT=8000
> ```
pg_name is the name of your Postgres user set when installing  
password is the password to the user set when instaling  
db_name is the name of the database of set when creating a new server conneciton in PGAdmin  

In the .env.local file in frontend folder
> ```
> NEXT_PUBLIC_API_URL = 'http://localhost:8000/'
> ```

5. You can now start the project using
> ```
> cd backend
> npm run dev
> cd ..
> cd frontend
> npm run dev
> ```
