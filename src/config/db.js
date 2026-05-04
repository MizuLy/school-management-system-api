const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via Prisma");
  } catch (err) {
    console.error(`Database connection error: ${error.message}`);
    process.exit();
  }
};
const disconnectDB = async () => {
  await prisma.$disconnect();
};

module.exports = { prisma, connectDB, disconnectDB };
