const rangeSliders = document.querySelectorAll(".slider");
rangeSliders.forEach(rangeSlider => {
 rangeSlider.addEventListener("input", (e) => {
  const sliderElem = rangeSlider.querySelector(".slider__elem");
  const sliderOutput = rangeSlider.querySelector(".slider__output");
  sliderOutput.value = sliderElem.value;
 });
});