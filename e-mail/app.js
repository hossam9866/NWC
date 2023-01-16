const urlParams = new URLSearchParams(window.location.search);

console.log(urlParams.get("header3.5"));

let elementIdsList = [
  "date",
  "Title",
  "cluster",
  "city-business-unit",
  "header1",
  "header2",
  "topic1.1",
  "topic2.1",
  "content2.1",
  "topic2.2",
  "content2.2",
  "header3",
];

elementIdsList.forEach((id) => {
  let value = urlParams.get(id);
  if (value == null) {
  } else {
    try {
      document.getElementById(id).innerText = value;
    } catch (_) {}
  }
});

let confirmationURL = urlParams.get("confirm");
if (confirmationURL == null) {
  document.querySelector("#confirm").style.display = "none";
} else {
  document.querySelector("#confirm").setAttribute("href", confirmationURL);
}

let fileContent = document.querySelector("html").outerHTML;
//file for add contact

function download(filename, text) {
  var element = document.createElement("a");
  /*
        element.setAttribute(
          "href",
          "data:text/vCard;charset=utf-8," + encodeURIComponent(text)
        );
        */
  element.href = window.URL.createObjectURL(
    new Blob([text], { type: "text/html" })
  );
  //"data:vCard;charset=utf-8," + encodeURIComponent(text)
  element.setAttribute("download", filename);
  element.setAttribute("target", "_blank");

  element.style.display = "none";
  document.body.appendChild(element);
  console.log(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById("download").onclick = () => {
  var text = fileContent;
  var filename = `Details.html`;

  download(filename, text);
};

document.getElementById("download").click();

document.querySelector("html").innerHTML = "";
