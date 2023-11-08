window.onload = () => {
  function alignLinesWithHeaders() {
    let lineElements = document.querySelectorAll(".line");

    lineElements.forEach((lineElement) => {
      let sectionElement = lineElement.closest(".section-flex");
      let titleElement = sectionElement.querySelector(".title-bold");
      const titlePosTop = titleElement.getBoundingClientRect().top;
      const sectionPosTop = sectionElement.getBoundingClientRect().top;
      let linePosTop = Math.abs(titlePosTop - sectionPosTop);
      lineElement.style.top = `${linePosTop + 22}px`;
    });
  }

  alignLinesWithHeaders();

  window.onresize = () => {
    alignLinesWithHeaders();
  };
};
