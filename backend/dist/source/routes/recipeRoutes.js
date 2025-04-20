"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipeController_1 = require("../controllers/recipeController");
const router = (0, express_1.Router)();
router.get('/', recipeController_1.getRecipesByIngredients);
exports.default = router;
