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

  request.open("GET", "https://hossam9866.github.io/NWC/api/incident.json");
  //request.setRequestHeader("Authorization", "Auth Example");
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText);
      document.getElementById("incident-name").innerText = data["title"];
      document.getElementById("for").innerText = data["for"];
      document.getElementById("state").innerText = data["state"];
      document.getElementById("level").innerText = data["level"];
      document.getElementById("asset-type").innerText = data["asset_type"];
      document.getElementById("service-type").innerText = data["service_type"];
      document.getElementById("control-room").innerText = data["control_room"];
      document.getElementById("summary").innerText = data["summary"];
      document.getElementById("expected-end").innerText = data["expected_end"];
      document.getElementById("last-updated").innerText = data["last_updated"];
      document.getElementById("status").innerText = data["status"];
    }
  };
  request.onload = function () {
    if (this.status === 404) {
      document.querySelector(
        ".error-message"
      ).innerHTML = `404 Incident not found`;
    } else if (this.status === 403) {
      document.querySelector(
        ".error-message"
      ).innerHTML = `403 Not alloweed to view this incident`;
    }
  };
};
