function lockSelectors() {
    $(".selector").each(function () {
        $(this).removeClass("pressed");
        $(this).removeClass("clickable");
    });
}
function unlockSelectors() {
    $(".selector").each(function () {
        $(this).addClass("clickable");
    });
}
function clearTradeRequest() {
    $("#population-amount-trade").val("")
    $("#soldiers-amount-trade").val("");
    $("#territories-amount-trade").val("");
    lockConfirmTradeButton();
}

/**
 * Refresh the displayed informations about the selected country
 */
function refreshInformations() {
    let country = Country.selected;
    if (country == null) return;
    $("#country-field-name").text(country.name);
    $("#information-population").text(FormatNumberDisplayable(country.population));
    $("#information-army").text(FormatNumberDisplayable(country.army));
    $("#information-territories").text(country.territory);
    if (country.player) {
        $("#icon-is-player").attr("src", "ressources/icons/player-24.png");
    } else {
        $("#icon-is-player").attr("src", "ressources/icons/computer-24.png");
    }
    $("#informations-content").css("background-image", "url(\"ressources/flags/" + country.iso + ".svg\")");

}

/**
 * Colors {nb} territories from {def} country to {atk} country
 * 
 * @param {Country} victor : Victorious country
 * @param {int} nb : Number of territories won by the attacker over the defender
 * @param {List<Path>} capturableTerritories : List of territories from the vanquished sorted by closest distance to the attacker.
 * 
 * @returns {int} nb : number of territories not captured (beacause the defender has less territories than the amount lost for example)
 */
function color(victor, nb, capturableTerritories) {
    capturableTerritories.splice(nb);
    for (let e of capturableTerritories) {
        e[1].setAttribute('style', 'fill:'.concat(victor.color));
    }
    let lisLen = capturableTerritories.length;
    nb -= lisLen;
    return nb;
}

/**
 * Allows the user to select {nb} territories from {donator} to give to {receiver}
 * 
 * @param {Country} donor 
 * @param {Country} receiver 
 * @param {int} nb 
 */
function selectTerritoryDonation(donor, receiver, nb) {
    lockSelectors();
    nbToGive = nb;
    let territories = nbToGive == 1 ? " territory" : " territories";
    $("#notice").show();
    $("#notice").text("Select " + nbToGive + territories + " from " + donor.name + " to give to " + receiver.name);
    $("path").each(function () {
        let style = $(this).attr('style');
        let ifill = style.indexOf("fill:");

        if (style.substring(ifill + 5, ifill + 12) == donor.color) {
            $(this).addClass("givable");
        }
    });
    $(".givable").bind("click.givable", eventGiveTerritory);
}

/**
 * Replace the territories color with the new decided color for each country 
 * 
 * Beware to not chose an already existing color for a country, or it will merge both countries
 */
function iniColors() {
    for (i = 0; i < ALL_TERRITORIES.length; i++) {
        switch (ALL_TERRITORIES[i].getAttribute('style').substring(0, 12)) {
            case 'fill:#061a80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["albanie"].color));
                break;
            case 'fill:#5b8d80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["grece"].color));
                break;
            case 'fill:#f42400':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["turquie"].color));
                break;
            case 'fill:#f42400':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["chypre"].color));
                break;
            case 'fill:#2ab980':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["bulgarie"].color));
                break;
            case 'fill:#927c00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["macedoine"].color));
                break;
            case 'fill:#7a1200':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["kosovo"].color));
                break;
            case 'fill:#a4cb80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["montenegro"].color));
                break;
            case 'fill:#d59f80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["serbie"].color));
                break;
            case 'fill:#c96a80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["roumanie"].color));
                break;
            case 'fill:#9eb100':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["moldavie"].color));
                break;
            case 'fill:#fa3e80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["ukraine"].color));
                break;
            case 'fill:#1e8480':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["bielorussie"].color));
                break;
            case 'fill:#864700':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["lituanie"].color));
                break;
            case 'fill:#802c80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["lettonie"].color));
                break;
            case 'fill:#493e00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["estonie"].color));
                break;
            case 'fill:#4f5880':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["finlande"].color));
                break;
            case 'fill:#e7ef00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["suede"].color));
                break;
            case 'fill:#aae600':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["norvege"].color));
                break;
            case 'fill:#b71b00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["pologne"].color));
                break;
            case 'fill:#dbba00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["slovaquie"].color));
                break;
            case 'fill:#61a800':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["hongrie"].color));
                break;
            case 'fill:#c35000':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["republique_tcheque"].color));
                break;
            case 'fill:#124f80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["autriche"].color));
                break;
            case 'fill:#36ee80':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["croatie"].color));
                break;
            case 'fill:#249f00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["bosnie"].color));
                break;
            case 'fill:#e1d480':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["slovenie"].color));
                break;
            case 'fill:#73f780':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["italie"].color));
                break;
            case 'fill:#ee0980':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["suisse"].color));
                break;
            case 'fill:#0c3500':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["allemagne"].color));
                break;
            case 'fill:#3d0900':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["danemark"].color));
                break;
            case 'fill:#b10080':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["pays_bas"].color));
                break;
            case 'fill:#186a00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["belgique"].color));
                break;
            case 'fill:#8c6180':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["luxembourg"].color));
                break;
            case 'fill:#557300':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["france"].color));
                break;
            case 'fill:#432380':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["espagne"].color));
                break;
            case 'fill:#bd3580':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["portugal"].color));
                break;
            case 'fill:#cf8500':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["royaume_uni"].color));
                break;
            case 'fill:#67c280':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["irlande"].color));
                break;
            case 'fill:#6ddd00':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["islande"].color));
                break;
            case 'fill:#30d400':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["chypre"].color));
                break;
            case 'fill:#989680':
                ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(Country.countryList["malte"].color));
                break;
            default:
                break;
        }
    }
}