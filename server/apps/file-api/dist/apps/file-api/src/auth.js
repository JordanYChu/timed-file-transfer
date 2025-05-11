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
exports.authenticate = void 0;
const authentication_middleware_1 = __importDefault(require("../../../libs/authentication-middleware"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('awaaaa   ' + req);
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return; // Exit the function after sending the response
    }
    const idToken = authHeader.split(' ')[1];
    try {
        const decodedToken = yield authentication_middleware_1.default.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach the decoded token to the request
        console.log(decodedToken);
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.log("auth.ts Error:" + error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return; // Exit the function after sending the response
    }
});
exports.authenticate = authenticate;
