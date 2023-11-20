"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Import controllers
const index_1 = require("../controller/index");
// API routes
router.get('/', (req, res) => (0, index_1.getIndexPage)(req, res));
module.exports = router;
