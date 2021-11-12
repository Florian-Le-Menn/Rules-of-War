let countryList = [];
let nbCountries = 0;

/**
 * Represents a country
 */
class Country {
	constructor(name, army, population, territory, color = null, player = false, turn = 100, wars = []) {
		countryList[name] = this;
		nbCountries += 1;
		this.wars = wars;
		this.name = name;
		this.army = army;
		this.population = population;
		this.territory = territory;
		this.turn = turn;
		this.player = player;
		if (color == null) {
			this.color = (nbCountries * 400000).toString(16);
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
		let listConq = VanquishedTerritoriesByDistance(this, enemy);
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
		return (name in countryList);
	}

	/**
	 * Print the country information in the console. TODO display the information in a more user friendly way
	 * 
	 * @param {String} name 
	 */
	static printCountry(name) {
		if (this.exist(name)) {
			console.log(countryList[name]);
		}
	}

	/**
	 * @param {String} color
	 * @returns {String} countryName : Name of the country associated with the given color. Returns null if no country has this color.
	 */
	static findNameByColor(color) {
		for (let countryName in countryList) {
			if (countryList[countryName].color == color) {
				return countryName;
			}
		}
		return null;
	}

	/**
	 * For each non-played country, makes it do its battle with the countries with which it is at war
	 */
	static manageWars() {
		for (let countryName in countryList) {
			let country = countryList[countryName];
			let nbEnemies = country.wars.length;
			if (!country.player && nbEnemies > 0) {
				for (let enemyName of country.wars) {
					country.tryAttack(countryList[enemyName], 100 / nbEnemies);
				}
			}
		}
	}

	/**
	 * Initialize every country with their name, army, population, number of territories, and color.
	 */
	static initialize() {
		countryList = [];
		new Country("Albanie", 8000, 2870324, 4, "#94bd15");
		new Country("Allemagne", 176800, 82740900, 76, "#6c6c6c");
		new Country("Autriche", 21350, 8830487, 16, "#ececec");
		new Country("Belgique", 29600, 11409388, 11, "#9fdb24");
		new Country("Bielorussie", 62000, 9484300, 18, "#ffaec9");
		new Country("Bosnie", 10500, 3511372, 8, "#733373");
		new Country("Bulgarie", 31300, 7050034, 15, "#a17e80");
		new Country("Chypre", 12000, 854800, 1, "#cec400");
		new Country("Croatie", 15550, 4105493, 10, "#79afeb");
		new Country("Danemark", 16600, 5785864, 11, "#3c4088");
		new Country("Espagne", 123200, 46659302, 44, "#e7b50c");
		new Country("Estonie", 6400, 1319133, 5, "#3187dd");
		new Country("Finlande", 22200, 5514997, 18, "#2846ae");
		new Country("France", 202950, 67247000, 94, "#1432d2");
		new Country("Grèce", 142950, 10768193, 29, "#4d9ac4");
		new Country("Hongrie", 26500, 9771000, 14, "#5d9358");
		new Country("Irlande", 9100, 4792500, 10, "#5bff53");
		new Country("Islande", 3962, 350710, 3, "#b48994");
		new Country("Italie", 174500, 60483973, 47, "#49984c");
		new Country("Kosovo", 2800, 1783531, 2, "#127a9c");
		new Country("Lettonie", 5310, 1926500, 11, "#c6487d");
		new Country("Lituanie", 17030, 2800830, 10, "#d9dd31");
		new Country("Luxembourg", 900, 602005, 1, "#99d9ea");
		new Country("Macedoine", 8000, 2073702, 3, "#ce93ce");
		new Country("Malte", 1950, 434403, 1, "#efe4b0");
		new Country("Moldavie", 5150, 3550900, 4, "#8f87de");
		new Country("Montenegro", 1950, 622359, 2, "#caecf4");
		new Country("Norvège", 24950, 5302778, 13, "#17728f");
		new Country("Pays-Bas", 35410, 17235500, 13, "#dc8a39");
		new Country("Pologne", 99300, 38422346, 33, "#df7ddf");
		new Country("Portugal", 29600, 10291027, 16, "#39a065");
		new Country("République Tchèque", 21950, 10613350, 9, "#e45255");
		new Country("Roumanie", 70500, 19638000, 23, "#889d17");
		new Country("Royaume-Uni", 152350, 66040229, 48, "#8d0303");
		new Country("Serbie", 28150, 7001444, 13, "#b65849");
		new Country("Slovaquie", 15850, 5443120, 6, "#f1fa89");
		new Country("Slovenie", 7250, 2066880, 3, "#c4ba00");
		new Country("Suède", 29750, 10161797, 20, "#97c6bc");
		new Country("Suisse", 20950, 8492956, 13, "#997a6c");
		new Country("Turquie", 355200, 80810525, 62, "#445621");
		new Country("Ukraine", 204000, 42300723, 43, "#dcca60");

		new Country("Arabie Saoudite", 227000, 33413660, 31, "#43af23");
		new Country("Armenie", 44800, 2972900, 3, "#ec5f00");
		new Country("Azerbaidjan", 66950, 9898085, 11, "#5e9742");
		new Country("Bahrein", 8200, 1451200, 1, "#14351b");
		new Country("Emirats Arabes Unis", 63000, 9541615, 3, "#ff577f");
		new Country("Georgie", 20650, 3729600, 11, "#d79595");
		new Country("Irak", 64000, 39339753, 13, "#c04555");
		new Country("Iran", 523000, 81598700, 47, "#037500");
		new Country("Israel", 176500, 8879010, 5, "#27829f");
		new Country("Jordanie", 100500, 10189400, 5, "#6da368");
		new Country("Koweit", 15500, 4226920, 2, "#9dc82a");
		new Country("Liban", 60000, 6093509, 4, "#cf6f40");
		new Country("Oman", 42600, 4590404, 9, "#7296a9");
		new Country("Palestine", 80000, 4780978, 2, "#115b27");//Arbitrary army (no official number)
		new Country("Qatar", 11800, 2685053, 1, "#5a5a4d");
		new Country("Syrie", 127500, 18284407, 8, "#bcee11");
		new Country("Yemen", 20000, 28915284, 17, "#ffbfbf");


		new Country("Egypte", 438500, 97257200, 49, "#a64839");
		new Country("Libye", 40000, 6470956, 20, "#b73e3e");//Arbitrary army (no official number)
		new Country("Tunisie", 35800, 11446300, 10, "#5e3278");
		new Country("Algérie", 130000, 42545964, 29, "#628699");
		new Country("Maroc", 195800, 34719600, 29, "#0f6f27");

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
		for (let countryName in countryList) {
			let country = countryList[countryName];
			str += "new Country('" + countryName + "'," + country.army + "," + country.population + "," + country.territory + ",'" + country.color + "'," + country.player + "," + country.turn + ",[";
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
