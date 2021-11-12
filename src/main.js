let turn = 1;

/**
 * Listener binded to all givable territories when the user has to select some
 * 
 * Give the selected territory from the donor to the receiver
 */
let eventGiveTerritory = function () {
	$(this).attr('style', 'fill:'.concat(countryList[$("#btn-country-receiver").text()].color));
	nbToGive--;
	if (nbToGive == 0) {
		$("#notice").text("");
		$("#btn-country-donator").prop("disabled", false);
		$("#btn-country-receiver").prop("disabled", false);
		// Cancelling the listener
		$(".givable").unbind("click.givable");
		$(".givable").each(function () {
			$(this).removeClass("givable");
		});
	} else {
		let territories = nbToGive == 1 ? " territory" : " territories";
		$("#notice").text("Select " + nbToGive + territories + " from " + $("#btn-country-donator").text() + " to give to " + $("#btn-country-receiver").text());
	}
};

function listeners() {
	/**
	 * Listener on the button to start a battle
	 */
	$("#btn-battle").click(function () {
		let atk = countryList[$("#btn-country-attacker").text()];
		let def = countryList[$("#btn-country-defender").text()];
		if (atk.player == false) {
			atk.army += 20000
			atk.player = true;
		}
		atk.tryAttack(def, $("#perc").val());
		refreshInformations();
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
			for (let countryName in countryList) {
				let country = countryList[countryName];
				str += country.toString();
			}
			console.log(str);
		} else if ($("#country-field").text() == "joueurs") {
			str = "Player list :\n";
			for (let countryName in countryList) {
				let country = countryList[countryName];
				if (country.player) {
					str += country.toString();
				}
			}
			console.log(str);
		} else if (Country.exist($("#country-field").text())) {
			console.log(countryList[$("#country-field").text()]);
		}
	});

	/**
	 * Listener on the 'end of turn' button
	 */
	$("#btn-end-turn").click(function () {
		turn += 1;
		$("#turn").text("TURN " + turn);
		newTurn();
		refreshInformations();
	});

	/**
	 * Add or remove the 'pressed' class on the 'pressable' buttons on which we click
	 * 
	 * useful to change style depending on the state of the button
	 */
	$("button.pressable").each(function () {
		$(this).click(function () {
			if ($(this).hasClass("pressed")) {
				$(this).removeClass("pressed");
			} else {
				$("button.pressable").removeClass("pressed");
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
		let country = countryList[countryName];
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
		download(Country.saveList(), "load.js", "");
	});

	/**
	 * Listener on the 'Download PNG' button
	 * 
	 * TODO Fix it (broken)
	 */
	$("#btn-download-image").click(function () {

		//load a svg snippet in the canvas with id = 'drawingArea'
		canvg(document.getElementById('canvas'), $("#svg").wrap("<p/>").parent().html());
		$("#svg").unwrap();
		// the canvas calls to output a png
		let canvas = document.getElementById("canvas");
		let img = canvas.toDataURL("image/png");
		downloadCanvas();
	});


	function downloadImage() {
		document.getElementById('download').click();
	}

	function downloadCanvas() {
		let a = document.getElementById('download');
		let b = a.href;
		a.href = document.getElementsByTagName('canvas')[0].toDataURL();
		downloadImage();
		a.href = b;
	}

	/**
	 * Listener on the territories
	 * 
	 * Display the country informations
	 * If a button is pressed (waiting for a country to be selected), select the country
	 */
	$("path").each(function () {
		$(this).click(function () {
			let fillPos = $(this).attr("style").indexOf("fill:");
			let countryName = Country.findNameByColor($(this).attr("style").substring(fillPos + 5, fillPos + 12));
			let country = countryList[countryName];
			$("#country-field").text(countryName);
			refreshInformations();

			$("button.pressed").text(countryName);
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
	 * Listener on the donation button
	 * 
	 * TODO check if the calculs are good
	 */
	$("#btn-donation").click(function () {
		let donator = countryList[$("#btn-country-donator").text()];
		let receiver = countryList[$("#btn-country-receiver").text()];
		let amountArmy = parseInt($("#soldiers-amount-donation").val());
		let amountTerritory = parseInt($("#territories-amount-donation").val());
		if (amountArmy > 0) {
			donator.donateArmy(receiver, amountArmy);
		}
		if (amountTerritory > 0) {
			donator.donateTerritory(receiver, amountTerritory);
		}
		refreshInformations();
	});

	/**
	 * Copy the informations of the players (in order to paste it directly in a messsage)
	 */
	$("#copy-clipboard-players-informations").click(function () {
		let str = "Player list :\n";
		for (let countryName in countryList) {
			let country = countryList[countryName];
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
		for (let countryName in countryList) {
			let country = countryList[countryName];
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
	$("#btn-invert-attack").click(function () {
		let tmp = $("#btn-country-attacker").text();
		$("#btn-country-attacking").text($("#btn-country-defender").text());
		$("#btn-country-defender").text(tmp);
	});

	/**
	 * Invert the donor and the receiver (useful if a wrong donation has been made)
	 */
	$("#btn-invert-donation").click(function () {
		let tmp = $("#btn-country-donator").text();
		$("#btn-country-donator").text($("#btn-country-receiver").text());
		$("#btn-country-receiver").text(tmp);
	});
}

$(function () {
	//charger();
	Country.initialize();
	iniColors();
	listeners();

	/**
	 * Display a warning message when we reload the page, in order to not lose the game by accident
	 */
	/* TODO Uncomment
		window.onbeforeunload = function () {
			return "Data will be lost if you leave the page, are you sure?";
		}; */


});


