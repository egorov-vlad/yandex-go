document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    const { blackScreen } = await fetch("/black-screen", {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (blackScreen) {
      return;
    } else {
      const redirectPage = new URL(window.document.location).searchParams.get(
        "redirect"
      );
      window.location.replace(`http://localhost:3000/${redirectPage}`);
    }
  }, 20000);
});
