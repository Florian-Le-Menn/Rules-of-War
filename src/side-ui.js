let clicked1;
let popUpHovered = false;

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

    $("#credits-link").click(function () {
        $("#pop-up-container").attr("hidden", false);
        $("#credits-pop-up").attr("hidden", false);
        $('#credits-pop-up').hover(function () {
            popUpHovered = true;
        }, function () {
            popUpHovered = false;
        });
    });


    $("#help-link").click(function () {
        $("#pop-up-container").attr("hidden", false);
        $("#help-pop-up").attr("hidden", false);
        $('#help-pop-up').hover(function () {
            popUpHovered = true;
        }, function () {
            popUpHovered = false;
        });
    });

    $("#pop-up-container").click(function () {
        if (popUpHovered) return;
        $("#pop-up-container>*").each(function () {
            $(this).attr("hidden", true);
        });
        $("#pop-up-container").attr("hidden", true);
    });

    $("#btn-close-help").click(function () {
        $("#pop-up-container").attr("hidden", true);
        $("#help-pop-up").attr("hidden", true);
    });

    $("#credits-pop-up a").each(function () {
        $(this).attr("target", "_blank");
        $(this).attr("rel", "noopener noreferrer");
    });

    $("#btn-help1-2").click(function () {
        $("#help-1").attr("hidden", true);
        $("#help-2").attr("hidden", false);
    });

    $("#btn-help2-1").click(function () {
        $("#help-2").attr("hidden", true);
        $("#help-1").attr("hidden", false);
    });

    $("#btn-help2-3").click(function () {
        $("#help-2").attr("hidden", true);
        $("#help-3").attr("hidden", false);
    });

    $("#btn-help3-2").click(function () {
        $("#help-3").attr("hidden", true);
        $("#help-2").attr("hidden", false);
    });

    /**
     * Listener to allow click and drag on map to fill selectors
     */
    $("path").each(function () {
        $(this).on("mousedown", function () {
            let style = $(this).attr('style');
            let ifill = style.indexOf("fill:");
            let color = style.substring(ifill + 5, ifill + 12);
            let country = Country.findByColor(color);
            clicked1 = country;

        });
        $(this).on("mouseup", function () {
            let style = $(this).attr('style');
            let ifill = style.indexOf("fill:");
            let color = style.substring(ifill + 5, ifill + 12);
            let country = Country.findByColor(color);
            if (country == clicked1) {
                clicked1 = null;
                return;
            }
            if ($("#attacker-selector").hasClass("clickable")) {
                setAttacker(clicked1);
                setDefender(country);
                setDonor(clicked1);
                setReceiver(country);
            }
        });
    });
});