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
  quantity INTEGER DEFAULT 0,
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
  "UPDATE VendingProduct SET active = ?, quantity = ? WHERE id = ?"
);

export const decreaseProductQuantityByProductCode = db.prepare(
  "UPDATE VendingProduct SET quantity = quantity - 1 WHERE product_code = ?"
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
    INSERT INTO VendingProduct (name, product_code, imgURL, category, quantity) VALUES
    ('Фруктовый хлеб', '1230', 'img/products/bread.png', 'market', 5),
    ('Фруктовый хлеб', '1231', 'img/products/bread.png', 'market', 5),
    ('Фруктовый хлеб', '1232', 'img/products/bread.png', 'market', 5),
    ('Фруктовый хлеб', '1233', 'img/products/bread.png', 'market', 5),
    ('Фруктовый хлеб', '1234', 'img/products/bread.png', 'market', 5),
    ('Фруктовый хлеб', '1235', 'img/products/bread.png', 'lavka', 5),
    ('Фруктовый хлеб', '1236', 'img/products/bread.png', 'lavka', 5),
    ('Фруктовый хлеб', '1237', 'img/products/bread.png', 'lavka', 5),
    ('Фруктовый хлеб', '1238', 'img/products/bread.png', 'lavka', 5),
    ('Фруктовый хлеб', '1239', 'img/products/bread.png', 'lavka', 5),
    ('Фруктовый хлеб', '1240', 'img/products/bread.png', 'food', 5),
    ('Фруктовый хлеб', '1241', 'img/products/bread.png', 'food', 5),
    ('Фруктовый хлеб', '1242', 'img/products/bread.png', 'food', 5),
    ('Фруктовый хлеб', '1243', 'img/products/bread.png', 'food', 5),
    ('Фруктовый хлеб', '1245', 'img/products/bread.png', 'food', 5);
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
