/**
 * Represents a country
 */
class Country {
	static turn = 1;
	static nbCountries = 0;
	static countryList = [];
	static selected;

	constructor(name, army, population, territory, color = null, iso = null, shortName = null, player = false, turn = 100, wars = []) {
		Country.countryList[name] = this;
		Country.nbCountries += 1;
		this.wars = wars;
		this.name = name;
		if (shortName == null) {
			this.shortName = name.substr(0, 12);
		} else {
			this.shortName = shortName;
		}
		this.army = army;
		this.population = population;
		this.territory = territory;
		this.turn = turn;
		this.player = player;
		this.iso = iso;
		if (color == null) {
			this.color = (Country.nbCountries * 400000).toString(16);
			while (this.color.length < 6) {
				this.color = "0" + this.color;
			}
			this.color = "#" + this.color;
		} else {
			this.color = color;
		}
	}

	/********************************************************************************************************************************/
	/****************************************************** NON-STATIC METHODS ******************************************************/
	/********************************************************************************************************************************/

	/**
	 * @param {Country} receiver : Receiver country
	 * @param {int} nb : Amount of soldiers to give to {receiver} country
	 */
	donateArmy(receiver, amount) {
		amount = Math.min(this.army, amount);
		this.army -= don;
		receiver.army += don;
	}

	/**
	 * Gives {amount} territories from current country to {receiver} country.
	 * If the checkbox #cb-no-population-donation isn't checked, also give a prorata of population
	 * 
	 * @param {Country} receiver 
	 * @param {int} nb : amount of territories to give to {receiver} country
	 */
	donateTerritory(receiver, amount) {
		amount = Math.min(this.territory, amount);
		this.territory -= amount;
		receiver.territory += amount;
		if (!$("#cb-no-population-donation").is(":checked")) {
			let populationAmount = parseInt((this.population * amount) / this.territory);
			this.population -= populationAmount;
			receiver.population += populationAmount;
		}
		selectTerritoryDonation(this, receiver, amount);
	}

	/**
	 * Add the {country} to the list of countries the current country is at war with. And vice-versa
	 * 
	 * @param {Country} country 
	 */
	war(country) {
		if (!this.wars.includes(country.name)) this.wars.push(country.name);
		if (!country.wars.includes(this.name)) country.wars.push(this.name);
	}

	/**
	 * Remove the {country} to the list of countries the current country is at war with. And vice-versa
	 * 
	 * @param {Country} country 
	 */
	peace(country) {
		this.wars.splice(this.wars.indexOf(country.name), 1);
		country.wars.splice(country.wars.indexOf(this.name), 1);
	}

	/**
	 * @returns {String} Country informations (army size, population size, and number of territories)
	 */
	toString() {
		return (this.name + " [Armée = " + this.army + ", Population = " + this.population + ", Territoires = " + this.territory + "]\n");
	}

	/**
	 * 
	 * @param {*} enemy 
	 * @param {*} perc 
	 */
	tryAttack(enemy, perc) {
		if (this == enemy) return;
		let listConq = capturableTerritoriesByDistance(this, enemy);
		if (enemy.army == 0 && enemy.territory > 0) {
			let nbTerWon = enemy.territory;
			this.territory += enemy.territory;
			enemy.territory = 0;
			color(this, nbTerWon, listConq);
		} else if (enemy.territory > 0 && this.turn > 0 && this.territory > 0) {
			let nbTerWon = this.attack(enemy, perc);
			if (nbTerWon > 0) color(this, nbTerWon, listConq);
		}
		if (enemy.territory == 0) {
			this.peace(enemy);
		}
	}

	/**
	 * 
	 * @param {country} enemy 
	 * @param {int} perc 
	 * @returns {int} gain_ter : Amount of territories gained;
	 */
	attack(enemy, perc) {// Return the number of territories won
		console.log(this.name + " attacks " + enemy.name);
		this.war(enemy);
		// Before Battle
		perc = Math.min(this.turn, perc);
		let en_army_before_bat = enemy.army;
		let army_before_bat = this.army * perc / 100;
		let ter_before_bat = this.territory;

		this.turn -= perc;

		let luck = 1 + Math.random() * 0.5;// [1-1.5]

		// Battle
		//let loses = parseInt(enemy.army /10*luck);
		let en_loses = parseInt(army_before_bat * luck / 10);
		let loses = parseInt(en_loses * (0.5 + Math.random() * 0.5));
		loses = Math.min(army_before_bat, loses);
		en_loses = Math.min(enemy.army, en_loses);

		this.army -= loses;
		enemy.army -= en_loses;

		// After Battle
		luck = 1 + Math.random() * 0.5;// [1-1.5]
		let gain_ter = Math.min(enemy.territory, parseInt((en_loses / en_army_before_bat) * enemy.territory * luck));

		let gain_pop = parseInt((gain_ter / enemy.territory) * enemy.population);

		this.population += gain_pop;
		enemy.population -= gain_pop;

		this.territory += gain_ter;
		enemy.territory -= gain_ter;

		console.log("gain_ter : " + gain_ter + "\ngain_pop : " + gain_pop + "\nloses : " + loses + "\nen_loses : " + en_loses);
		if (enemy.territory == 0 && enemy.player == true) {
			enemy.player = false;
		}
		return gain_ter;
	}

