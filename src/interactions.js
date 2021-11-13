/**
 * This file contains the jQuery interactions that are not important for the core of the game
 */

function updateSlider(value) {
    $("#strength-slider").slider("option", "max", value);
    $("#strength-slider").slider("option", "value", value);
    $("#strength-slider-handle").text(value);
}

$(function () {

    /**
     * Listeners on the commands set titles to hide/show their content
     */
    $("#battles-title").click(function () {
        $("#battles-content").slideToggle();
    });

    $("#informations-title").click(function () {
        $("#informations-content").slideToggle();
    });

    $("#donations-title").click(function () {
        $("#donations-content").slideToggle();
    });


    var handle = $("#strength-slider-handle");
    $("#strength-slider").slider({
        max: 0,
        create: function () {
            $(this).slider("value", 0);
            handle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            handle.text(ui.value);
        }
    });
});