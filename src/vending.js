import crypto from "crypto";
import net from "net";
import { VENDING_SECRET_KEY, VENDING_PORT, VENDING_HOST } from "./config.js";
import {
  decreaseProductQuantityByProductCode,
  disableProductByProductCode,
  getVendingLastCommand,
  setVendingLastCommand,
} from "./db.js";

export const encrypt = (message) => {
  const key = Buffer.from(VENDING_SECRET_KEY, "hex");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(message, "utf8"),
    cipher.final(),
  ]);

  return Buffer.concat([iv, encrypted]).toString("base64");
};

export const decrypt = (encryptedBase64) => {
  const key = Buffer.from(VENDING_SECRET_KEY, "hex");
  const binaryData = Buffer.from(encryptedBase64, "base64");
  const iv = binaryData.subarray(0, 16);
  const encrypted = binaryData.subarray(16);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8"
  );
};

export const sendRequest = async ({ product_code }) => {
  const number = (getVendingLastCommand.get()?.id || 0) + 1;
  setVendingLastCommand.run();

  const command = {
    command_number: number,
    command_code: "dispense",
    data: {
      product_code: String(product_code),
    },
  };

  const encrypted = encrypt(JSON.stringify(command));
  const jsonWithNewline = JSON.stringify({ message: encrypted }) + "\n"; // NDJSON!

  console.log(`Command #${number}: ${encrypted}`);

  return new Promise((resolve, reject) => {
    const socket = net.createConnection(
      { host: VENDING_HOST, port: VENDING_PORT },
      () => {
        socket.write(jsonWithNewline);
      }
    );

    socket.on("data", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        const decrypted = decrypt(parsed.message);
        console.log(`Response for Command #${number}: ${decrypted}`);

        decreaseProductQuantityByProductCode.run(product_code);
        disableProductByProductCode.run(product_code);

        resolve(decrypted);
      } catch (err) {
        reject(err);
      } finally {
        socket.end();
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      reject(err);
    });

    socket.on("close", () => {
      console.log("Socket closed");
    });
  });
};
