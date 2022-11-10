function getIncidentNumber(api, fieldSelector) {
  let request = new XMLHttpRequest();

  request.open("GET", api);
  request.send();
  request.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      document.querySelector(fieldSelector).innerText = data["totalCount"];
    } else if (this.status === 204) {
      document.querySelector(fieldSelector).innerText = 0;
    } else {
      document.querySelector(fieldSelector).innerText = "not available";
    }
  };
  request.onerror = function () {
    document.querySelector(fieldSelector).innerText = "not available";
  };
}
getIncidentNumber("api/count.json", "p");
