window.onload = () => {
  let idList;
  function getIdsNames() {
    idList = ["date", "cluster", "business-unit"];
    for (let i = 1; i < 9; i++) {
      idList.push(`header${i}`);
      idList.push(`content${i}`);
    }
  }
  getIdsNames();
  console.log(idList);

  let urlParams;
  function getUrlParams() {
    urlParams = new URLSearchParams(window.location.search);
  }
  getUrlParams();
  console.log(urlParams.get("level"));

  function fillTitle(urlParams) {
    let value = [
      "Immediate",
      "Emergency",
      "Urgent",
      "Semi Urgent",
      "Non Urgent",
    ];
    if (urlParams.has("level")) {
      let level = urlParams.get("level");
      document.getElementById("title").innerText =
        !isNaN(level) & (level <= 5) & (level >= 1)
          ? value[level - 1]
          : "Non-Urgent";
    }
  }

  function fillConfirmButton(urlParams) {
    if (urlParams.has("confirm")) {
      document
        .getElementById("confirm")
        .setAttribute("href", urlParams.get("confirm"));
    } else {
      document.getElementById("confirm").closest(".flag-to-remove").remove();
    }
  }

  function fillFields(urlParams, idList) {
    fillTitle(urlParams);
    fillConfirmButton(urlParams);
    idList.forEach((id) => {
      try {
        if (urlParams.has(id)) {
          document.getElementById(id).innerText = urlParams.get(id);
        } else {
          document.getElementById(id).closest(".flag-to-remove").remove();
        }
      } catch (_) {}
    });
  }
  fillFields(urlParams, idList);

  function download(filename, text) {
    var element = document.createElement("a");

    element.href = window.URL.createObjectURL(
      new Blob([text], { type: "text/html" })
    );
    element.setAttribute("download", filename);
    element.setAttribute("target", "_blank");

    element.style.display = "none";
    document.body.appendChild(element);
    console.log(element);

    element.click();

    document.body.removeChild(element);
  }

  function downloadFile() {
    var text = document.querySelector("html").outerHTML;
    var filename = `Details.html`;
    download(filename, text);
  }

  document.getElementById("download").onclick = () => {
    document.getElementById("download").style.display = "none";
    downloadFile();
    document.getElementById("download").style.display = "block";
  };

  if (urlParams.get("down") == "true") {
    document.getElementById("download").click();
    document.querySelector("html").innerHTML = "";
  } else {
  }
};
