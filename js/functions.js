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

  //view incidint
  let request = new XMLHttpRequest();
  request.open("GET", "https://hossam9866.github.io/NWC/api/incident.jsons");
  //request.setRequestHeader("Authorization", "Auth Example");

  request.send();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText);
      console.log(data);
    } else if (this.readyState === 4 && this.status === 404) {
      console.log("404");
    } else if (this.readyState === 4 && this.status === 403) {
      console.log("Forbidden");
    }
  };
};
