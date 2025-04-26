"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipeController_1 = require("../controllers/recipeController");
const router = (0, express_1.Router)();
router.get('/byIng', recipeController_1.getRecipesByIngredients);
router.get('/complex', recipeController_1.getRecipeByComplex);
exports.default = router;
