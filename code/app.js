window.onload = () => {
  function alignLinesWithHeaders() {
    let lineElements = document.querySelectorAll(".line");

    lineElements.forEach((lineElement) => {
      let sectionElement = lineElement.closest(".section-flex");
      let titleElement = sectionElement.querySelector(".title-bold");
      const titlePosTop = titleElement.getBoundingClientRect().top;
      const sectionPosTop = sectionElement.getBoundingClientRect().top;
      let linePosTop = Math.abs(titlePosTop - sectionPosTop);
      var computedHeadStyle = window.getComputedStyle(titleElement);
      var headerFontSize = computedHeadStyle.getPropertyValue("font-size");
      headerFontSize = parseInt(headerFontSize);
      lineElement.style.top = `${linePosTop + headerFontSize / 2}px`;
    });
  }

  alignLinesWithHeaders();

  window.onresize = () => {
    alignLinesWithHeaders();
  };
};
