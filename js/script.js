document.addEventListener('scroll', function (event) {
    relscrol = ((document.body.scrollTop / 200) > 1 ? 1 : (document.body.scrollTop / 200))
    modscrol = (document.body.scrollTop - ($(".section2")[0].offsetTop - 1800)) / 2000;
    relscrol1 = modscrol > 1 ? 1 : modscrol
    // $(".header").css("background", "rgba(255, 255, 255, " + (relscrol - 0.4) + ")")
    // $(".header").css("box-shadow", "0px 10px 14px rgba(0, 0, 0, " + (relscrol - 0.2) + ")")
    $(".header img").css("transform", "translate(0, " + (-(relscrol * 50)) + "px)")
    $("#jellyfish").css({"opacity": relscrol1 - 0.65})

    if (document.body.scrollTop < 218) {
        $(".header img").css("pointer-events", "none")
    } else {
        $(".header img").css("pointer-events", "unset")
    }
}, true);

function maxat(e, num) {
    return e > num ? 1 : e
}

$(".seework").click(function() {
    document.body.scrollTop = $(".section2")[0].offsetTop + 230;
})

$(".header img").click(function() {
    document.body.scrollTop = 0;
})