import express from "express";
import { PORT } from "./config.js";
import {
  setCode,
  getCode,
  getAllVendingProduct,
  setProductActiveById,
  setCodeUsed,
} from "./db.js";
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
let serviceAvailable = true;

app.get("/service", (req, res) => {
  res.send({ available: serviceAvailable });
});

app.post("/service", (req, res) => {
  serviceAvailable = req.body.available;
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
      acc[category] = {};
    }
    const name = current.name;
    if (!acc[category][name]) {
      acc[category][name] = [];
    }

    acc[category][name].push(current);
    return acc;
  }, {});

  res.send({ ...groupedProducts });
});

app.post("/product/:id", (req, res) => {
  const id = req.params.id;
  const { active } = req.body;

  console.log(`Product: ${id}, Active: ${active}`);

  setProductActiveById.run(active ? 1 : 0, active ? 5 : 0, id);
  res.send({ success: true });
});

app.post("/vending", async (req, res) => {
  try {
    const { command, data } = req.body;
    console.log(`Command: ${command}, Data: ${JSON.stringify(data)}`);
    const result = await sendRequest(command, data);
    res.send({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
