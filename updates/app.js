fetch("d.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });


fetch(
  `https://app.cdc-hq-nwc.live/api/customData/reports/29/instances?offset=0&limit=25&sortField=&sortOrder=ASC&context={"type":"blueprint","entity":"5","instance":57}`
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));