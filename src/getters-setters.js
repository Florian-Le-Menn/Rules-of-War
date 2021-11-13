
/**
 * sets the attacking country.
 * 
 * @param {Country} country 
 */
function setAttacker(country = null) {
    if (country == null) {
        $("#attacker-selector").text("Attacker");
        $("#attacker-selector").attr("country", null);
        updateSlider(0);
    } else {
        $("#attacker-selector").text(country.shortName);
        $("#attacker-selector").attr("country", country.name);
        updateSlider(country.turn);
    }
}

/**
 * @returns the current selected attacking country, or null if none is selected
 */
function getAttacker() {
    let countryName = $("#attacker-selector").attr("country");
    if (Country.exist(countryName)) {
        return countryList[countryName];
    } else {
        return null;
    }
}

/**
 * sets the defending country
 * 
 * @param {Country} country 
 */
function setDefender(country = null) {
    if (country == null) {
        $("#defender-selector").text("Defender");
        $("#defender-selector").attr("country", null);
    } else {
        $("#defender-selector").text(country.shortName);
        $("#defender-selector").attr("country", country.name);
    }
}

/**
 * @returns the current selected defending country, or null if none is selected
 */
function getDefender() {
    let countryName = $("#defender-selector").attr("country");
    if (Country.exist(countryName)) {
        return countryList[countryName];
    } else {
        return null;
    }
}

/**
 * 
 * @returns the current selected strength
 */
function getStrength() {
    return $("#strength-slider").slider("option", "value");
}