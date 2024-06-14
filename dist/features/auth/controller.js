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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../../utils");
const schema_1 = require("./schema");
const model_1 = require("./model");
const token_1 = require("../../utils/token");
const sendEmail_1 = __importDefault(require("../../services/email/sendEmail"));
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = __importDefault(require("config"));
const app_1 = require("../../constants/app");
class AuthController {
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.createUserSchema.validateAsync(req.body);
            const { name, username, email, password, state, country } = value;
            const existingUser = yield model_1.User.findOne({ email });
            if (existingUser)
                return (0, utils_1.response)(res, 400, "Email already exists");
            const existingUsername = yield model_1.User.findOne({ username });
            if (existingUsername)
                return (0, utils_1.response)(res, 400, "Username already taken");
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            const profilePicture = `https://api.dicebear.com/7.x/micah/svg?seed=${username || name}`;
            const valueToStore = {
                name,
                username,
                email,
                password: hashedPassword,
                state,
                country,
                profilePicture,
            };
            const user = yield model_1.User.create(valueToStore);
            const verifyToken = (0, token_1.generateVerificationToken)(user._id);
            const { token } = verifyToken;
            yield model_1.Token.create(verifyToken);
            utils_1.eventEmitter.emit(app_1.ACCOUNT_CREATED, { email, token });
            return (0, utils_1.response)(res, 200, "Account created. Please check your email to verify your account", {});
        });
    }
    static createHospital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.createHospitalSchema.validateAsync(req.body);
            const { name, username, email, password, state, country, tags } = value;
            const existingHospital = yield model_1.User.findOne({ email });
            if (existingHospital)
                return (0, utils_1.response)(res, 400, "Email already exists");
            const existingUsername = yield model_1.User.findOne({ username });
            if (existingUsername)
                return (0, utils_1.response)(res, 400, "Username already takenn");
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            const profilePicture = `https://api.dicebear.com/7.x/micah/svg?seed=${username || name}`;
            const valueToStore = {
                name,
                username,
                email,
                password: hashedPassword,
                state,
                country,
                profilePicture,
                tags,
                role: "hospital",
            };
            const hospital = yield model_1.User.create(valueToStore);
            const verifyToken = (0, token_1.generateVerificationToken)(hospital._id);
            const { token } = verifyToken;
            yield model_1.Token.create(verifyToken);
            const url = process.env.NODE_ENV !== "production"
                ? `http://localhost:2800/api/auth/verify-email?token=${token}`
                : `https://medsync-api.com/api/auth/verify-email?token=${token}`;
            const message = `Welcome. Please verify your email by clicking the link below. 
    ${url}
    `;
            (0, sendEmail_1.default)("Verify your email", message, email);
            return (0, utils_1.response)(res, 200, "Account created. Please check your email to verify your account", {});
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.loginSchema.validateAsync(req.body);
            const { email, password } = value;
            const user = yield model_1.User.findOne({ email }).select("+password");
            if (!user)
                return (0, utils_1.response)(res, 400, "Invalid credentials");
            const validPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!validPassword)
                return (0, utils_1.response)(res, 400, "Invalid credentials");
            if (!user.isVerified)
                return (0, utils_1.response)(res, 400, "You are not verified");
            const accessToken = yield user.generateAccessToken(user.role);
            const refreshToken = yield user.generateRefreshToken(user.role);
            user.online = true;
            yield user.save();
            yield model_1.Token.create({
                token: refreshToken,
                type: "refresh",
                userId: user._id,
                expiresIn: (0, dayjs_1.default)().add(7, "days"),
            });
            res.header("X-Auth-Access-Token", accessToken);
            res.header("X-Auth-Refresh-Token", refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: config_1.default.get("App.cookieAccessTokenExpiration"),
                path: "/",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: config_1.default.get("App.cookieRefreshTokenExpiration"),
                path: "/",
            });
            return (0, utils_1.response)(res, 200, "Login successful", {
                accessToken,
                refreshToken,
            });
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.removeHeader("X-Auth-Access-Token");
            res.removeHeader("X-Auth-Refresh-Token");
            return (0, utils_1.response)(res, 200, "Logout successful");
        });
    }
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            if (!token)
                return res.send("Token not found. Please check your mail and proceed with the link ");
            const tokenExists = yield model_1.Token.findOne({ token });
            if (!tokenExists)
                return res.send("Invalid or expired token");
            const expiresIn = (0, dayjs_1.default)(tokenExists.expiresIn);
            const now = (0, dayjs_1.default)();
            const isExpired = now.isAfter(expiresIn);
            if (isExpired)
                return res.send("Token expired.");
            const user = yield model_1.User.findById(tokenExists.userId);
            if (!user)
                return res.send("User not found");
            user.isVerified = true;
            yield user.save();
            yield model_1.Token.findByIdAndDelete(tokenExists._id);
            return res.send("Verification successful");
        });
    }
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = AuthController;
