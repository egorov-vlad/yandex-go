document.addEventListener("DOMContentLoaded", async function () {
  // async function checkServiceAvailable() {
  //   const serviceAvailable = await fetch("/service")
  //     .then((res) => res.json())
  //     .then((data) => data.available);

  //   console.log(`Service available: ${serviceAvailable}`);

  //   const main = document.querySelector(".main");
  //   const locked = document.querySelector(".locked");

  //   if (!serviceAvailable) {
  //     main.classList.remove("is-active");
  //     locked.classList.add("is-active");
  //   } else {
  //     main.classList.add("is-active");
  //     locked.classList.remove("is-active");
  //   }
  // }

  // checkServiceAvailable();

  // setInterval(checkServiceAvailable, 20000);

  // step navigation
  const steps = document.querySelectorAll(".step");
  const nextButtons = document.querySelectorAll(".step .btn");
  let parentWidth = 0;
  let parentHeight = 0;

  const archetype = {
    image: document.querySelectorAll('[data-id="archetypeImage"]'),
    title: document.querySelector('[data-id="archetypeTitle"]'),
    titleImg: document.querySelector('[data-id="archetypeTitleImg"]'),
    text: document.querySelector('[data-id="archetypeText"]'),
  };

  function updateConfirmButtonVisibility() {
    const selected = container.querySelectorAll(".circle.highlight");
    if (selected.length > 0) {
      confirmButton.classList.add("is-active");
    } else {
      confirmButton.classList.remove("is-active");
    }
  }

  nextButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const currentStep = document.querySelector(".step.is-active");
      currentStep.classList.remove("is-active");

      const isRestart = btn.classList.contains("btn--restart");

      let nextIndex;
      if (isRestart) {
        nextIndex = 0;

        steps.forEach((step) => step.classList.remove("is-active"));
        steps[nextIndex].classList.add("is-active");

        // circleButtons.forEach((b) => b.classList.remove("is-active"));
        // localStorage.removeItem("activeCircleButtons");
        return;
      } else {
        const currentIndex = Array.from(steps).indexOf(currentStep);
        nextIndex = currentIndex + 1;
      }

      if (steps[nextIndex]) {
        steps[nextIndex].classList.add("is-active");

        // автопереход с step--3
        if (steps[nextIndex].classList.contains("step--3")) {
          setTimeout(() => {
            steps[nextIndex].classList.remove("is-active");
            if (steps[nextIndex + 1]) {
              steps[nextIndex + 1].classList.add("is-active");
            }
          }, 5000);
        }

        // Если это шаг с контейнером, запускаем круги
        if (steps[nextIndex].classList.contains("step--2")) {
          setTimeout(() => {
            createCirclesAndAnimate();
          }, 50); // небольшой таймаут для корректной отрисовки
        }
      }
    });
  });

  function getYandexArchetype() {
    //8. Гуру/более 8 сервисов
    if (selectedService.length > 8) {
      return {
        image: 8,
        title: "Гуру",
        text: "Знаток возможностей Яндекс Go.",
      };
    }

    //1. Первооткрыватель/Такси+1 сервис
    if (selectedService.includes("taxi") && selectedService.length == 2) {
      return {
        image: 1,
        title: "Первооткрыватель",
        text: "Похоже, вы только в начале пути — откройте для себя все возможности Яндекс Go.",
      };
    }

    //2. Хранитель очага/Продукты+Магазины+Доставка
    if (selectedService.includes("dostavka") && selectedService.includes("")) {
      return {
        image: 2,
        title: "Хранитель очага",
        text: "Ценитель расслабленного домашнего вайба.",
      };
    }

    //3. Городской Странник/Драйв+Мое авто
    if (selectedService.includes("drive") && selectedService.includes("auto")) {
      return {
        image: 3,
        title: "Городской Странник",
        text: "Вдохновляетесь свободой, которую дарят четыре колеса.",
      };
    }

    //4. Архитектор стиля/Маркет
    if (selectedService.includes("market")) {
      return {
        image: 4,
        title: "Архитектор стиля",
        text: "В вашей корзине только лучшие предложения.",
      };
    }
    //5. Дирижер улиц/Самокат+Транспорт
    if (
      selectedService.includes("transport") &&
      selectedService.includes("samokaty")
    ) {
      return {
        image: 5,
        title: "Дирижер улиц",
        text: "Не тратите драгоценное время на пробки.",
      };
    }
    //6. Созерцатель пути/Межгород+Драйв
    if (
      selectedService.includes("drive") &&
      selectedService.includes("transport")
    ) {
      return {
        image: 6,
        title: "Созерцатель пути",
        text: "Открытый к новому исследователь пространств.",
      };
    }
    //7. Собиратель историй/Путешествия+Афиша
    if (
      selectedService.includes("afisha") &&
      selectedService.includes("travel")
    ) {
      return {
        image: 7,
        title: "Собиратель историй",
        text: "Новые места, новые звуки, новые встречи — все становится частью вашей летописи жизни.",
      };
    }
  }

  const confirmButton = document.querySelector('[data-id="confirm"]');
  const codeInput = document.querySelector(".code");
  confirmButton.addEventListener("click", async () => {
    const data = await fetchNewCode();

    const { code } = data;
    codeInput.innerHTML = code;

    const { image, title, text } = getYandexArchetype();

    console.log(image, title, text);

    archetype.image.forEach((el) => (el.src = `img/class/${image}.svg`));
    archetype.titleImg.src = `img/class/${image}-text.png`;
    archetype.title.innerHTML = title;
    archetype.text.innerHTML = text;

    selectedService.length = 0;
  });

  const fetchNewCode = () =>
    fetch("/code/create")
      .then((response) => response.json())
      .catch((err) => alert("Что-то пошло не так"));

  const selectedService = [];
  // предложенный код
  class Circle {
    constructor(x, y, radius, iconPath, name) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed = 1.5; // Единая скорость для всех движений
      this.vx = (Math.random() - 0.5) * this.speed;
      this.vy = (Math.random() - 0.5) * this.speed;
      this.maxSpeed = this.speed; // Максимальная скорость
      this.color = "#FFEA00"; // red, blue, white
      this.iconPath = iconPath;
      this.element = this.createElement();
      this.stopped = false;
      this.magnetizing = false;
      this.magnetTarget = null;
      this.magnetStartTime = null;
      this.magnetDuration = 300; // Длительность магнитного движения в миллисекундах
      this.startX = null;
      this.startY = null;
      this.name = name;
    }

    createElement() {
      const circle = document.createElement("div");
      circle.className = "circle";
      circle.style.width = this.radius * 2 + "px";
      circle.style.height = this.radius * 2 + "px";
      circle.style.left = this.x - this.radius + "px";
      circle.style.top = this.y - this.radius + "px";

      // Вставляем иконку
      const img = document.createElement("img");
      img.src = this.iconPath;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.borderRadius = "50%";
      img.style.pointerEvents = "none"; // чтобы клик шел по div
      circle.appendChild(img);

      circle.addEventListener("click", () => {
        if (this.stopped || this.magnetizing) {
          this.releaseFromMainCircle();
          selectedService.splice(selectedService.indexOf(this.name), 1);
          // Не меняем цвет — он и так станет красным
        } else {
          this.magnetToMainCircle();
          circle.classList.add("highlight");
          selectedService.push(this.name);

          // this.changeColor();
          updateConfirmButtonVisibility();
        }
        console.log(selectedService);
      });

      return circle;
    }

    changeColor() {
      // this.element.classList.remove('blue', 'white');
      // if (this.color === 'red') {
      //   this.color = 'blue';
      //   this.element.classList.add('blue');
      // } else if (this.color === 'blue') {
      //   this.color = 'white';
      //   this.element.classList.add('white');
      // } else {
      //   this.color = 'red';
      //   this.element.classList.add('red');
      //   // Красный цвет - базовый, классы не нужны
      // }
    }

    magnetToMainCircle() {
      if (this.stopped || this.magnetizing) return;

      // 1. Ограничение на 5 кружков на орбите
      const stoppedCircles = circles.filter((c) => c.stopped && c !== this);
      if (stoppedCircles.length >= 5) {
        // "Освобождаем" самый первый магнитный кружок
        stoppedCircles[0].releaseFromMainCircle();
      }

      const centerX = parentWidth / 2;
      const centerY = parentHeight / 2;
      const bigRadius = 90;
      const minAngleDist = 2 * Math.asin(this.radius / bigRadius) + 0.05; // минимальный угол между кружками (с запасом)

      // 2. Собираем углы уже магнитных кружков
      const takenAngles = [];
      for (const c of circles) {
        if (c !== this && c.stopped) {
          const dx = c.x - centerX;
          const dy = c.y - centerY;
          takenAngles.push(Math.atan2(dy, dx));
        }
      }

      // 3. Ищем ближайший свободный угол к текущему
      let baseAngle = Math.atan2(this.y - centerY, this.x - centerX);
      let found = false;
      let angle = baseAngle;
      let step = 0;
      while (!found && step < 360) {
        found = true;
        for (const a of takenAngles) {
          let diff = Math.abs(angle - a);
          diff = Math.min(diff, 2 * Math.PI - diff); // учёт перехода через 0
          if (diff < minAngleDist) {
            found = false;
            break;
          }
        }
        if (!found) {
          // Пробуем следующий угол (по часовой стрелке и против)
          step++;
          angle = baseAngle + (step % 2 === 0 ? 1 : -1) * (step * 0.05); // 0.05 радиан ~2.8°
        }
      }

      // 4. Вычисляем целевую точку
      const targetX = centerX + Math.cos(angle) * bigRadius;
      const targetY = centerY + Math.sin(angle) * bigRadius;

      this.magnetizing = true;
      this.magnetTarget = { x: targetX, y: targetY };
      this.magnetStartTime = performance.now();
      this.startX = this.x;
      this.startY = this.y;
    }

    update() {
      if (this.magnetizing) {
        const now = performance.now();
        const elapsed = now - this.magnetStartTime;
        const t = Math.min(elapsed / this.magnetDuration, 1);

        // Линейная интерполяция
        this.x = this.startX + (this.magnetTarget.x - this.startX) * t;
        this.y = this.startY + (this.magnetTarget.y - this.startY) * t;

        // Обновляем позицию DOM-элемента
        this.element.style.left = this.x - this.radius + "px";
        this.element.style.top = this.y - this.radius + "px";

        if (t >= 1) {
          this.x = this.magnetTarget.x;
          this.y = this.magnetTarget.y;
          this.vx = 0;
          this.vy = 0;
          this.stopped = true;
          this.magnetizing = false;
        }
        return;
      }
      if (this.stopped) {
        this.element.style.left = this.x - this.radius + "px";
        this.element.style.top = this.y - this.radius + "px";
        return;
      }
      // Обновление позиции
      this.x += this.vx;
      this.y += this.vy;

      // Store the parent dimensions
      const parentWidth = this.element.parentNode.clientWidth;
      const parentHeight = this.element.parentNode.clientHeight;

      // Ограничение максимальной скорости
      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > this.maxSpeed) {
        this.vx = (this.vx / currentSpeed) * this.maxSpeed;
        this.vy = (this.vy / currentSpeed) * this.maxSpeed;
      }

      // Отскок от границ экрана
      if (this.x <= this.radius || this.x >= parentWidth - this.radius) {
        this.vx = -this.vx;
        this.x = Math.max(
          this.radius,
          Math.min(parentWidth - this.radius, this.x)
        );
      }
      if (this.y <= this.radius || this.y >= parentHeight - this.radius) {
        this.vy = -this.vy;
        this.y = Math.max(
          this.radius,
          Math.min(parentHeight - this.radius, this.y)
        );
      }

      // Обновление позиции элемента
      this.element.style.left = this.x - this.radius + "px";
      this.element.style.top = this.y - this.radius + "px";
    }

    checkCollision(other) {
      // Если оба статичны — ничего не делаем
      if (this.stopped && other.stopped) return;

      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = this.radius + other.radius + 2;

      if (distance < minDist) {
        const overlap = 0.5 * (minDist - distance);
        const nx = dx / distance;
        const ny = dy / distance;

        // Если один статичен, другой динамичен
        if (this.stopped && !other.stopped) {
          // Только other двигается и меняет скорость
          other.x += overlap * 2 * nx;
          other.y += overlap * 2 * ny;

          // Отражаем скорость other
          const dvx = other.vx;
          const dvy = other.vy;
          const dot = dvx * nx + dvy * ny;
          if (dot < 0) {
            other.vx -= 2 * dot * nx;
            other.vy -= 2 * dot * ny;
          }
        } else if (!this.stopped && other.stopped) {
          // Только this двигается и меняет скорость
          this.x -= overlap * 2 * nx;
          this.y -= overlap * 2 * ny;

          // Отражаем скорость this
          const dvx = this.vx;
          const dvy = this.vy;
          const dot = dvx * nx + dvy * ny;
          if (dot < 0) {
            this.vx -= 2 * dot * nx;
            this.vy -= 2 * dot * ny;
          }
        } else {
          // Оба динамические — обычная коллизия
          this.x -= overlap * nx;
          this.y -= overlap * ny;
          other.x += overlap * nx;
          other.y += overlap * ny;

          const dvx = this.vx - other.vx;
          const dvy = this.vy - other.vy;
          const dot = dvx * nx + dvy * ny;
          if (dot < 0) {
            this.vx -= dot * nx;
            this.vy -= dot * ny;
            other.vx += dot * nx;
            other.vy += dot * ny;
          }
        }
      }
    }

    releaseFromMainCircle() {
      this.stopped = false;
      this.magnetizing = false;
      this.color = "red";
      this.element.classList.remove("highlight");
      // Задаём случайную скорость
      const angle = Math.random() * 2 * Math.PI;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }
  }

  // --- КОНЕЦ КЛАССА ---

  const circles = [];
  const container = document.getElementById("container");
  const numCircles = 13;
  const yandexService = [
    {
      name: "auto",
      icon: "img/yandex/1.svg",
    },
    {
      name: "eats",
      icon: "img/yandex/2.png",
    },
    {
      name: "travel",
      icon: "img/yandex/3.svg",
    },
    {
      name: "lavka",
      icon: "img/yandex/4.svg",
    },
    {
      name: "afisha",
      icon: "img/yandex/5.svg",
    },
    {
      name: "delivery",
      icon: "img/yandex/6.svg",
    },
    {
      name: "taxi",
      icon: "img/yandex/7.svg",
    },
    {
      name: "market",
      icon: "img/yandex/8.svg",
    },
    {
      name: "dostavka",
      icon: "img/yandex/clip-path-group.svg",
    },
    {
      name: "drive",
      icon: "img/yandex/drive.svg",
    },
    {
      name: "samokaty",
      icon: "img/yandex/samokaty.svg",
    },
    {
      name: "transport",
      icon: "img/yandex/transport.svg",
    },
    {
      name: "zaryad",
      icon: "img/yandex/zaryad.svg",
    },
  ];
  // const iconPaths = [
  //   "img/yandex/1.svg",
  //   "img/yandex/2.png",
  //   "img/yandex/3.svg",
  //   "img/yandex/4.svg",
  //   "img/yandex/5.svg",
  //   "img/yandex/6.svg",
  //   "img/yandex/7.svg",
  //   "img/yandex/8.svg",
  //   "img/yandex/clip-path-group.svg",
  //   "img/yandex/drive.svg",
  //   "img/yandex/samokaty.svg",
  //   "img/yandex/transport.svg",
  //   "img/yandex/zaryad.svg",
  // ];

  // --- ФУНКЦИЯ СОЗДАНИЯ КРУГОВ И ЗАПУСКА АНИМАЦИИ ---
  function createCirclesAndAnimate() {
    // Очищаем контейнер и массив кругов (если нужно)
    circles.length = 0;
    container.innerHTML = "";

    // Получаем размеры контейнера
    parentWidth = container.clientWidth;
    parentHeight = container.clientHeight;

    // Если контейнер всё ещё скрыт — пробуем позже
    if (parentWidth < 50 || parentHeight < 50) {
      setTimeout(createCirclesAndAnimate, 100);
      return;
    }

    for (let i = 0; i < numCircles; i++) {
      const radius = 40;
      let x, y;
      let tries = 0;
      let overlaps;

      do {
        x = Math.random() * (parentWidth - radius * 2) + radius;
        y = Math.random() * (parentHeight - radius * 2) + radius;
        overlaps = false;
        for (let j = 0; j < circles.length; j++) {
          const other = circles[j];
          const dx = x - other.x;
          const dy = y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < radius * 2 + 30) {
            overlaps = true;
            break;
          }
        }
        tries++;
      } while (overlaps && tries < 100);

      const service = yandexService[i % yandexService.length];
      const circle = new Circle(x, y, radius, service.icon, service.name);
      circles.push(circle);
      container.appendChild(circle.element);
    }

    // Запуск анимации
    animate();
  }

  // --- АНИМАЦИОННЫЙ ЦИКЛ ---
  function animate() {
    // Проверка столкновений между всеми парами кружков
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        circles[i].checkCollision(circles[j]);
      }
    }

    // Обновление позиций всех кружочков
    circles.forEach((circle) => {
      circle.update();
      if (!circle.stopped && !circle.magnetizing) {
        checkCentralCircleCollision(circle);
      }
    });

    requestAnimationFrame(animate);
  }

  // --- ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА ---
  window.addEventListener("resize", () => {
    parentWidth = container.clientWidth;
    parentHeight = container.clientHeight;
    circles.forEach((circle) => {
      if (circle.x > parentWidth - circle.radius) {
        circle.x = parentWidth - circle.radius;
      }
      if (circle.y > parentHeight - circle.radius) {
        circle.y = parentHeight - circle.radius;
      }
    });
  });

  // --- ФУНКЦИЯ ДЛЯ СЛУЧАЙНОГО ТОЛЧКА ---
  function randomPush() {
    circles.forEach((circle) => {
      if (!circle.stopped && !circle.magnetizing) {
        // Случайный угол и сила толчка
        const angle = Math.random() * 1.2 * Math.PI;
        const force = 1 + Math.random() * 1.2; // сила толчка (можно подправить)
        circle.vx += Math.cos(angle) * force;
        circle.vy += Math.sin(angle) * force;
      }
    });
  }

  // Запуск толчка раз в 5 секунд
  setInterval(randomPush, 5000);

  // --- ПРОВЕРКА СТОЛКНОВЕНИЯ С ЦЕНТРАЛЬНЫМ КРУГОМ ---
  function checkCentralCircleCollision(circle) {
    const centerX = parentWidth / 2;
    const centerY = parentHeight / 2;
    const bigRadius = 90;

    // Расстояние от центра до центра кружка
    const dx = circle.x - centerX;
    const dy = circle.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Если кружок залетел внутрь центрального круга
    if (distance < bigRadius + circle.radius) {
      // Выталкиваем кружок наружу
      const overlap = bigRadius + circle.radius - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      circle.x += nx * overlap;
      circle.y += ny * overlap;

      // Отражаем скорость (от центра)
      const dot = circle.vx * nx + circle.vy * ny;
      if (dot < 0) {
        circle.vx -= 1.5 * dot * nx;
        circle.vy -= 1.5 * dot * ny;
      }
    }
  }

  // --- ЕСЛИ КОНТЕЙНЕР ВИДИМ СРАЗУ, МОЖНО ЗАПУСТИТЬ ---
  if (container.clientWidth > 50 && container.clientHeight > 50) {
    const centerX = parentWidth / 2;
    const centerY = parentHeight / 2;
    createCirclesAndAnimate();
  }
});
