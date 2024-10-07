function resultat(event) {
  let f1 = document.getElementsByName("product");
  let f2 = document.getElementsByName("kol");
  let f2 = document.getElementsByName("result");
  return f1[0].value*f2[0].value;
}
window.addEventListener('DOMContentLoaded', function (event) {
  console.log("DOM fully loaded and parsed");
  let b = document.getElementById("my-button");
  b.addEventListener(b, resultat);
});
