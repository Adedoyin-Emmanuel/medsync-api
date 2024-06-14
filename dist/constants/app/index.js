"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPOINTMENT_UPDATED = exports.APPOINTMENT_CREATED = exports.ACCOUNT_CREATED = exports.MEDICATION_CREATED = exports.PORT = exports.MORGAN_CONFIG = exports.IS_PRODUCTION = exports.MAX_FILE_SIZE = exports.ALLOWED_FILE_UPLOAD_EXTENSIONS = exports.GLOBAL_REQUEST_PER_MINUTE = exports.GLOBAL_RATE_LIMIT_WINDOW_MS = void 0;
exports.GLOBAL_RATE_LIMIT_WINDOW_MS = 60 * 1000;
exports.GLOBAL_REQUEST_PER_MINUTE = 100;
exports.ALLOWED_FILE_UPLOAD_EXTENSIONS = ["png", "jpeg", "jpg"];
exports.MAX_FILE_SIZE = 1024 * 1024 * 5;
exports.IS_PRODUCTION = process.env.NODE_ENV === "production";
exports.MORGAN_CONFIG = exports.IS_PRODUCTION
    ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    : "dev";
exports.PORT = process.env.PORT || 2800;
exports.MEDICATION_CREATED = "Medication Created";
exports.ACCOUNT_CREATED = "Account Created";
exports.APPOINTMENT_CREATED = "Appointment Created";
exports.APPOINTMENT_UPDATED = "Appointment Updated";
