function getIncidentNumber(api, fieldSelector) {
  let request = new XMLHttpRequest();
  request.open("GET", api);
  request.send();
  request.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      document.querySelector(`#new-incident-number `).style.display = "none";
      document.querySelector(fieldSelector).innerText = data["filterCount"];
    } else if (this.status === 204) {
    } else {
    }
  };
  request.onerror = function () {
    document.querySelector(fieldSelector).innerText = "not available";
  };
}
getIncidentNumber("/d.json", "#new-incident-number");
getIncidentNumber("/d.json", "#in-progress-number");
getIncidentNumber("/d.json", "#solved-incident-number");
metronome.bindUpdate(() => {
  getIncidentNumber(
    "https://app.cdc-hq-nwc.live/?q=api/call&request=customData/reports/1/instances",
    "#new-incident-number"
  );
  getIncidentNumber(
    "https://app.cdc-hq-nwc.live/?q=api/call&request=customData/reports/3/instances",
    "#in-progress-number"
  );
  getIncidentNumber(
    "https://app.cdc-hq-nwc.live/?q=api/call&request=customData/reports/5/instances",
    "#solved-incident-number"
  );
  metronome.completeUpdate();
});
