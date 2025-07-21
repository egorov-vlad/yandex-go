document.addEventListener("DOMContentLoaded", async () => {
  const availableInput = document.querySelector('[data-id="available"]');

  const serviceAvailable = await fetch("/service")
    .then((res) => res.json())
    .then((data) => data.available);

  availableInput.checked = serviceAvailable;

  availableInput.addEventListener("change", async () => {
    await fetch("/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ available: availableInput.checked }),
    }).catch((err) => alert("Что-то пошло не так"));
  });

  const products = await fetch("/products")
    .then(async (res) => await res.json())
    .catch((err) => alert("Что-то пошло не так"));

  const categories = Object.keys(products);

  const productContainer = {
    market: document.querySelector('[data-id="productsMarket"]'),
    lavka: document.querySelector('[data-id="productsLavka"]'),
    food: document.querySelector('[data-id="productsFood"]'),
  };

  const productCardTemplate = document.querySelector(
    '[data-id="productCardTemplate"]'
  );
  const productTemplate = document.querySelector('[data-id="productTemplate"]');

  if (products) {
    console.log(products);
    console.log(categories);
    categories.forEach((category) => {
      const wrap = productContainer[category];
      const positions = Object.keys(products[category]);

      positions.forEach((position) => {
        const container = productCardTemplate.content.cloneNode(true);
        const positionWrap = container.querySelector(".product__wrap");
        const name = container.querySelector(".product__name");
        name.textContent = position;

        products[category][position].forEach((product) => {
          const container = productTemplate.content.cloneNode(true);
          const switchInput = container.querySelector(
            '[data-id="productSwitch"]'
          );
          const productCode = container.querySelector(
            '[data-id="productCode"]'
          );

          productCode.textContent = product.product_code;
          switchInput.checked = product.active;

          switchInput.addEventListener("change", async () => {
            await fetch(`/product/${product.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ active: switchInput.checked }),
            }).catch((err) => alert("Что-то пошло не так"));
          });
          positionWrap.appendChild(container);
        });
        wrap.appendChild(container);
      });
    });
  }
});
