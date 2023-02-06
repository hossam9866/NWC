function getIncidentId() {
  const queryString = parent.location.hash;
  const parameters = new URLSearchParams(queryString.split("?")[1]);
  const value = parameters.get("context");
  let incidentId = value.split(":")[2];
  return incidentId;
}

function apiGet(api) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", api);
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
}
function showDate(date) {
  try {
    if (date.getFullYear() <= "1980") {
      return "Not Declared";
    }
  } catch (_) {
    return "Not Declared";
  }
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

function showError(error) {
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".error").innerHTML = error;
  document.querySelector(".error").style.display = "block";
  document.querySelector(".container").style.display = "none";
}

function getSubmissionAlert() {
  //let incidentId = getIncidentId();
  //'https://app.cdc-hq-nwc.live/api/customData/entity/5/triggers/reports/executions/?query=`instanceId`+=+"incidentId"'
  let api = "api/alerts.json";
  //api = api.replace("incidentId", incidentId);
  apiGet(api)
    .then((alerts) => {
      if (alerts["executions"].length == 0) {
        showError("No alerts sent yet");
      } else {
        for (let i = 0; i < alerts["executions"].length; i++) {
          if (alerts["executions"][i]["context"] == "formSubmission") {
            let alertId = alerts["executions"][i]["id"];
            let triggerId = alerts["executions"][i]["triggerId"];
            getAlertId(triggerId, alertId);
            break;
          }
        }
      }
    })
    .catch((_) => {
      showError("No alerts sent yet");
    });
}

function getAlertId(triggerId, alertId) {
  //https://app.cdc-hq-nwc.live/api/customData/entity/5/triggers/${triggerId}/executions/${alertId}

  apiGet(`api/execution.json`)
    .then((data) => {
      if (data["execution"]["executedActions"].length == 0) {
        showError("No alerts sent yet");
      } else {
        for (let i = 0; i < data["execution"]["executedActions"].length; i++) {
          if (
            data["execution"]["executedActions"][i]["executionId"] == alertId
          ) {
            getContacts(data["execution"]["executedActions"][i]["targetId"]);
            break;
          }
        }
      }
    })
    .catch(() => {
      showError("No alerts sent yet");
    });
}

function getContacts(targetId) {
  //`https://app.cdc-hq-nwc.live/?q=api/call&request=alerts/${targetId}/reporting/contacts&offset=0&limit=25&query=&sortField=queued_time&sortOrder=desc`

  apiGet(`api/sent-to.json`)
    .then((data) => {
      setTableElements(data["contacts"]);
      getConfirmedContacts(targetId);
    })
    .catch(() => {
      showError("No alerts sent yet");
    });
}

function getConfirmedContacts(targetId) {
  //https://app.cdc-hq-nwc.live/?q=api/call&request=alerts/${targetId}/reporting/confirmed&offset=0&limit=25&query=&sortField=timestamp&sortOrder=desc

  apiGet(`api/confirm.json`)
    .then((data) => {
      setConfirmedContats(data["contacts"]);
    })
    .catch(() => {});
}

function setTableElements(contacts) {
  let holderElement = document.querySelector(".members tbody");
  refresh(true);
  holderElement.innerHTML = ``;
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".members thead").style.display = "table-header-group";
  contacts.forEach((contact) => {
    let element = document.createElement("tr");
    element.setAttribute("id", `contact-` + contact["id"]);
    element.classList.add("members-row");
    element.innerHTML = `
    <tr class="members-row">
        <td class="name">${contact["name"]}</td>
        <td>${showDate(new Date(contact["queued_time"]))}</td>
        <td>
            <table class="methods">
                <tr>
                  <td class="mail">
                    <div>${alertMark(contact["sent_email"])}</div> E-mail
                  </td>
                  <td class="sms">
                    <div>${alertMark(contact["sent_sms"])}</div> SMS
                  </td>
                  <td class="voice">
                    <div>${alertMark(contact["sent_voice"])}</div> Voice
                  </td>
                </tr>
            </table>
        </td>
        <td class="confirm-time">Not Confirmed Yet</td>
    </tr>`;
    holderElement.appendChild(element);
  });
}

function setConfirmedContats(contacts) {
  contacts.forEach((contact) => {
    let selectedElement = document.getElementById(`contact-` + contact["id"]);
    selectedElement.querySelector(".confirm-time").innerText = showDate(
      new Date(contact["timestamp"])
    );
    if (contact["method"] == "email") {
      selectedElement.querySelector(".mail div").innerHTML = ``;
      selectedElement.querySelector(".mail div").innerHTML = alertMark(2);
    } else if (contact["method"] == "sms") {
      selectedElement.querySelector(".sms div").innerHTML = ``;
      selectedElement.querySelector(".sms div").innerHTML = alertMark(2);
    } else if (contact["method"] == "voice") {
      selectedElement.querySelector(".voice div").innerHTML = ``;
      selectedElement.querySelector(".voice div").innerHTML = alertMark(2);
    }
  });
  refresh(false);
}
function refresh(visible) {
  let refreshElement = document.querySelector(".refresh");
  if (visible) {
    refreshElement.style.display = "flex";
  } else {
    refreshElement.style.display = "none";
  }
}

function alertMark(status) {
  //status 0->not sent , 1-> sent, 2=> Confirmed
  if (status == 2) {
    return `<span class="status confirmed">&#x2714;&#x2714;</span>`;
  } else if (status == 1) {
    return `<span class="status received">&#x2714;</span>`;
  } else {
    return `<span class="status not-sent">&#x2716;</span>`;
  }
}

getSubmissionAlert();

/*
metronome.bindUpdate(() => {
  getSubmissionAlert();
  metronome.completeUpdate();
});
*/
