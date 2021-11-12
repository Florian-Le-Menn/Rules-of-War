const MAX_SAFE_INTEGER = 9007199254740991;
const ALL_TERRITORIES = document.getElementsByTagName('path');
let nbToGive = 0;

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
 * Return a list of vanquished territories sorted by distance to the victor closest territories
 * 
 * @param {Country} victor : Victorious country
 * @param {Country} vanquished : Defeated country
 * 
 * @returns {List<int,Path>} capturableTerritories : List of territories(and their distance) of the defeated country sorted by distance to the victorious country
 */
function VanquishedTerritoriesByDistance(victor, vanquished) {
	let victorColor = victor.color;
	let vanquishedColor = vanquished.color;
	let victorTerritories = [];
	let vanquishedTerritories = [];
	let capturableTerritories = [];
	let fillPos, i, j;
	for (i = 0; i < ALL_TERRITORIES.length; i = i + 1) {
		fillPos = ALL_TERRITORIES[i].getAttribute("style").indexOf("fill:");
		switch (ALL_TERRITORIES[i].getAttribute('style').substring(fillPos + 5, fillPos + 12)) {
			case vanquishedColor:
				vanquishedTerritories.push(ALL_TERRITORIES[i]);
				break;
			case victorColor:
				victorTerritories.push(ALL_TERRITORIES[i]);
				break;
			default:
				break;
		}
	}
	for (i = 0; i < vanquishedTerritories.length; i = i + 1) {//pour chaque def
		let xDef = parseFloat(vanquishedTerritories[i].getAttribute('d').split(" ")[1].split(",")[0]);
		let yDef = parseFloat(vanquishedTerritories[i].getAttribute('d').split(" ")[1].split(",")[1]);
		let minDist = MAX_SAFE_INTEGER;
		for (j = 0; j < victorTerritories.length; j = j + 1) {//pour chaque atk
			let xAtk = parseFloat(victorTerritories[j].getAttribute('d').split(" ")[1].split(",")[0]);
			let yAtk = parseFloat(victorTerritories[j].getAttribute('d').split(" ")[1].split(",")[1]);
			let dist = (Math.pow(xAtk - xDef, 2) + Math.pow(yAtk - yDef, 2));
			if (dist < minDist) {
				minDist = dist;
			}
		}
		capturableTerritories.push([minDist, vanquishedTerritories[i]])
	}
	capturableTerritories.sort((a, b) => a[0] - b[0]);
	return capturableTerritories;
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
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["albanie"].color));
				break;
			case 'fill:#5b8d80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["grece"].color));
				break;
			case 'fill:#f42400':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["turquie"].color));
				break;
			case 'fill:#f42400':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["chypre"].color));
				break;
			case 'fill:#2ab980':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["bulgarie"].color));
				break;
			case 'fill:#927c00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["macedoine"].color));
				break;
			case 'fill:#7a1200':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["kosovo"].color));
				break;
			case 'fill:#a4cb80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["montenegro"].color));
				break;
			case 'fill:#d59f80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["serbie"].color));
				break;
			case 'fill:#c96a80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["roumanie"].color));
				break;
			case 'fill:#9eb100':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["moldavie"].color));
				break;
			case 'fill:#fa3e80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["ukraine"].color));
				break;
			case 'fill:#1e8480':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["bielorussie"].color));
				break;
			case 'fill:#864700':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["lituanie"].color));
				break;
			case 'fill:#802c80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["lettonie"].color));
				break;
			case 'fill:#493e00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["estonie"].color));
				break;
			case 'fill:#4f5880':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["finlande"].color));
				break;
			case 'fill:#e7ef00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["suede"].color));
				break;
			case 'fill:#aae600':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["norvege"].color));
				break;
			case 'fill:#b71b00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["pologne"].color));
				break;
			case 'fill:#dbba00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["slovaquie"].color));
				break;
			case 'fill:#61a800':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["hongrie"].color));
				break;
			case 'fill:#c35000':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["republique_tcheque"].color));
				break;
			case 'fill:#124f80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["autriche"].color));
				break;
			case 'fill:#36ee80':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["croatie"].color));
				break;
			case 'fill:#249f00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["bosnie"].color));
				break;
			case 'fill:#e1d480':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["slovenie"].color));
				break;
			case 'fill:#73f780':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["italie"].color));
				break;
			case 'fill:#ee0980':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["suisse"].color));
				break;
			case 'fill:#0c3500':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["allemagne"].color));
				break;
			case 'fill:#3d0900':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["danemark"].color));
				break;
			case 'fill:#b10080':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["pays_bas"].color));
				break;
			case 'fill:#186a00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["belgique"].color));
				break;
			case 'fill:#8c6180':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["luxembourg"].color));
				break;
			case 'fill:#557300':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["france"].color));
				break;
			case 'fill:#432380':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["espagne"].color));
				break;
			case 'fill:#bd3580':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["portugal"].color));
				break;
			case 'fill:#cf8500':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["royaume_uni"].color));
				break;
			case 'fill:#67c280':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["irlande"].color));
				break;
			case 'fill:#6ddd00':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["islande"].color));
				break;
			case 'fill:#30d400':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["chypre"].color));
				break;
			case 'fill:#989680':
				ALL_TERRITORIES[i].setAttribute('style', 'fill:'.concat(countryList["malte"].color));
				break;
			default:
				break;
		}
	}
}

/**
 * End the current turn and start the next one.
 * 
 * + Make the computer-played countries that are at war do their battles
 * + Reinitialize the force available for each country
 * + Increase the army size depending on the population. TODO improve the equation to make it more realistic
 * + Increase the populaton size. TODO improve the equation to make it more realistic
 */
function newTurn() {
	Country.manageWars();
	for (let key in countryList) {
		country = countryList[key];
		country.turn = 100;
		country.army = parseInt(country.army + country.population / 2000);
		country.population = parseInt(country.population * 1.1);
	};
}

/**
 * Allows the user to select {nb} territories from {donator} to give to {receiver}
 * 
 * @param {Country} donor 
 * @param {Country} receiver 
 * @param {int} nb 
 */
function selectTerritoryDonation(donor, receiver, nb) {
	$("#btn-country-donator").prop("disabled", true);
	$("#btn-country-receiver").prop("disabled", true);
	$("#btn-country-donator").removeClass("pressed");
	$("#btn-country-receiver").removeClass("pressed");
	nbToGive = nb;
	let territories = nbToGive == 1 ? " territory" : " territories";
	$("#notice").text("Select " + nbToGive + territories + " from " + donor.name + " to give to " + receiver.name);
	$("path").each(function () {
		if ($(this).attr('style').substring(5, 12) == donor.color) {
			$(this).addClass("givable");
		}
	});
	$(".givable").bind("click.givable", eventGiveTerritory);
}

/**
 * Refresh the displayed informations about the selected country
 */
function refreshInformations() {
	if (Country.exist($("#country-field").text())) {
		let country = countryList[$("#country-field").text()];
		$("#information-population").text(country.population);
		$("#information-army").text(country.army);
		$("#information-territories").text(country.territory);
		$("#information-player").text(country.player);
	}
}

/**
 * TODO check if broken and fix
 * 
 * @returns {String} svg file as a string
 */
function saveSVG() {
	let str = $("#svg").wrap("<p/>").parent().html();
	$("#svg").unwrap();
	return str;
}

/**
 * TODO check if broken and fix 
 * 
 * @param {*} data 
 * @param {*} filename 
 * @param {*} type 
 */
// Function to download data to a file
function download(data, filename, type) {
	let file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		let a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}