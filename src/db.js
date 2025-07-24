import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync(process.cwd() + "/db.sqlite");

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
  product_code СHAR(3) NOT NULL UNIQUE,
  inner_id INTEGER NOT NULL,
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

export const getAllVendingProductGroupByName = db.prepare(`
  SELECT inner_id, sum(active) as active
  FROM VendingProduct
  GROUP BY name 
  ORDER BY inner_id ASC
`);

export const setProductActiveById = db.prepare(
  "UPDATE VendingProduct SET active = ?, quantity = ? WHERE id = ?"
);

export const decreaseProductQuantityByProductCode = db.prepare(
  "UPDATE VendingProduct SET quantity = quantity - 1 WHERE product_code = ?"
);

export const disableProductByProductCode = db.prepare(
  "UPDATE VendingProduct SET active = 0 WHERE product_code = ? AND quantity <= 0"
);

export const getProductByInnerId = db.prepare(
  "SELECT * FROM VendingProduct WHERE inner_id = ? AND active = 1 AND quantity > 0 LIMIT 1"
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
    INSERT INTO VendingProduct (name, product_code, category, quantity, inner_id) VALUES
    ('Короткие носки', '15B',  'lavka', 5, 1),
    ('Короткие носки', '15A',  'lavka', 5, 1),
    ('Короткие носки', '150',  'lavka', 5, 1),
    ('Короткие носки', '159',  'lavka', 5, 1),

    ('Влажные салфетки', '14B',  'lavka', 5, 2),
    ('Влажные салфетки', '14A',  'lavka', 5, 2),
    ('Влажные салфетки', '140',  'lavka', 5, 2),
    ('Влажные салфетки', '149',  'lavka', 5, 2),

    ('Эко-вилки 6 шт.', '13B',  'lavka', 5, 3),
    ('Эко-вилки 6 шт.', '13A',  'lavka', 5, 3),
    ('Эко-вилки 6 шт.', '130',  'lavka', 5, 3),
    ('Эко-вилки 6 шт.', '139',  'lavka', 5, 3),

    ('Бальзам для губ', '12B',  'lavka', 5, 4),
    ('Бальзам для губ', '12A',  'lavka', 5, 4),
    ('Бальзам для губ', '120',  'lavka', 5, 4),
    ('Бальзам для губ', '129',  'lavka', 5, 4),

    ('Крем для рук', '11B',  'lavka', 5, 5),
    ('Крем для рук', '11A',  'lavka', 5, 5),
    ('Крем для рук', '110',  'lavka', 5, 5),
    ('Крем для рук', '119',  'lavka', 5, 5),

    ('Дождевик', '158', 'market', 5, 6),
    ('Дождевик', '157', 'market', 5, 6),
    ('Дождевик', '156', 'market', 5, 6),
    ('Дождевик', '155', 'market', 5, 6),

    ('Панама от солнца', '148', 'market', 5, 7),
    ('Панама от солнца', '147', 'market', 5, 7),
    ('Панама от солнца', '146', 'market', 5, 7),
    ('Панама от солнца', '145', 'market', 5, 7),

    ('Средство от комаров', '138', 'market', 5, 8),
    ('Средство от комаров', '137', 'market', 5, 8),
    ('Средство от комаров', '136', 'market', 5, 8),
    ('Средство от комаров', '135', 'market', 5, 8),

    ('SPF 50+', '128', 'market', 5, 9),
    ('SPF 50+', '127', 'market', 5, 9),
    ('SPF 50+', '126', 'market', 5, 9),
    ('SPF 50+', '125', 'market', 5, 9),

    ('Мини-фонарик', '118', 'market', 5, 10),
    ('Мини-фонарик', '117', 'market', 5, 10),
    ('Мини-фонарик', '116', 'market', 5, 10),
    ('Мини-фонарик', '115', 'market', 5, 10),

    ('Дрип-кофе', '154', 'food', 5, 11),
    ('Дрип-кофе', '153', 'food', 5, 11),
    ('Дрип-кофе', '152', 'food', 5, 11),
    ('Дрип-кофе', '151', 'food', 5, 11),

    ('Джерки из говядины', '144', 'food', 5, 12),
    ('Джерки из говядины', '143', 'food', 5, 12),
    ('Джерки из говядины', '142', 'food', 5, 12),
    ('Джерки из говядины', '141', 'food', 5, 12),

    ('Сушеные бананы', '134', 'food', 5, 13),
    ('Сушеные бананы', '133', 'food', 5, 13),
    ('Сушеные бананы', '132', 'food', 5, 13),
    ('Сушеные бананы', '131', 'food', 5, 13),

    ('Ореховое ассорти', '124', 'food', 5, 14),
    ('Ореховое ассорти', '123', 'food', 5, 14),
    ('Ореховое ассорти', '122', 'food', 5, 14),
    ('Ореховое ассорти', '121', 'food', 5, 14),

    ('Протеиновое печенье', '114', 'food', 5, 15),
    ('Протеиновое печенье', '113', 'food', 5, 15),
    ('Протеиновое печенье', '112', 'food', 5, 15),
    ('Протеиновое печенье', '111', 'food', 5, 15);
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
