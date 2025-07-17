import express from "express";
import { PORT } from "./config.js";
import { setCode, getCode, setCodeUsed, getAllVendingProduct } from "./db.js";
import { sendRequest } from "./vending.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));

const createRandomCode = () => {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += Math.floor(Math.random() * 9) + 1;
  }
  return code;
};

//TODO: set default false
const serviceAvailable = true;

app.get("/service", (req, res) => {
  res.send({ available: serviceAvailable });
});

app.get("/code/create", (req, res) => {
  let code;
  do {
    code = createRandomCode();
  } while (getCode.get(code));

  setCode.run(code);
  console.log(`New code: ${code}`);
  res.send({ code });
});

app.post("/code/verify/:code", (req, res) => {
  const { code } = req.params;

  const foundCode = getCode.get(code);

  if (foundCode && !foundCode.used) {
    // setCodeUsed.run(code);
    return res.send({ success: true });
  }

  res.send({ success: false });
});

app.get("/products", (req, res) => {
  const products = getAllVendingProduct.all() || [];

  if (!products.length) {
    return res.send({ products: [] });
  }

  const groupedProducts = products.reduce((acc, current) => {
    const category = current.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(current);
    return acc;
  }, {});

  res.send({ products: groupedProducts});
});

app.post("/vending", async (req, res) => {
  const { command, data } = req.body;
  console.log(`Command: ${command}, Data: ${JSON.stringify(data)}`);
  const result = await sendRequest(command, data);
  res.send({ success: true, data: result });
});

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
