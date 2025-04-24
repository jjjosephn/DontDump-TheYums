"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIngredients = exports.addIngredient = exports.fetchIngredients = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const fetchIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const response = yield fetch(`https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`);
        const ingredients = yield response.json();
        res.status(200).json(ingredients);
    }
    catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});
exports.fetchIngredients = fetchIngredients;
const addIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, expiryDate } = req.body;
    try {
        const newIngredient = yield prisma.ingredient.create({
            data: {
                ingredientName: name,
                ingredientPicture: image,
                ingredientDateExpired: new Date(expiryDate),
            },
        });
        res.status(201).json(newIngredient);
        return;
    }
    catch (error) {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: 'Failed to add ingredient' });
    }
});
exports.addIngredient = addIngredient;
const getAllIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredients = yield prisma.ingredient.findMany();
        res.status(200).json(ingredients);
    }
    catch (error) {
        console.error('Error fetching all ingredients:', error);
        res.status(500).json({ error: 'Failed to fetch all ingredients' });
    }
});
exports.getAllIngredients = getAllIngredients;
