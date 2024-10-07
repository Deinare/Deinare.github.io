window.addEventListener("DOMContentLoaded", function () {


    let kol = document.getElementById("kol");
    let product = document.getElementById("vybor");
    let calcButton = document.getElementById("itog");
    let result = document.getElementById("resultat");


    const znachenie =
        { "1": 1000, "2": 1540, "3": 25000, "4": 12500, "5": 999, "6": 560 };

    calcButton.addEventListener("click", function () {
        let kolt = kol.value;
        if (kolt.match(/^\d+$/) !== null) {
            let res = znachenie[product.value] * kolt;
            result.innerText = res;
        } else {
            result.innerText = "Некорректный ввод количества, пожалуйста, напишите число!";
        }
    });
});
