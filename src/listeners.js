/**
 * Listener binded to all givable territories when the user has to select some
 * 
 * Give the selected territory from the donor to the receiver
 */
let eventGiveTerritory = function () {
    $(this).attr('style', 'fill:'.concat(Country.countryList[$("#receiver-selector").text()].color));
    nbToGive--;
    if (nbToGive == 0) {
        $("#notice").hide();
        $("#notice").text("");
        unlockSelectors();
        // Cancelling the listener
        $(".givable").unbind("click.givable");
        $(".givable").each(function () {
            $(this).removeClass("givable");
        });
    } else {
        $(this).unbind("click.givable");
        $(this).removeClass("givable");
        let territories = nbToGive == 1 ? " territory" : " territories";
        $("#notice").show();
        $("#notice").text("Select " + nbToGive + territories + " from " + $("#donor-selector").text() + " to give to " + $("#receiver-selector").text());
    }
};


function listeners() {
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

    /**
     * Listener on the button to start a battle
     */
    $("#battle-button").click(function () {
        let atk = getAttacker();
        let def = getDefender();
        let strength = getStrength();
        if (atk == null || def == null || strength == 0) return;

        if (atk.player == false) {
            atk.army += 20000
            atk.player = true;
        }
        atk.tryAttack(def, strength);
        refreshInformations();
        updateSlider(atk.turn);
    });

    /**
     * Listener on the button 'information'
     * 
     * Writes the informations about a country in the consoloe
     * 
     * TODO + Write the information in a more user friendly are
     *		+ Find a way to allow again to display general and 'all players' informations
     **/
    $("#btn-country-informations").click(function () {
        if ($("#country-field").text() == "general") {
            str = "Country list :\n";
            for (let countryName in Country.countryList) {
                let country = Country.countryList[countryName];
                str += country.toString();
            }
            console.log(str);
        } else if ($("#country-field").text() == "joueurs") {
            str = "Player list :\n";
            for (let countryName in Country.countryList) {
                let country = Country.countryList[countryName];
                if (country.player) {
                    str += country.toString();
                }
            }
            console.log(str);
        } else if (Country.exist($("#country-field").text())) {
            console.log(Country.countryList[$("#country-field").text()]);
        }
    });

    /**
     * Listener on the 'end of turn' button
     */
    $("#btn-end-turn").click(function () {
        newTurn();
        $("#turn").text("TURN " + Country.turn);
        refreshInformations();
        updateSlider(100);
    });

    /**
     * Add or remove the 'pressed' class on the 'selectors' div (used as buttons)
     * Only when the selectors are unlocked
     * 
     * useful to change style depending on the state of the button and actually select it
     */
    $(".selector").each(function () {
        $(this).click(function () {
            if (!$(this).hasClass("clickable")) return;
            if ($(this).hasClass("pressed")) {
                $(this).removeClass("pressed");
            } else {
                $(".selector").removeClass("pressed");
                $(this).addClass("pressed");
            }
        });
    });

    /**
     * Listener on the 'information player' field (on click)
     * 
     * Change the country from NPC to Player or vice versa
     */
    $("#information-player").click(function () {
        let countryName = $("#country-field").text();
        let country = Country.countryList[countryName];
        country.player = !country.player;
        $("#information-player").text(country.player);
    });

    /**
     * Listener on the save button
     * 
     * TODO check if it works
     * 
     */
    $("#btn-save").click(function () {
        downloadTxt(Country.serializeState(), "saveRulesOfWar.txt");
        //download(Country.saveList(), "load.js", "");
    });

    /**
     * Listener on the 'Download PNG' button
     * 
     * TODO Fix it (broken)
     */
    $("#btn-download-image").click(function () {
        svgToPng($("#svg").prop("outerHTML"), null, "#ccf6ff").then(function (value) {
            download(value, "turn-" + Country.turn + ".png");
        });
    });
    $("#download-statistics").click(function () {
        buildGraph("population", true);
        setTimeout(function () {
            download(chart.toBase64Image(), "populations-turn-" + Country.turn + ".png");
            setTimeout(function () {
                buildGraph("army", true);
                setTimeout(function () {
                    download(chart.toBase64Image(), "armies-turn-" + Country.turn + ".png");
                    setTimeout(function () {
                        buildGraph("territory", true);
                        setTimeout(function () {
                            download(chart.toBase64Image(), "territories-turn-" + Country.turn + ".png");
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    });

    /**
     * Listener on the territories
     * 
     * Display the country informations
     * If a button is pressed (waiting for a country to be selected), select the country
     */
    $("path").each(function () {
        $(this).click(function () {
            let fillPos = $(this).attr("style").indexOf("fill:");
            let country = Country.findByColor($(this).attr("style").substring(fillPos + 5, fillPos + 12));
            Country.selected = country;
            refreshInformations();
            let selectorPressed = $(".selector.pressed").attr('id');
            if (selectorPressed == "attacker-selector") {
                setAttacker(country);
            } else if (selectorPressed == "defender-selector") {
                setDefender(country);
            } else if (selectorPressed == "donor-selector") {
                setDonor(country);
            } else if (selectorPressed == "receiver-selector") {
                setReceiver(country);
            }
        });
    });

    /**
     * Listener on the 'Refresh' button
     * 
     * TODO Check if it's still doing something useful 
     */
    $("#btn-refresh-informations").click(function () {
        refreshInformations();
    });

    /**
     * Listener on the trade button
     * 
     * TODO check if the calculs are good
     */
    $("#confirm-trade").click(function () {
        let donor = Country.countryList[$("#donor-selector").text()];
        let receiver = Country.countryList[$("#receiver-selector").text()];
        let amountArmy = parseInt($("#soldiers-amount-trade").val());
        let amountPop = parseInt($("#population-amount-trade").val());
        let amountTerritory = parseInt($("#territories-amount-trade").val());
        clearTradeRequest();

        if (amountArmy > 0) {
            donor.donateArmy(receiver, amountArmy);
        }
        if (amountTerritory > 0) {
            donor.donateTerritory(receiver, amountTerritory);
        }
        if (amountPop > 0) {
            donor.donatePopulation(receiver, amountPop);
        }
        refreshInformations();
    });

    /**
     * Copy the informations of the players (in order to paste it directly in a messsage)
     */
    $("#copy-clipboard-players-informations").click(function () {
        let str = "Player list :\n";
        for (let countryName in Country.countryList) {
            let country = Country.countryList[countryName];
            if (country.player) {
                str += country.toString();
            }
        }
        let textArea = document.createElement("textarea");

        textArea.value = str;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');

        document.body.removeChild(textArea);
    });

    /**
     * Copy the informations of every countries (in order to paste it directly in a messsage)
     */
    $("#copy-clipboard-general-informations").click(function () {
        let str = "Country list :\n";
        for (let countryName in Country.countryList) {
            let country = Country.countryList[countryName];
            str += country.toString();
        }
        let textArea = document.createElement("textarea");

        textArea.value = str;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');

        document.body.removeChild(textArea);
    });

    /**
     * Invert the attacker and the defender (useful if wrongly picked or if two players are fighting)
     */
    $("#swap-button-battle").click(function () {
        let atk = getAttacker();
        let def = getDefender();
        setAttacker(def);
        setDefender(atk);
    });
    $("#swap-button-trade").click(function () {
        let donor = getDonor();
        let receiver = getReceiver();
        setDonor(receiver);
        setReceiver(donor);
    });

    $("#icon-link-pop").click(function () {
        $(this).toggleClass("pressed");
    });
}