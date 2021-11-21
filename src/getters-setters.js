
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
        return Country.countryList[countryName];
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
        return Country.countryList[countryName];
    } else {
        return null;
    }
}
/**
 * sets the donor country.
 * 
 * @param {Country} country 
 */
function setDonor(country = null) {
    if (country == null) {
        $("#donor-selector").text("Donor");
        $("#donor-selector").attr("country", null);
    } else {
        $("#donor-selector").text(country.shortName);
        $("#donor-selector").attr("country", country.name);
    }
    checkConfirmTradeButton();
}

/**
 * @returns the current selected donor country, or null if none is selected
 */
function getDonor() {
    let countryName = $("#donor-selector").attr("country");
    if (Country.exist(countryName)) {
        return Country.countryList[countryName];
    } else {
        return null;
    }
}

/**
 * sets the receiver country
 * 
 * @param {Country} country 
 */
function setReceiver(country = null) {
    if (country == null) {
        $("#receiver-selector").text("Receiver");
        $("#receiver-selector").attr("country", null);
    } else {
        $("#receiver-selector").text(country.shortName);
        $("#receiver-selector").attr("country", country.name);
    }
    checkConfirmTradeButton();
}

/**
 * @returns the current selected receiver country, or null if none is selected
 */
function getReceiver() {
    let countryName = $("#receiver-selector").attr("country");
    if (Country.exist(countryName)) {
        return Country.countryList[countryName];
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