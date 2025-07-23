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
      const urlData = new URL(window.document.location);
      const host = urlData.host;
      const redirectPage = urlData.searchParams.get("redirect");
      window.location.replace(`http://${host}/${redirectPage}`);
    }
  }, 20000);
});
