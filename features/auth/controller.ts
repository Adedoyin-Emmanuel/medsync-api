import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { squad, response, eventEmitter } from "../../utils";
import { createHospitalSchema, createUserSchema, loginSchema } from "./schema";
import { User, Token } from "./model";
import { generateVerificationToken } from "../../utils/token";
import sendEmail from "../../services/email/sendEmail";
import dayjs from "dayjs";
import config from "config";
import { IS_PRODUCTION, ACCOUNT_CREATED } from "../../constants/app";

class AuthController {
  static async createUser(req: Request, res: Response) {
    const value = await createUserSchema.validateAsync(req.body);

    const { name, username, email, password, state, country } = value;

    const existingUser = await User.findOne({ email });

    if (existingUser) return response(res, 400, "Email already exists");
    const existingUsername = await User.findOne({ username });

    if (existingUsername) return response(res, 400, "Username already taken");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePicture = `https://api.dicebear.com/7.x/micah/svg?seed=${
      username || name
    }`;

    const valueToStore = {
      name,
      username,
      email,
      password: hashedPassword,
      state,
      country,
      profilePicture,
    };

    const user = await User.create(valueToStore);
    const verifyToken = generateVerificationToken(user._id as string);

    const { token } = verifyToken;

    await Token.create(verifyToken);

    eventEmitter.emit(ACCOUNT_CREATED, { email, token });
    return response(
      res,
      200,
      "Account created. Please check your email to verify your account",
      {}
    );
  }

  static async createHospital(req: Request, res: Response) {
    const value = await createHospitalSchema.validateAsync(req.body);
    const { name, username, email, password, state, country, tags } = value;

    const existingHospital = await User.findOne({ email });

    if (existingHospital) return response(res, 400, "Email already exists");

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return response(res, 400, "Username already takenn");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePicture = `https://api.dicebear.com/7.x/micah/svg?seed=${
      username || name
    }`;

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

    const hospital = await User.create(valueToStore);
    const verifyToken = generateVerificationToken(hospital._id as string);

    const { token } = verifyToken;

    await Token.create(verifyToken);

    const url =
      process.env.NODE_ENV !== "production"
        ? `http://localhost:2800/api/auth/verify-email?token=${token}`
        : `https://medsync-api.com/api/auth/verify-email?token=${token}`;

    const message = `Welcome. Please verify your email by clicking the link below. 
    ${url}
    `;

    sendEmail("Verify your email", message, email);
    return response(
      res,
      200,
      "Account created. Please check your email to verify your account",
      {}
    );
  }

  static async login(req: Request, res: Response) {
    const value = await loginSchema.validateAsync(req.body);

    const { email, password } = value;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return response(res, 400, "Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return response(res, 400, "Invalid credentials");

    if (!user.isVerified) return response(res, 400, "You are not verified");

    const accessToken = await user.generateAccessToken(user.role);
    const refreshToken = await user.generateRefreshToken(user.role);

    user.online = true;
    await user.save();

    await Token.create({
      token: refreshToken,
      type: "refresh",
      userId: user._id,
      expiresIn: dayjs().add(7, "days"),
    });

    res.header("X-Auth-Access-Token", accessToken);
    res.header("X-Auth-Refresh-Token", refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: config.get("App.cookieAccessTokenExpiration"),
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: config.get("App.cookieRefreshTokenExpiration"),
      path: "/",
    });

    return response(res, 200, "Login successful", {
      accessToken,
      refreshToken,
    });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.removeHeader("X-Auth-Access-Token");
    res.removeHeader("X-Auth-Refresh-Token");

    return response(res, 200, "Logout successful");
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token } = req.query;

    if (!token)
      return res.send(
        "Token not found. Please check your mail and proceed with the link "
      );

    const tokenExists = await Token.findOne({ token });

    if (!tokenExists) return res.send("Invalid or expired token");

    const expiresIn = dayjs(tokenExists.expiresIn);
    const now = dayjs();
    const isExpired = now.isAfter(expiresIn);

    if (isExpired) return res.send("Token expired.");

    const user = await User.findById(tokenExists.userId);

    if (!user) return res.send("User not found");

    user.isVerified = true;

    await user.save();

    await Token.findByIdAndDelete(tokenExists._id);

    return res.send("Verification successful");
  }

  static async refreshToken(req: Request, res: Response) {}

  static async forgotPassword(req: Request, res: Response) {}

  static async resetPassword(req: Request, res: Response) {}
}

export default AuthController;
