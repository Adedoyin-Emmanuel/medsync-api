import config from "config";
import jwt, { SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isVerified: boolean;
  allTotalAppointments?: number;
  location?: string;
  state: string;
  country: string;
  online?: boolean;
  phoneNumber?: number;
  role: "user" | "hospital" | "admin";
  bio: string;
  tags: string[];
  medicalRecordsAccess: string[];
  reviews: string[];
  merchantId: string;

  generateAccessToken(role: "user" | "hospital" | "admin"): string;
  generateRefreshToken(role: "user" | "hospital" | "admin"): string;
}

export interface IToken {
  token: string;
  type: "refresh" | "access" | "verify";
  userId: string;
  expiresIn: any;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50,
    },
    username: {
      type: String,
      required: true,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      max: 30,
      required: true,
      select: false,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
      default: "Bridging health with technology",
      max: 500,
    },

    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },

    location: {
      type: String,
      required: false,
      max: 150,
      default: "",
    },

    state: {
      type: String,
      required: true,
      max: 250,
    },

    country: {
      type: String,
      required: false,
      max: 250,
      default: "Nigeria",
    },

    allTotalAppointments: {
      type: Number,
      required: false,
      default: 0,
    },

    phoneNumber: {
      type: Number,
      required: false,
      default: null,
    },

    online: {
      type: Boolean,
      required: false,
      default: false,
    },

    tags: [
      {
        type: String,
        required: false,
        max: 250,
      },
    ],

    merchantId: {
      type: String,
      required: false,
    },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointments",
      },
    ],

    role: {
      type: String,
      required: true,
      enum: ["user", "hospital", "admin"],
      default: "user",
    },

    medicalRecordsAccess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["refresh", "access", "verify"],
      required: true,
    },

    expiresIn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.methods.generateAccessToken = function (
  role: "user" | "hospital" | "admin"
) {
  const payload = {
    _id: this._id,
    username: this.username,
    name: this.name,
    role,
  };
  const JWT_SECRET: any = process.env.JWT_PRIVATE_KEY;
  const tokenExpiration: string = config.get("App.tokenExpiration");

  const options: SignOptions = {
    expiresIn: tokenExpiration,
  };

  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

UserSchema.methods.generateRefreshToken = function (
  role: "user" | "hospital" | "admin"
) {
  const payload = {
    _id: this._id,
    username: this.username,
    name: this.name,
    role,
  };
  const JWT_SECRET: any = process.env.JWT_PRIVATE_KEY;

  const options: SignOptions = {
    expiresIn: config.get("App.refreshTokenExpiration"),
  };

  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

export const User = mongoose.model<IUser>("User", UserSchema);
export const Token = mongoose.model<IToken>("Token", TokenSchema);
