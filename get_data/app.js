function showDate(date) {
  return date.toISOString().slice(0, 16).replace("T", " ");
}
function getRemainingTime(startDate, endDate) {
  let ms = endDate - startDate;
  if (ms > 0) {
    let day = parseInt(ms / (1000 * 60 * 60 * 24));
    let hours = ms / (1000 * 60 * 60 * 24) - day;
    hours *= 24;
    hours = parseInt(hours);

    return `${day}D ${hours}H`;
  } else {
    return `Time Is Over`;
  }
}

metronome.bindUpdate(() => {
  //please add code to get incidentId
  //I used window.location.href but it gives me error (location undefined)
  //when i used document.URL gives me un-completed url
  /**
   * const queryString = window.location.hash;
    const parameters = new URLSearchParams(queryString.split("?")[1]);
    const value = parameters.get("context");
    let incidentId = value.split(":")[2];
   */
  const queryString = window.location.hash;
  const parameters = new URLSearchParams(queryString.split("?")[1]);
  const value = parameters.get("context");
  let incidentId = value.split(":")[2];
  let incident, entity;
  let getIncidentData = new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(
      "GET",
      `https://app.cdc-hq-nwc.live/?q=api/call&request=customData/entity/5/instance/${incidentId}`
    );
    request.send();
    request.onload = function () {
      if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        resolve(data);
      } else {
        reject();
      }
    };
  });
  let getEntitytData = new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://app.cdc-hq-nwc.live/?q=api/call&request=customData/entity/5"
    );
    request.send();
    request.onload = function () {
      if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        resolve(data);
      } else {
        reject();
      }
    };
  });

  Promise.all([getIncidentData, getEntitytData])
    .then((datas) => {
      //get data frm api
      incident = datas[0]["instance"];
      entity = datas[1]["entity"];
      //declare variable to store
      let incidentData = {};
      incidentData["DateCreated"] = new Date(incident["dateCreated"]);
      incidentData["DateModified"] = new Date(incident["dateModified"]);

      for ([key, val] of Object.entries(incident["values"])) {
        let field = entity["fields"][key];
        let name = field["name"];
        if (
          field["dataType"] == "text" ||
          field["dataType"] == "string" ||
          field["dataType"] == "bool"
        ) {
          incidentData[name] = val;
        } else if (field["dataType"] == "date") {
          incidentData[name] = new Date(val);
        } else if (field["dataType"] == "enum") {
          incidentData[name] = entity["enums"][field["enumId"]][val];
        } else if (field["dataType"] == "enumMultiValue") {
          let valuesArray = new Array(val.length);
          for (let i = 0; i < valuesArray.length; i++) {
            valuesArray[i] = entity["enums"][field["enumId"]][val[i]];
          }
          incidentData[name] = valuesArray;
        }
      }
      setElementsData(incidentData);
    })
    .catch((err) => {
      let errorElement = document.querySelector(".error-message");
      errorElement.style.display = "block";
      errorElement.innerText = "there is a problem getting data";
    });

  function setElementsData(data) {
    document.getElementById("cluster").innerText = data["Cluster"];
    document.getElementById("city-business-unit").innerText =
      data["City Business Unit"];
    document.getElementById("incident-name").innerText = data["Title"];
    document.getElementById("for").innerText = data["Incident For"];
    document.getElementById("state").innerText = data["Incident State"];
    document.getElementById("level").innerText = data["Level"];
    document.getElementById("water-type").innerText =
      data["Water Type"].length != 0
        ? data["Water Type"].join("-")
        : data["Wastewater Type"].join("-");
    document.getElementById("service-type-water").innerText =
      data["Service Type"] + " Type";
    document.getElementById("service-type").innerText = data["Service Type"];
    document.getElementById("areas-impacted").innerText =
      data["Areas Impacted"];
    document.getElementById("start-date").innerHTML = `${
      showDate(data["Incident Start Date"]).split(" ")[0]
    }<span> ${showDate(data["Incident Start Date"]).split(" ")[1]}</span>
  `;
    document.getElementById("expected-end").innerHTML = `${showDate(
      data["Expected End Date"]
    )} <span>${getRemainingTime(Date.now(), data["Expected End Date"])}</span>`;
    document.getElementById("last-updated").innerHTML = showDate(
      data["last updated"]
    );
    document.getElementById("status").innerText = data["Status"];
    document.getElementById("require-media").innerText = data[
      "Requires media release"
    ]
      ? "Yes"
      : "No";
    document.getElementById("require-support").innerText = data[
      "Support from CDC required"
    ]
      ? "Yes"
      : "No";
    document.getElementById("note-modified-date").innerText = showDate(
      data["DateModified"]
    );
    document.getElementById("description").innerText = data["Description"];
    document.getElementById("actions-taken").innerText = data["Actions Taken"];
    document.getElementById("vip-customer").innerText =
      data["VIP Customer(s) Impacted"];
  }

  metronome.completeUpdate();
});
