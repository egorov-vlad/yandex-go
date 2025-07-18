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

  const categories = Object.keys(products.products);

  const productContainer = {
    market: document.querySelector('[data-id="productsMarket"]'),
    lavka: document.querySelector('[data-id="productsLavka"]'),
    food: document.querySelector('[data-id="productsFood"]'),
  };

  const productTemplate = document.querySelector(
    '[data-id="productCardTemplate"]'
  );

  if (products) {
    categories.forEach((category) => {
      const wrap = productContainer[category];

      products.products[category].forEach((product) => {
        const container = productTemplate.content.cloneNode(true);
        const name = container.querySelector(".product__name");
        const switchInput = container.querySelector(
          '[data-id="productSwitch"]'
        );

        name.dataset.id = product.id;
        name.textContent = product.name;
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

        wrap.appendChild(container);
      });
    });
  }
});
