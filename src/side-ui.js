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
});