export function showElement(element) {
  element.style.zIndex = 1;
  element.style.visibility = "visible";
}

export function hideElement(element) {
  element.style.zIndex = -1;
  element.style.visibility = "hidden";
}
