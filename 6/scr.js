window.addEventListener("DOMContentLoaded", function () {
    const cena =
        { "1": 1000, "2": 1540, "3": 25000, "4": 12500, "5": 999, "6": 560 };
    const category =
        { "1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 4 };
    const colormn =
        { "col1": 1.4, "col2": 0.9, "col3": 1, "col4": 1.5, "col5": 1.1 };
    ///переменные
    let k = document.getElementById("kol");
    let product = document.getElementById("vybor");
    let result = document.getElementById("resultat");
    let colorList = document.getElementById("colo");
    let ysluga = document.getElementsByName("ys");
    let dopolnit = document.getElementsByName("dopol");
    ///блоки
    let c = document.getElementById("colors");
    let d = document.getElementById("dop");

    function calculate() {
        let kol = k.value;
        if (kol !== "") {
            if (kol.match(/^\d+$/) !== null) {
                //переменные+услуга
                let col = 1;
                let serv = (ysluga[0].checked * (10000)) + (ysluga[1].checked * (12000));
                let karkas = 0;
                let drevo = 0;

                //цвета
                if (category[product.value] === 2 || category[product.value] === 3) {
                    col = colormn[colorList.value];
                }

                //дополнительно
                if (category[product.value] === 1 || category[product.value] === 2) {
                    if (dopolnit[0].checked === true) {
                        karkas = 2400;
                    }
                    if (dopolnit[1].checked === true) {
                        drevo = 3000;
                    }
                }

                let res = cena[product.value] * kol * col + drevo + serv + karkas;
                result.innerText = res;
            } else {
                result.innerText = "Некорректный ввод количества";
            }
        }
        else {
            result.innerText = "";
        }
    }

    ysluga.forEach(function (elem) {
        elem.addEventListener("change", function () {
            calculate();
        });
    });

    dopolnit.forEach(function (elem) {
        elem.addEventListener("change", function () {
            calculate();
        });
    });

    k.addEventListener("input", function () {
        calculate();
    });

    colorList.addEventListener("change", function () {
        calculate();
    });
    ///на экран
    product.addEventListener("change", function () {
        if (category[product.value] === 2) {
            calculate();
            d.style = "display:flex; flex-direction: column";
            c.style = "display:flex; flex-direction: column";
        }
        if (category[product.value] === 3) {
            calculate();
            d.style = "display:none";
            c.style = "display:flex; flex-direction: columne";
        }
        if (category[product.value] === 1) {
            calculate();
            d.style = "display:flex; flex-direction: column";
            c.style = "display:none";
        }
        if (category[product.value] === 4) {
            calculate();
            d.style = "display:none";
            c.style = "display:none";
        }
    });
});
