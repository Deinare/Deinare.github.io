function click1() {
  let f1 = document.getElementsByName("field1");
  let f2 = document.getElementsByName("field2");
  let r = document.getElementById("result");
  r.innerHTML = f1[0].value + f2[0].value;
  let s = document.getElementsByName("select1");
  console.log(s[0].value);
  return false;
}
