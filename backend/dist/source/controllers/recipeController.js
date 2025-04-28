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
exports.unbookmarkRecipe = exports.getAllRecipes = exports.bookmarkRecipe = exports.getRecipeDetail = exports.getRecipeByComplex = exports.getRecipesByIngredients = void 0;
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
const getRecipeByComplex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { terms, number } = req.query;
    // validate query parameters
    if (!terms || !number || isNaN(Number(number))) {
        res.status(400).json({ error: 'Invalid or missing query parameters: terms or number' });
        return;
    }
    // validate API key
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Spoonacular API key is not configured' });
        return;
    }
    // construct the Spoonacular API URL
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(terms)}&number=${number}&apiKey=${apiKey}`;
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
exports.getRecipeByComplex = getRecipeByComplex;
const getRecipeDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // validate query parameters
    if (!id) {
        res.status(400).json({ error: 'Invalid or missing query parameters: recipeId' });
        return;
    }
    // validate API key
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Spoonacular API key is not configured' });
        return;
    }
    // construct the Spoonacular API URL
    const apiUrl = `https://api.spoonacular.com/recipes/${encodeURIComponent(id)}/information?apiKey=${apiKey}`;
    try {
        // fetch from Spoonacular API
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipe detail from Spoonacular: ${response.status} ${response.statusText}`);
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
exports.getRecipeDetail = getRecipeDetail;
const bookmarkRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, id, name, image } = req.body;
    try {
        const newSavedRecipe = yield prisma.savedRecipe.create({
            data: {
                userId,
                savedRecipeId: id,
                recipeName: name,
                recipePicture: image,
            },
        });
        res.status(201).json(newSavedRecipe);
        return;
    }
    catch (error) {
        console.error('Error bookmarking recipe:', error);
        res.status(500).json({ error: 'Failed to bookmark recipe' });
    }
});
exports.bookmarkRecipe = bookmarkRecipe;
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Directly query the SavedRecipe table using the userId
        const savedRecipes = yield prisma.savedRecipe.findMany({
            where: { userId },
            select: {
                savedRecipeId: true,
                recipeName: true,
                recipePicture: true,
                userId: true
            }
        });
        // Map to the expected recipe format
        const recipes = savedRecipes.map(sr => ({
            id: sr.savedRecipeId,
            title: sr.recipeName,
            image: sr.recipePicture,
            // Add other necessary fields from your Recipe type if needed
        }));
        res.status(200).json(recipes);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});
exports.getAllRecipes = getAllRecipes;
const unbookmarkRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const unbookmarkedRecipe = yield prisma.savedRecipe.delete({
            where: {
                savedRecipeId: id
            },
        });
        res.status(200).json(unbookmarkedRecipe);
    }
    catch (error) {
        console.error('Error unbookmarking recipe:', error);
        res.status(500).json({ error: 'Failed to unbookmark recipe' });
    }
});
exports.unbookmarkRecipe = unbookmarkRecipe;