	/********************************************************************************************************************************/
	/******************************************************** STATIC METHODS ********************************************************/
	/********************************************************************************************************************************/

	/**
	 * @param {String} name 
	 * @returns true if a country exists with the given name
	 */
	static exist(name) {
		return (name in Country.countryList);
	}

	/**
	 * Print the country information in the console. TODO display the information in a more user friendly way
	 * 
	 * @param {String} name 
	 */
	static printCountry(name) {
		if (this.exist(name)) {
			console.log(Country.countryList[name]);
		}
	}

	/**
	 * @param {String} color
	 * @returns {String} countryName : Name of the country associated with the given color. Returns null if no country has this color.
	 */
	static findNameByColor(color) {
		for (let countryName in Country.countryList) {
			if (Country.countryList[countryName].color == color) {
				return countryName;
			}
		}
		return null;
	}

	/**
	 * @param {String} color
	 * @returns {Country} Country associated with the given color. Returns null if no country has this color.
	 */
	static findByColor(color) {
		for (let countryName in Country.countryList) {
			if (Country.countryList[countryName].color == color) {
				return Country.countryList[countryName];
			}
		}
		return null;
	}

	/**
	 * For each non-played country, makes it do its battle with the countries with which it is at war
	 */
	static manageWars() {
		for (let countryName in Country.countryList) {
			let country = Country.countryList[countryName];
			let nbEnemies = country.wars.length;
			if (!country.player && nbEnemies > 0) {
				for (let enemyName of country.wars) {
					country.tryAttack(Country.countryList[enemyName], 100 / nbEnemies);
				}
			}
		}
	}

