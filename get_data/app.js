const queryString = window.location.href;
const parameters = new URLSearchParams(queryString.split("?")[1]);
const value = parameters.get("context");
let incidentId = value.split(":")[2];
console.log(incidentId);
let incidentResponse, entityResponse;

Promise.all([
  fetch("./data/incident.json").then((res) => (incidentResponse = res)),
  fetch("./data/entity.json").then((res) => (entityResponse = res)),
]).then(console.log(entityResponse));
