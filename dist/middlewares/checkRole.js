"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const errors_1 = require("../constants/errors");
const useCheckRole = (role) => {
    return (req, res, next) => {
        const userType = req.userType;
        console.log(userType, role);
        if (userType === role) {
            next();
        }
        else {
            return (0, utils_1.response)(res, 403, errors_1.INSUFFICIENT_PERMISSION);
        }
    };
};
exports.default = useCheckRole;
