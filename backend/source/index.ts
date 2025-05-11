import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

/* Route Imports */
import exampleRoutes from './routes/exampleRoutes'
import recipeRoutes from './routes/recipeRoutes'
import ingredientRoutes from './routes/ingredientsRoutes'
import userRoutes from './routes/userRoutes'

/* Configs */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* Routes */
app.use('/example', exampleRoutes); // Handles /example
app.use('/recipes', recipeRoutes);  // Handles /recipes
app.use('/ingredients', ingredientRoutes); // Handles /ingredients
app.use('/user', userRoutes); // Handles /user

/* Server */
const port = Number(process.env.PORT) || 3001
app.listen(port, "0.0.0.0", () => {
   console.log(`Server is running on port ${port}`)
})