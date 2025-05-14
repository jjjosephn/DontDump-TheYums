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
exports.fetchDisposalTip = exports.deleteIngredient = exports.getAllIngredients = exports.addIngredient = exports.fetchIngredients = void 0;
const client_1 = require("@prisma/client");
const openai_1 = require("openai");
const prisma = new client_1.PrismaClient();
const openai = new openai_1.OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
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
    const { name, image, userId, expiryDate } = req.body;
    try {
        const newIngredient = yield prisma.ingredient.create({
            data: {
                userId,
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
    const { userId } = req.params;
    try {
        const ingredients = yield prisma.ingredient.findMany({
            where: {
                userId
            }
        });
        res.status(200).json(ingredients);
    }
    catch (error) {
        console.error('Error fetching all ingredients:', error);
        res.status(500).json({ error: 'Failed to fetch all ingredients' });
    }
});
exports.getAllIngredients = getAllIngredients;
const deleteIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedIngredient = yield prisma.ingredient.delete({
            where: {
                ingredientId: id
            },
        });
        res.status(200).json(deletedIngredient);
    }
    catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ error: 'Failed to delete ingredient' });
    }
});
exports.deleteIngredient = deleteIngredient;
const fetchDisposalTip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { name } = req.query;
    if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Missing or invalid ingredient name" });
        return;
    }
    try {
        const completion = yield openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that provides environmentally friendly disposal tips. Keep responses to 1-2 sentences without formatting."
                },
                {
                    role: "user",
                    content: `
               For ${name} and its common packaging:
               - Use bullet points
               - Newline after each bullet point
               - State if compostable (specify any special instructions)
               - Mention recyclable packaging types
               - Keep response plain text
               ${name.toLowerCase().includes('food') ? 'Include composting link' : ''}
            `
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });
        const tip = ((_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || "";
        res.status(200).json({ tip });
    }
    catch (error) {
        console.error("Error generating disposal tip:", error);
        res.status(500).json({
            error: "Failed to generate disposal tip. For food waste, consider composting if possible. For packaging, check local recycling guidelines.",
        });
    }
});
exports.fetchDisposalTip = fetchDisposalTip;
