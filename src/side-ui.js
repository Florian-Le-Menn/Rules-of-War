/**
 * This file contains the jQuery interactions that are not important for the core of the game
 */

function updateSlider(value) {
    $("#strength-slider").slider("option", "max", value);
    $("#strength-slider").slider("option", "value", value);
    $("#strength-slider-handle").text(value);
}

function lockConfirmTradeButton() {
    $("#confirm-trade").removeClass("clickable");
}
function unlockConfirmTradeButton() {
    $("#confirm-trade").addClass("clickable");
}


function checkConfirmTradeButton() {
    if (getReceiver() == null || getDonor() == null || ($("#population-amount-trade").val().length == 0 && $("#soldiers-amount-trade").val().length == 0 && $("#territories-amount-trade").val().length == 0)) {
        lockConfirmTradeButton();
    } else {
        unlockConfirmTradeButton();
    }
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

    $("#trades-title").click(function () {
        $("#trades-content").slideToggle();
    });

    $("#population-amount-trade,#soldiers-amount-trade,#territories-amount-trade").on("keyup", function () {
        checkConfirmTradeButton();
    });
});