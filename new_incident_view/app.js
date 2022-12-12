function showDate(date) {
  if (date.getFullYear() <= "1980") {
    return "Not Declared";
  }
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

function getRemainingTime(startDate, endDate) {
  if (endDate.getFullYear() <= "1980") {
    return "";
  }
  let ms = endDate - startDate;
  let day = parseInt(ms / (1000 * 60 * 60 * 24));
  let hours = ms / (1000 * 60 * 60 * 24) - day;
  hours *= 24;
  let minutes = hours;

  hours = parseInt(hours);
  minutes -= hours;
  minutes *= 60;
  minutes = parseInt(minutes);
  if (day != 0) {
    return ms > 0
      ? ` ${day}D ${hours}H`
      : ` since ${day * -1}D ${hours * -1}H ago`;
  } else {
    if (hours != 0) {
      return ms > 0
        ? ` ${hours}H ${minutes}m`
        : ` since ${hours * -1}H ${minutes * -1}m ago`;
    } else {
      return ms > 0
        ? ` ${minutes != 0 ? minutes : 1}m`
        : ` since ${minutes != 0 ? minutes * -1 : 1}m ago`;
    }
  }
}

function setInstalledElements(data) {
  let elementsIDs = ["Title", "Description", "Date Modified"];
  elementsIDs.forEach((e) => {
    dataShow(data[e], document.getElementById(e.replaceAll(" ", "-")));
    delete data[e];
  });
  return data;
}
function setTopElements(data) {
  let elementsIDs = [
    "Incident Type",
    "Cluster",
    "City Business Unit",
    "Service Type",
    "Service Subtype",
  ];
  let incidentStartDetailsElement = document.getElementById("start-details");
  incidentStartDetailsElement.innerHTML = "";
  elementsIDs.forEach((e) => {
    if (data[e] != undefined && data[e] != "") {
      let elem = document.createElement("div");
      elem.setAttribute("id", e.replaceAll(" ", "-"));
      elem.setAttribute("class", "info-row");
      let nameElement = document.createElement("div");
      nameElement.setAttribute("class", "info-name");
      nameElement.innerText = e;
      let valueElement = document.createElement("div");
      valueElement.setAttribute("class", "info-value");

      dataShow(data[e], valueElement);
      elem.appendChild(nameElement);
      elem.appendChild(valueElement);
      incidentStartDetailsElement.appendChild(elem);
      delete data[e];
    }
  });
  return data;
}

function setElementsData(data) {
  let incidentMidDetailsElement = document.getElementById("mid-details");
  let incidentEndDetailsElement = document.getElementById("end-details");
  let incidentDatesDetailsElement = document.getElementById("dates-details");

  //empty all fields
  incidentMidDetailsElement.innerHTML = "";
  incidentEndDetailsElement.innerHTML = "";
  incidentDatesDetailsElement.innerHTML = "";

  //any previous exist element you want to fill data on it
  data = setInstalledElements(data);
  //array of top important element the need to set on the top
  data = setTopElements(data);

  for ([key, val] of Object.entries(data)) {
    if (val != undefined && val.length != 0) {
      let elem = document.createElement("div");
      elem.setAttribute("id", key.replaceAll(" ", "-"));
      elem.setAttribute("class", "info-row");
      let nameElement = document.createElement("div");
      nameElement.setAttribute("class", "info-name");
      nameElement.innerText = key;
      let valueElement = document.createElement("div");
      valueElement.setAttribute("class", "info-value");

      dataShow(val, valueElement);
      elem.appendChild(nameElement);
      elem.appendChild(valueElement);
      //make dates in yhe last of details
      val instanceof Date
        ? incidentDatesDetailsElement.appendChild(elem)
        : typeof val == "boolean"
        ? incidentEndDetailsElement.appendChild(elem)
        : incidentMidDetailsElement.appendChild(elem);
    }
  }
}

function dataShow(data, valueElement) {
  valueElement.innerHTML = "";
  if (data instanceof Date) {
    let dateElement = document.createElement("p");
    dateElement.innerText = showDate(data);
    let remainingElement = document.createElement("span");
    remainingElement.innerText = getRemainingTime(Date.now(), data);
    valueElement.appendChild(dateElement);
    valueElement.appendChild(remainingElement);
  } else if (typeof data == "boolean") {
    valueElement.innerText = data ? "Yes" : "No";
  } else if (Array.isArray(data)) {
    valueElement.innerText = data.join(" , ");
  } else {
    valueElement.innerText = data;
  }
}

function getIncident() {
  //Widget is an iframe, so we need the location of the parent.

  /* const queryString = parent.location.hash;
  const parameters = new URLSearchParams(queryString.split("?")[1]);
  const value = parameters.get("context");
  let incidentId = value.split(":")[2]; */

  let incident, entity;

  let getIncidentData = new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.open(
      "GET",
      `https://hossam9866.github.io/NWC/new_incident_view/data/y.json` //https://app.cdc-hq-nwc.live/?q=api/call&request=customData/entity/5/instance/${incidentId}
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
      "https://hossam9866.github.io/NWC/new_incident_view/data/x.json" //https://app.cdc-hq-nwc.live/?q=api/call&request=customData/entity/5
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
      incidentData["Date Created"] = new Date(incident["dateCreated"]);
      incidentData["Date Modified"] = new Date(incident["dateModified"]);

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
      document.querySelector(".loading").style.display = "none";
      document.querySelector(".loading .loader").style.display = "none";
    })
    .catch((err) => {
      document.querySelector(".loading .loader").style.display = "none";
      let errorElement = document.querySelector(".error-message");
      errorElement.style.display = "block";
      errorElement.innerText = "There is a problem getting data";
    });
}
//Initial load of widget
getIncident();
//Metronome updates
metronome.bindUpdate(() => {
  getIncident();
  metronome.completeUpdate();
});
