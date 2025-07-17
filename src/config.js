import "dotenv/config";

export const {
  PORT = 3000,
  NODE_ENV = "development",
  VENDING_SECRET_KEY = "secret",
  VENDING_PORT = 4366,
  VENDING_HOST = "127.0.0.1",
} = process.env;
