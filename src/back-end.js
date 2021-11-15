const MAX_SAFE_INTEGER = 9007199254740991;
const ALL_TERRITORIES = document.getElementsByTagName('path');
let nbToGive = 0;

/**
 * Return a list of capturable territories from {vanquished} sorted by distance to {victor}'s closest territories
 * 
 * @param {Country} victor : Victorious country
 * @param {Country} vanquished : Defeated country
 * 
 * @returns {List<int,Path>} capturableTerritories : List of territories(and their distance) of the defeated country sorted by distance to the victorious country
 */
function capturableTerritoriesByDistance(victor, vanquished) {
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
 * End the current turn and start the next one.
 * 
 * + Make the computer-played countries that are at war do their battles
 * + Reinitialize the force available for each country
 * + Increase the army size depending on the population. TODO improve the equation to make it more realistic
 * + Increase the populaton size. TODO improve the equation to make it more realistic
 */
function newTurn() {
	Country.turn++;
	Country.manageWars();
	for (let key in Country.countryList) {
		country = Country.countryList[key];
		country.turn = 100;
		country.army += parseInt((country.population / 50 - country.army) * (country.population / 50 + country.army) / 50000000);
		let populationDividedBy1million = country.population / 1000000;
		/* asymptote : 2*territory *1'000'000
			  example for 100 territory:
			  asymptote = 200'000'000
			biggest growth when population = 100'000'000, smallest when it is near 0 or 200'000'000, ans loses population if it is beyond 200'000'000
			  cf.  f(x)=(2*100-x)*x*200  
			  The remaining *200 is a coefficient added to reach a desired credible population growth
			*/
		country.population += parseInt((2 * country.territory - populationDividedBy1million) * populationDividedBy1million * 200);
	};
}

/**
 * 
 * @param {int} number 
 * @returns {String} number formated like "10'000'000"
 */
function FormatNumberDisplayable(number) {
	if (number < 1000 && number > -1000) return number;
	number = "" + number;
	let ptr = number.length;
	while (ptr > 0) {
		ptr -= 3;
		if (ptr <= 0) break;
		number = number.slice(0, ptr) + "'" + number.slice(ptr);
	}
	return number;
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