$(function () {
	//charger();
	Country.initialize();
	iniColors();
	listeners();
	refreshInformations();

	/**
	 * Display a warning message when we reload the page, in order to not lose the game by accident
	 */
	window.onbeforeunload = function () {
		return "Data will be lost if you leave the page, are you sure?";
	};
});


