window.addEventListener("DOMContentLoaded", function () {
    const cena =
        { "1": 1000, "2": 1540, "3": 25000, "4": 12500, "5": 999, "6": 560 };
    const category =
        { "1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 4 };
    const colormn =
        { "col1": 1.4, "col2": 0.9, "col3": 1, "col4": 1.5, "col5": 1.1 };

    let k = document.getElementById("kol");
    let product = document.getElementById("vybor");
    let result = document.getElementById("result"); colo
    let colorlist = document.getElementById("colo");
    let ysluga = document.getElementsByName("ys");
    let port= document.getElementsByName("dopol");
    //блоки
    let c = document.getElementById("colors");
    let d= document.getElementById("dop");
    //счет
    function calculate() {
        let kol = k.value;
       
            if (kol.match(/^\d+$/) !== null) {
                //переменные+услуга
                let col = 1;
                let service = (ysluga[0].checked * (1000)) + (ysluga[1].checked * (1200));
                let karkas = 0;
                let drevo = 0;

                //цвета
                if (category[product.value] === 2 || category[product.value]===3) {
                    col = colormn[colorlist.value]*kol;
                }
                

                //дополнительно
                if (category[product.value] === 1 || category[product.value] === 2) {
                    if (port[0].checked === true) {
                        karkas = 1000*kol;
                    } 
                    if (port[1].checked === true) {
                        drevo = 1500*kol;
                    } 
                } 

                let res = cena[product.value] * col + drevo + service*kol +karkas;
                result.innerText = res;
            } 
            else {
                result.innerText = "Некорректный ввод количества";
            }
        
       
    }

    ysluga.forEach(function (elem) {
        elem.addEventListener("change", function () {
            calculate();
        });
    });

    port.forEach(function (elem) {
        elem.addEventListener("change", function () {
            calculate();
        });
    });

    k.addEventListener("input", function () {
        calculate();
    });

    colorlist.addEventListener("change", function () {
        calculate();
    });

    product.addEventListener("change", function () {
        if (category[product.value] === 3) {
            calculate();
            d.style = "display:none";
            c.style = "display:flex; flex-direction: column";
        }
        if (category[product.value] === 1) {
            calculate();
            d.style = "display:flex; flex-direction: column";
            c.style = "display:none";
        }
        if (category[product.value] === 2) {
            calculate();
            d.style = "display:flex; flex-direction: column";
            c.style = "display:flex; flex-direction: column";
        }
        if (category[product.value] === 4) {
            calculate();
            d.style = "display:none";
            c.style = "display:none";
        }
    });
});