	/**
	 * Initialize every country with their name, army, population, number of territories, and color.
	 */
	static initialize() {
		new Country("Albanie", 8000, 2870324, 4, "#94bd15", "al");
		new Country("Allemagne", 176800, 82740900, 76, "#6c6c6c", "de");
		new Country("Autriche", 21350, 8830487, 16, "#ececec", "at");
		new Country("Belgique", 29600, 11409388, 11, "#9fdb24", "be");
		new Country("Bielorussie", 62000, 9484300, 18, "#ffaec9", "by");
		new Country("Bosnie", 10500, 3511372, 8, "#733373", "ba");
		new Country("Bulgarie", 31300, 7050034, 15, "#a17e80", "bg");
		new Country("Chypre", 12000, 854800, 1, "#cec400", "cy");
		new Country("Croatie", 15550, 4105493, 10, "#79afeb", "hr");
		new Country("Danemark", 16600, 5785864, 11, "#3c4088", "dk");
		new Country("Espagne", 123200, 46659302, 44, "#e7b50c", "es");
		new Country("Estonie", 6400, 1319133, 5, "#3187dd", "ee");
		new Country("Finlande", 22200, 5514997, 18, "#2846ae", "fi");
		new Country("France", 202950, 67247000, 94, "#1432d2", "fr");
		new Country("Grèce", 142950, 10768193, 29, "#4d9ac4", "gr");
		new Country("Hongrie", 26500, 9771000, 14, "#5d9358", "hu");
		new Country("Irlande", 9100, 4792500, 10, "#5bff53", "ie");
		new Country("Islande", 3962, 350710, 3, "#b48994", "is");
		new Country("Italie", 174500, 60483973, 47, "#49984c", "it");
		new Country("Kosovo", 2800, 1783531, 2, "#127a9c", "xk");
		new Country("Lettonie", 5310, 1926500, 11, "#c6487d", "lv");
		new Country("Lituanie", 17030, 2800830, 10, "#d9dd31", "lt");
		new Country("Luxembourg", 900, 602005, 1, "#99d9ea", "lu");
		new Country("Macedoine", 8000, 2073702, 3, "#ce93ce", "mk");
		new Country("Malte", 1950, 434403, 1, "#efe4b0", "mt");
		new Country("Moldavie", 5150, 3550900, 4, "#8f87de", "md");
		new Country("Montenegro", 1950, 622359, 2, "#caecf4", "me");
		new Country("Norvège", 24950, 5302778, 13, "#17728f", "no");
		new Country("Pays-Bas", 35410, 17235500, 13, "#dc8a39", "nl");
		new Country("Pologne", 99300, 38422346, 33, "#df7ddf", "pl");
		new Country("Portugal", 29600, 10291027, 13, "#39a065", "pt");
		new Country("République Tchèque", 21950, 10613350, 9, "#e45255", "cz", "Rép.Tchèque");
		new Country("Roumanie", 70500, 19638000, 23, "#889d17", "ro");
		new Country("Royaume-Uni", 152350, 66040229, 48, "#8d0303", "gb", "R.U.");
		new Country("Serbie", 28150, 7001444, 13, "#b65849", "rs");
		new Country("Slovaquie", 15850, 5443120, 6, "#f1fa89", "sk");
		new Country("Slovenie", 7250, 2066880, 3, "#c4ba00", "si");
		new Country("Suède", 29750, 10161797, 20, "#97c6bc", "se");
		new Country("Suisse", 20950, 8492956, 13, "#997a6c", "ch");
		new Country("Turquie", 355200, 80810525, 62, "#445621", "tr");
		new Country("Ukraine", 204000, 42300723, 43, "#dcca60", "ua");

		new Country("Arabie Saoudite", 227000, 33413660, 31, "#43af23", "sa", "Arabie");
		new Country("Armenie", 44800, 2972900, 3, "#ec5f00", "am");
		new Country("Azerbaidjan", 66950, 9898085, 11, "#5e9742", "az");
		new Country("Bahrein", 8200, 1451200, 1, "#14351b", "bh");
		new Country("Emirats Arabes Unis", 63000, 9541615, 3, "#ff577f", "ae", "E.A.U.");
		new Country("Georgie", 20650, 3729600, 11, "#d79595", "ge");
		new Country("Irak", 64000, 39339753, 13, "#c04555", "iq");
		new Country("Iran", 523000, 81598700, 47, "#037500", "ir");
		new Country("Israel", 176500, 8879010, 5, "#27829f", "il");
		new Country("Jordanie", 100500, 10189400, 5, "#6da368", "jo");
		new Country("Koweit", 15500, 4226920, 2, "#9dc82a", "kw");
		new Country("Liban", 60000, 6093509, 4, "#cf6f40", "lb");
		new Country("Oman", 42600, 4590404, 9, "#7296a9", "om");
		new Country("Palestine", 80000, 4780978, 2, "#115b27", "ps");//Arbitrary army (no official number)
		new Country("Qatar", 11800, 2685053, 1, "#5a5a4d", "qa");
		new Country("Syrie", 127500, 18284407, 8, "#bcee11", "sy");
		new Country("Yemen", 20000, 28915284, 17, "#ffbfbf", "ye");


		new Country("Egypte", 438500, 97257200, 49, "#a64839", "eg");
		new Country("Libye", 40000, 6470956, 20, "#b73e3e", "ly");//Arbitrary army (no official number)
		new Country("Tunisie", 35800, 11446300, 10, "#5e3278", "tn");
		new Country("Algérie", 130000, 42545964, 29, "#628699", "dz");
		new Country("Maroc", 195800, 34719600, 29, "#0f6f27", "ma");

		Country.selected = Country.countryList['France'];

	}

	/**
	 * creates a load file (as a String) to load the current game state
	 * 
	 * Broken ? Todo : + Fix it, write a better serialization function, no need to create all the file if there is a good load function 
	 * 				   + create the load function
	 * 
	 */
	static saveList() {
		let str = "function charger(){\n";
		for (let countryName in Country.countryList) {
			let country = Country.countryList[countryName];
			str += "new Country('" + countryName + "'," + country.army + "," + country.population + "," + country.territory + ",'" + country.color + "','" + country.shortName + "'," + country.player + "," + country.turn + ",[";
			for (let enemyName of country.wars) {
				str += "'" + enemyName + "',";
			}
			if (str.slice(-1) == ",") {
				str = str.slice(0, -1);
			}
			str += "]);\n";
		}
		str += "$('body').find('svg:first').remove();$('body').prepend('";
		str += $("#svg").wrap("<p/>").parent().html();
		str += "');}";
		$("#svg").unwrap();
		str = str.replace(/\n/g, "");
		return str;
	}
}
