document.addEventListener("DOMContentLoaded", async function () {
  const step3 = document.querySelector(".step--3");
  const step4 = document.querySelector(".step--4");
  const step5 = document.querySelector(".step--5");
  const step6 = document.querySelector(".step--6");

  const btnToStart = document.querySelector('[data-id="btnToStart"]');

  btnToStart.addEventListener("click", () => {
    window.document.location.reload();
  });

  async function checkServiceAvailable() {
    const serviceAvailable = await fetch("/service")
      .then((res) => res.json())
      .then((data) => data.available);

    console.log(`Service available: ${serviceAvailable}`);

    const main = document.querySelector(".main");
    const locked = document.querySelector(".locked");

    if (!serviceAvailable) {
      main.classList.remove("is-active");
      locked.classList.add("is-active");
    } else {
      main.classList.add("is-active");
      locked.classList.remove("is-active");
    }
  }

  checkServiceAvailable();

  setInterval(checkServiceAvailable, 20000);

  async function getProduct() {
    const products = await fetch("/products/active").then(
      async (res) => await res.json()
    );

    // console.log(products.products);
    products.products.forEach((product) => {
      if (product.active === 0) {
        // console.log(product);
        const element = document.querySelector(
          `[data-inner-id="${product.inner_id}"]`
        );
        element.classList.add("is-soldout");
        const btn = element.querySelector(".btn--submit");
        const name = element.querySelector(".product__wrap-item-name");
        name.textContent = "Разобрали";
        btn.disabled = true;
      }
    });
    return products.products;
  }

  await getProduct();

  setInterval(async () => {
    const { blackScreen } = await fetch("/black-screen", {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (blackScreen) {
      const host = new URL(window.document.location).host;
      window.location.replace(`http://${host}/black.html?redirect=tablet.html`);
    }
  }, 20000);

  const steps = document.querySelectorAll(".step");
  const nextButtons = document.querySelectorAll(".step .btn");

  const stepFailed = document.querySelector(".step--failed");

  const loadingElement = document.querySelector('[data-id="loading"');
  const loadingTitles = {
    lavka: "Выбираем любимое...",
    market: "Выгружаем полезное...",
    food: "Выдаёмвкусное...",
  };

  const toStartBtn = document.querySelector(".location");

  toStartBtn.addEventListener("click", () => {
    window.document.location.reload();
  });

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentStep = document.querySelector(".step.is-active");
      const currentIndex = Array.from(steps).indexOf(currentStep);
      const nextIndex = currentIndex + 1;

      if (steps[nextIndex]) {
        currentStep.classList.remove("is-active");
        steps[nextIndex].classList.add("is-active");
        if (nextIndex === 1) {
          keyboard.classList.remove("is-hidden");
          keyboard.classList.add("is-active");
        }
      }

      if (steps[nextIndex].classList.contains("step--6")) {
        setTimeout(() => {
          window.document.location.reload();
        }, 30000);
      }
    });
  });

  const input = document.querySelector(".code__input");
  const keyboard = document.querySelector(".keyboard");
  const keys = keyboard.querySelectorAll(".key");
  const maxLength = 4;

  input.addEventListener("click", () => {
    keyboard.classList.remove("is-hidden");
  });

  document.addEventListener("click", (e) => {
    if (!keyboard.contains(e.target) && e.target !== input) {
      keyboard.classList.add("is-hidden");
    }
  });

  function renderErrorStep(currentStep) {
    const lockedStep = document.querySelector(".step--locked");
    if (lockedStep) {
      currentStep.classList.remove("is-active");
      lockedStep.classList.add("is-active");
    }

    setTimeout(() => {
      window.document.location.reload();
    }, 5000);
  }

  keys.forEach((key) => {
    key.addEventListener("click", async () => {
      const value = key.textContent;

      if (key.classList.contains("key--backspace")) {
        input.value = input.value.slice(0, -1);
      } else if (key.classList.contains("key--submit")) {
        keyboard.classList.add("is-hidden");

        const currentStep = document.querySelector(".step.is-active");
        const stepsArray = Array.from(document.querySelectorAll(".step"));
        const currentIndex = stepsArray.indexOf(currentStep);

        if (input.value.length < maxLength) {
          return renderErrorStep(currentStep);
        } else {
          const data = await fetch(`/code/verify/${input.value}`, {
            method: "POST",
          }).then((response) => response.json());

          if (!data.success) {
            return renderErrorStep(currentStep);
          }
          const nextStep = stepsArray[currentIndex + 1];
          if (nextStep) {
            currentStep.classList.remove("is-active");
            nextStep.classList.add("is-active");
          }
        }
      } else {
        if (input.value.length < maxLength) {
          input.value += value;
        }
      }
    });
  });

  input.addEventListener("input", () => {
    const value = input.value.padEnd(4, "X");
    input.setAttribute("placeholder", value);
  });

  const categoryButtons = document.querySelectorAll(".step--3 .btn");
  const contentBlocks = {
    market: document.querySelector(".step__content--market"),
    lavka: document.querySelector(".step__content--lavka"),
    food: document.querySelector(".step__content--food"),
  };

  // const wrapBlocks = {
  //   market: document.querySelector('[data-id="market"]'),
  //   lavka: document.querySelector('[data-id="lavka"]'),
  //   food: document.querySelector('[data-id="food"]'),
  // };
  // const template = document.querySelector('[data-id="productCardTemplate"]');

  // function createProductItem(data) {
  //   const clone = template.content.cloneNode(true);
  //   const container = clone.querySelector(".product__wrap-item");
  //   const img = container.querySelector(".product__wrap-item-img");
  //   const name = container.querySelector(".product__wrap-item-name");
  //   const submitBtn = container.querySelector(".btn--submit");

  //   container.dataset.id = data.product_code;
  //   img.querySelector("img").src = data.imgURL;
  //   name.innerHTML = data.name;

  //   if (!data.active) {
  //     submitBtn.disabled = true;
  //     name.innerHTML = "Разобрали";
  //     container.classList.add("is-soldout");
  //   }

  //   return container;
  // }

  // function fillProductByCategory(category) {
  //   wrapBlocks[category].innerHTML = "";

  //   products.products[category].forEach((item) => {
  //     if (item.category === category) {
  //       const container = createProductItem(item);
  //       wrapBlocks[category].appendChild(container);
  //     }
  //   });

  const productItems = document.querySelectorAll(".product__wrap-item");

  productItems.forEach((container) => {
    const submitBtn = container.querySelector(".btn--submit");

    container.addEventListener("click", (e) => {
      if (e.target.closest(".btn--submit")) return;
      if (container.classList.contains("is-soldout")) return;

      productItems.forEach((el) => {
        if (el === container) {
          el.classList.add("is-shown");
          el.classList.remove("is-hidden");
        } else {
          el.classList.add("is-hidden");
          el.classList.remove("is-shown");
        }
      });
    });

    submitBtn.addEventListener("click", async () => {
      let timeoutId;
      try {
        step4.classList.remove("is-active");
        step5.classList.add("is-active");

        timeoutId = setTimeout(() => {
          step5.classList.remove("is-active");
          step6.classList.add("is-active");
        }, 5000);

        // const response = await fetch(`/vending`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     innerId: container.dataset.innerId,
        //   }),
        // });

        // if (!response.ok) {
        //   clearTimeout(timeoutId);
        //   step5.classList.remove("is-active");
        //   stepFailed.classList.add("is-active");
        //   return;
        // }
      } catch (err) {
        clearTimeout(timeoutId);
        step5.classList.remove("is-active");
        stepFailed.classList.add("is-active");
      }
    });
  });
  // }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const currentStep = document.querySelector(".step.is-active");
      const nextStep = document.querySelector(".step--4");
      const label = btn.textContent.trim();

      await getProduct();

      Object.values(contentBlocks).forEach((block) =>
        block.classList.remove("is-active")
      );

      if (label.includes("Маркета")) {
        contentBlocks.market.classList.add("is-active");
        // fillProductByCategory("market");
        loadingElement.innerHTML = loadingTitles.market;
      } else if (label.includes("Лавки")) {
        contentBlocks.lavka.classList.add("is-active");
        // fillProductByCategory("lavka");
        loadingElement.innerHTML = loadingTitles.lavka;
      } else if (label.includes("Еды")) {
        contentBlocks.food.classList.add("is-active");
        // fillProductByCategory("food");
        loadingElement.innerHTML = loadingTitles.food;
      }

      currentStep.classList.remove("is-active");
      nextStep.classList.add("is-active");
    });
  });

  const progressBar = step5.querySelector(".progress__bar");

  const observer = new MutationObserver(() => {
    try {
      if (step5.classList.contains("is-active")) {
        progressBar.style.width = "0";
        requestAnimationFrame(() => {
          progressBar.style.width = "100%";
        });
      } else {
        progressBar.style.width = "0";
      }
    } catch (err) {
      step5.classList.remove("is-active");
      stepFailed.classList.add("is-active");
    }
  });

  observer.observe(step5, { attributes: true, attributeFilter: ["class"] });

  const backButton = document.querySelector(".step--4 .step__btn--back");
  backButton.addEventListener("click", () => {
    const shownItem = step4.querySelector(".product__wrap-item.is-shown");

    if (shownItem) {
      const allItems = step4.querySelectorAll(".product__wrap-item");
      allItems.forEach((item) => {
        item.classList.remove("is-shown", "is-hidden");
      });
      return;
    }

    step4.classList.remove("is-active");
    step3.classList.add("is-active");
  });
});
