function result(event) {
  let f1 = document.getElementsByName("select1");
  let f2 = document.getElementsByName("kol");
  if (select1==v1)
    return kol*200;
  if (select1==v2)
    return kol*150;
  if (select1==v3)
    return kol*1200;
  if (select1==v4)
    return kol*220;
  if (select1==v5)
    return kol*136
}
window.addEventListener('DOMContentLoaded', function (event) {
  console.log("DOM fully loaded and parsed");
  let b = document.getElementById("my-button");
  b.addEventListener(b, result);
});
