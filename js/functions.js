window.onload = () => {
  let barButtons = document.querySelectorAll(".bar-button");
  try {
    barButtons.forEach((barButton) => {
      barButton.addEventListener("click", () => {
        barButtons.forEach((e) => {
          e.classList.remove("selected");
        });
        barButton.classList.add("selected");
      });
    });
  } catch (e) {}
};
