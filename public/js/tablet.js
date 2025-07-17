document.addEventListener("DOMContentLoaded", async function () {
  const products = await fetch("/products")
    .then(async (res) => await res.json())
    .catch((err) => alert("Что-то пошло не так"));

  const steps = document.querySelectorAll(".step");
  const nextButtons = document.querySelectorAll(".step .btn");

  const stepFailed = document.querySelector(".step--failed");

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentStep = document.querySelector(".step.is-active");
      const currentIndex = Array.from(steps).indexOf(currentStep);
      const nextIndex = currentIndex + 1;

      if (steps[nextIndex]) {
        currentStep.classList.remove("is-active");
        steps[nextIndex].classList.add("is-active");
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

  const wrapBlocks = {
    market: document.querySelector('[data-id="market"]'),
    lavka: document.querySelector('[data-id="lavka"]'),
    food: document.querySelector('[data-id="food"]'),
  };
  const template = document.querySelector('[data-id="productCardTemplate"]');

  function createProductItem(data) {
    const clone = template.content.cloneNode(true);
    const container = clone.querySelector(".product__wrap-item");
    const img = container.querySelector(".product__wrap-item-img");
    const name = container.querySelector(".product__wrap-item-name");

    container.dataset.id = data.product_code;
    img.querySelector("img").src = data.imgURL;
    name.innerHTML = data.name;

    if (!data.active) {
      container.classList.add("is-soldout");
    }

    return container;
  }

  function fillProductByCategory(category) {
    wrapBlocks[category].innerHTML = "";

    console.log("category", category);
    // console.log("products", products);

    products.products[category].forEach((item) => {
      if (item.category === category) {
        const container = createProductItem(item);
        wrapBlocks[category].appendChild(container);
      }
    });

    const productItems = wrapBlocks[category].querySelectorAll(
      ".product__wrap-item"
    );

    productItems.forEach((container) => {
      const plusBtn = container.querySelector(".btn--plus");
      const submitBtn = container.querySelector(".btn--submit");

      if (container.classList.contains("is-soldout")) {
        plusBtn.textContent = "Разобрали";
        plusBtn.classList.remove("is-active");
        plusBtn.disabled = true;
        submitBtn.style.display = "none";
        return;
      }

      submitBtn.style.display = "none";

      plusBtn.addEventListener("click", () => {
        productItems.forEach((el) => {
          if (el.classList.contains("is-soldout")) return;

          el.classList.remove("is-selected", "is-fadeout");

          const elPlus = el.querySelector(".btn--plus");
          const elSubmit = el.querySelector(".btn--submit");

          elPlus.classList.add("is-active");
          elPlus.style.display = "inline-block";

          elSubmit.style.display = "none";
        });

        container.classList.add("is-selected");
        submitBtn.style.display = "inline-block";
        plusBtn.style.display = "none";

        productItems.forEach((el) => {
          if (el === container || el.classList.contains("is-soldout")) return;
          el.classList.add("is-fadeout");
        });
      });

      submitBtn.addEventListener("click", async () => {
        const step4 = document.querySelector(".step--4");
        const step5 = document.querySelector(".step--5");
        const step6 = document.querySelector(".step--6");
        try {
          step4.classList.remove("is-active");
          step5.classList.add("is-active");

          await fetch(`/vending`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              command: "dispense",
              data: {
                product_code: container.getAttribute("data-id"),
              },
            }),
          });
          setTimeout(() => {
            step5.classList.remove("is-active");
            step6.classList.add("is-active");
          }, 5000);
        } catch (err) {
          step5.classList.remove("is-active");
          stepFailed.classList.add("is-active");
        }
      });
    });
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentStep = document.querySelector(".step.is-active");
      const nextStep = document.querySelector(".step--4");
      const label = btn.textContent.trim();

      Object.values(contentBlocks).forEach((block) =>
        block.classList.remove("is-active")
      );

      if (label.includes("Маркета")) {
        contentBlocks.market.classList.add("is-active");
        fillProductByCategory("market");
      } else if (label.includes("Лавки")) {
        contentBlocks.lavka.classList.add("is-active");
        fillProductByCategory("lavka");
      } else if (label.includes("Еды")) {
        contentBlocks.food.classList.add("is-active");
        fillProductByCategory("food");
      }

      currentStep.classList.remove("is-active");
      nextStep.classList.add("is-active");
    });
  });

  const step5 = document.querySelector(".step--5");
  const progressBar = step5.querySelector(".progress__bar");

  const observer = new MutationObserver(() => {
    if (step5.classList.contains("is-active")) {
      progressBar.style.width = "0";
      requestAnimationFrame(() => {
        progressBar.style.width = "100%";
      });
    } else {
      progressBar.style.width = "0";
    }
  });

  observer.observe(step5, { attributes: true, attributeFilter: ["class"] });
});
