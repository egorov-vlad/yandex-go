import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync(process.cwd() + "./db.sqlite");

db.exec(`CREATE TABLE IF NOT EXISTS Codes(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code CHAR(4) NOT NULL UNIQUE,
  used BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.exec(`CREATE TABLE IF NOT EXISTS VendingLastCommand(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

db.exec(`CREATE TABLE IF NOT EXISTS VendingProduct(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  product_code VARCHAR(255) NOT NULL,
  imgURL VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

export const setCode = db.prepare("INSERT INTO Codes (code) VALUES (?)");
export const setCodeUsed = db.prepare(
  "UPDATE Codes SET used = 1 WHERE code = ?"
);
export const getCode = db.prepare("SELECT * FROM Codes WHERE code = ?");

export const getAllVendingProduct = db.prepare("SELECT * FROM VendingProduct");

export const setProductActiveById = db.prepare(
  "UPDATE VendingProduct SET active = ? WHERE id = ?"
);

export const getVendingLastCommand = db.prepare(
  "SELECT * FROM VendingLastCommand ORDER BY created_at DESC LIMIT 1"
);

export const setVendingLastCommand = db.prepare(
  "INSERT INTO VendingLastCommand DEFAULT VALUES"
);

const init = () => {
  db.prepare(
    `
    INSERT INTO VendingProduct (name, product_code, imgURL, category) VALUES
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'lavka'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'lavka'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'lavka'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'lavka'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'lavka'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food'),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'food');
  `
  ).run();
};

const clear = () => {
  db.prepare("DELETE FROM Codes").run();
  db.prepare("DELETE FROM VendingLastCommand").run();
  db.prepare("DELETE FROM VendingProduct").run();
};

// clear();
// init();
