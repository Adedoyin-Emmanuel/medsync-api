"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const errors_1 = require("../constants/errors");
const useNotFound = (req, res) => {
    return (0, response_1.default)(res, 404, errors_1.ROUTE_NOT_FOUND);
};
exports.default = useNotFound;
