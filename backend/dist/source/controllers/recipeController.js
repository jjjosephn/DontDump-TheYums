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
exports.getRecipesByIngredients = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRecipesByIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ingredients, number } = req.query;
    // validate query parameters
    if (!ingredients || !number || isNaN(Number(number))) {
        res.status(400).json({ error: 'Invalid or missing query parameters: ingredients or number' });
        return;
    }
    // validate API key
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Spoonacular API key is not configured' });
        return;
    }
    // construct the Spoonacular API URL
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=${number}&apiKey=${apiKey}`;
    try {
        // fetch from Spoonacular API
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipes from Spoonacular: ${response.status} ${response.statusText}`);
        }
        // parse and send the response data
        const data = yield response.json();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
    }
});
exports.getRecipesByIngredients = getRecipesByIngredients;
