/*jslint browser: true*/ /*global  $*/
$(document).ready(function () {
    $(".carousel").slick({
        dots: true,
        infinite: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1
                }
            }
        ],
        slidesToShow: 3
    });
});
