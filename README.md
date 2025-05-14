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
* Clerk API Key
* Mapbox API Key
* Spoonacular API Key
* Gemini API Key

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
3. Create and setup frontend .env.local file in frontend's root directory folder with .env.example template
> ```
> NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
> NEXT_PUBLIC_SPOONACULAR=spoonacular_api_key
> NEXT_PUBLIC_MAPBOX_TOKEN=mapbox_api_key
> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk_publishable_key
> CLERK_SECRET_KEY=clerk_secret_key
> NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/ingredients
> NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/ingredients
> NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
> NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
4. Install NPM packages in backend folder
> ```
> cd backend
> npm install
> ```
5. Create a .env.local file in the main directory of the backend folder following the .env.example template
> ```
> DATABASE_URL="postgresql://${pg_name}:${password}@localhost:5432/${db_name}?schema=public"
> PORT=8000
> SPOONACULAR_API_KEY=spoonacular_api_key
> GEMINI_API_KEY=gemini_api_key
> ```
pg_name is the name of your Postgres user set when installing  
password is the password to the user set when instaling  
db_name is the name of the database of set when creating a new server conneciton in PGAdmin  
6. Connect backend schema to pgadmin
> ```
> cd backend
> npx prisma migrate dev --name init
7. You can now start the project using
> ```
> cd backend
> npm run dev
> cd ..
> cd frontend
> npm run dev
> ```
