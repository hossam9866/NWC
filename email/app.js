window.onload = () => {
  let levelNumber = document.getElementById("incident-level").innerText;
  let levelElement = document.querySelector(".level");
  levelNumber = parseInt(levelNumber);
  if (levelNumber > 0 && levelNumber < 6) {
    levelElement.classList.add(`level-${levelNumber}`);
  }
};
