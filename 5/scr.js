function resultat(event) {
  let f1 = document.getElementsByName("product");
  let f2 = document.getElementsByName("kol");
  let res = document.getElementsByName("result");
 res.innerHTML =f1[0].value*f2[0].value;
}
