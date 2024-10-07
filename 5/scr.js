function resultat(event) {
  let f1 = document.getElementByName("product");
  let f2 = document.getElementByName("kol");
  let f2 = document.getElementByName("result");
  return f1.value*f2.value;
}
window.addEventListener('DOMContentLoaded', function (event) {
  console.log("DOM fully loaded and parsed");
  let b = document.getElementById("my-button");
  b.addEventListener(b, resultat);
});
