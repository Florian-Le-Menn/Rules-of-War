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
		let chanceArmy = 0.9 + Math.random() * 0.2;
		let chancePop = 0.9 + Math.random() * 0.2;
		country.army += parseInt((chanceArmy * country.population / 50 - country.army) * (chanceArmy * country.population / 50 + country.army) / 50000000);
		let populationDividedBy1million = country.population / 1000000;
		/* asymptote : 2*territory *1'000'000
			  example for 100 territory:
			  asymptote = 200'000'000
			biggest growth when population = 100'000'000, smallest when it is near 0 or 200'000'000, ans loses population if it is beyond 200'000'000
			  cf.  f(x)=(2*100-x)*x*200  
			  The remaining *200 is a coefficient added to reach a desired credible population growth
			*/
		country.population += parseInt((2 * chancePop * country.territory - populationDividedBy1million) * populationDividedBy1million * 200);
		country.populationHistory.push(country.population);
		country.armyHistory.push(country.army);
		country.territoryHistory.push(country.territory);
	};
	if ($("#cb-auto-dl-img").is(":checked")) {
		$("#btn-download-image").click();
	}
	if ($("#cb-auto-dl-stats").is(":checked")) {
		$("#download-statistics").click();
	}
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
 * @param {*} data 
 * @param {*} filename 
 * @param {*} type 
 */
// Function to download data to a file
function download(url, filename) {
	let a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}
function downloadTxt(data, filename, type) {
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
/**
 * https://ramblings.mcpher.com/gassnippets2/converting-svg-to-png-with-javascript/
 * 
 * converts an svg string to base64 png using the domUrl
 * @param {string} svgText the svgtext
 * @param {number} [margin=0] the width of the border - the image size will be height+margin by width+margin
 * @param {string} [fill] optionally backgrund canvas fill
 * @return {Promise} a promise to the bas64 png image
 */
var svgToPng = function (svgText, margin, fill) {
	// convert an svg text to png using the browser
	return new Promise(function (resolve, reject) {
		try {
			// can use the domUrl function from the browser
			var domUrl = window.URL || window.webkitURL || window;
			if (!domUrl) {
				throw new Error("(browser doesnt support this)")
			}

			// figure out the height and width from svg text
			var match = svgText.match(/height=\"(\d+)/m);
			var height = match && match[1] ? parseInt(match[1], 10) : 200;
			var match = svgText.match(/width=\"(\d+)/m);
			var width = match && match[1] ? parseInt(match[1], 10) : 200;
			margin = margin || 0;

			// it needs a namespace
			if (!svgText.match(/xmlns=\"/mi)) {
				svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
			}

			// create a canvas element to pass through
			var canvas = document.createElement("canvas");
			canvas.width = 3072;// height + margin * 2;
			canvas.height = 2096;//width + margin * 2;
			var ctx = canvas.getContext("2d");

			// make a blob from the svg
			var svg = new Blob([svgText], {
				type: "image/svg+xml;charset=utf-8"
			});

			// create a dom object for that image
			var url = domUrl.createObjectURL(svg);

			// create a new image to hold it the converted type
			var img = new Image;

			// when the image is loaded we can get it as base64 url
			img.onload = function () {
				// draw it to the canvas
				ctx.drawImage(this, margin, margin);

				// if it needs some styling, we need a new canvas
				if (fill) {
					var styled = document.createElement("canvas");
					styled.width = canvas.width;
					styled.height = canvas.height;
					var styledCtx = styled.getContext("2d");
					styledCtx.save();
					styledCtx.fillStyle = fill;
					styledCtx.fillRect(0, 0, canvas.width, canvas.height);
					styledCtx.strokeRect(0, 0, canvas.width, canvas.height);
					styledCtx.restore();
					styledCtx.drawImage(canvas, 0, 0);
					canvas = styled;
				}
				// we don't need the original any more
				domUrl.revokeObjectURL(url);
				// now we can resolve the promise, passing the base64 url
				resolve(canvas.toDataURL());
			};

			// load the image
			img.src = url;
		} catch (err) {
			reject('failed to convert svg to png ' + err);
		}
	});
};