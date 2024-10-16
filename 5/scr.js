window.addEventListener("DOMContentLoaded", function () {

    let kol = document.getElementById("kol");
    let product = document.getElementById("vybor");
    let calcButton = document.getElementById("itog");
    let result = document.getElementById("resultat");

    calcButton.addEventListener("click", function () {
        let kolt = kol.value;
        if (kolt.match(/^\d+$/) !== null) {
            let res = parseInt(product.value) * kolt;
            result.innerText = res;
        } else {
            result.innerText = "Некорректный ввод количества, пожалуйста, напишите число!";
        }
    });
});
