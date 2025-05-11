"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_manager_1 = require("../../../libs/generated-clients/postgres-manager");
const prisma = new postgres_manager_1.PrismaClient();
exports.default = prisma;
