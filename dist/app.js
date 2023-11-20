"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);
app.get('*', (req, res) => {
    res.status(404).send('Error Page 404');
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`server is running on port ${port}`));
