"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const morgan_1 = __importDefault(require("morgan"));
const middlewares_1 = require("./middlewares/");
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const utils_1 = require("./utils");
const app_1 = require("./constants/app");
const helmet_1 = __importDefault(require("helmet"));
const utils_2 = require("./utils");
require("./events");
const route_1 = __importDefault(require("./features/base/route"));
const route_2 = __importDefault(require("./features/auth/route"));
const swagger_1 = __importDefault(require("./swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({}));
app.use((0, morgan_1.default)(app_1.MORGAN_CONFIG, {
    stream: app_1.IS_PRODUCTION ? utils_1.accessLogStream : process.stdout,
}));
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/", route_1.default);
app.use("/api/auth", route_2.default);
app.use("/api-docs", swagger_1.default);
app.use(middlewares_1.useNotFound);
app.use(middlewares_1.useErrorHandler);
exports.server = app.listen(app_1.PORT, () => {
    (0, utils_2.connectToDb)();
    utils_1.logger.info(`Server running on port ${app_1.PORT}`);
});
