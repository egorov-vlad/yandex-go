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
  try {
    const number = getVendingLastCommand.get()?.id || 0 + 1;
    setVendingLastCommand.run();

    //TODO:move to end of function
    decreaseProductQuantityByProductCode.run(product_code);
    disableProductByProductCode.run(product_code);

    const encrypted = encrypt(
      JSON.stringify({
        command_number: number,
        command_code: "dispense",
        data: {
          product_code: String(product_code),
        },
      })
    );

    console.log(`Command #${number}: ${encrypted}`);
    const socket = net.createConnection({
      host: VENDING_HOST,
      port: VENDING_PORT,
    });

    socket.write(encrypted);

    const r = await new Promise((resolve, reject) => {
      socket.on("data", (data) => {
        resolve(decrypt(data.toString()));
      });

      socket.on("error", (err) => {
        console.error(err);
        reject(err);
      });
    });

    console.log(`Command #${number}: ${r}`);

    //TODO: error separation

    socket.end();

    return r;
  } catch (e) {
    return Promise.reject(e);
  }
};
