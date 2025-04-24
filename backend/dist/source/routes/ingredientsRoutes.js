"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingredientsController_1 = require("../controllers/ingredientsController");
const router = (0, express_1.Router)();
router.get('/info', ingredientsController_1.fetchIngredients);
router.post('/add', ingredientsController_1.addIngredient);
router.get('/', ingredientsController_1.getAllIngredients);
exports.default = router;
