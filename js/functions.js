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
    }
  };
  request.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      setElementsData(data);
      setImpactedSites(data["impacted_region"]);
    } else if (this.status === 404) {
      document.querySelector(
        ".error-message"
      ).innerHTML = `404 Incident not found`;
    } else if (this.status === 403) {
      document.querySelector(
        ".error-message"
      ).innerHTML = `403 Not alloweed to view this incident`;
    }
  };

  function setElementsData(data) {
    document.getElementById("incident-name").innerText = data["title"];
    document.getElementById("for").innerText = data["for"];
    document.getElementById("state").innerText = data["state"];
    document.getElementById("level").innerText = data["level"];
    document.getElementById("asset-type").innerText = data["asset_type"];
    document.getElementById("service-type").innerText = data["service_type"];
    document.getElementById("control-room").innerText = data["control_room"];
    document.getElementById("summary").innerText = data["summary"];
    document.getElementById("expected-end").innerHTML = `${
      data["expected_end"]
    } <span>${"28D 5H"}</span>`;
    document.getElementById("last-updated").innerText = data["last_updated"];
    document.getElementById("status").innerText = data["status"];
    document.getElementById("require-media").innerText = data[
      "requires_media_reelease"
    ]
      ? "Yes"
      : "No";
    document.getElementById("require-support").innerText = data[
      "requires_main_support_center"
    ]
      ? "Yes"
      : "No";
    document.getElementById("note-modified-date").innerText =
      data["note_modified"];
    document.getElementById("note-value").innerText = data["note"];
  }
  function setImpactedSites(data) {
    let sitesElement = document.querySelector(".sites");
    for (let i = 0; i < data.length; i++) {
      let newElement = document.createElement("div");
      newElement.classList.add("site-row");
      let regionElement = document.createElement("div");
      regionElement.classList.add("region");
      regionElement.innerText = data[i]["region"];
      let nameElement = document.createElement("div");
      nameElement.classList.add("name");
      nameElement.innerText = data[i]["name"];
      newElement.appendChild(regionElement);
      newElement.appendChild(nameElement);
      sitesElement.appendChild(newElement);
    }
  }
};
