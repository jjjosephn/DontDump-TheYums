"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exampleController_1 = require("../controllers/exampleController");
const router = (0, express_1.Router)();
router.get('/', exampleController_1.getUsers);
router.get('/users/:id', exampleController_1.getUsers);
router.post('/', exampleController_1.addUsers);
exports.default = router;
