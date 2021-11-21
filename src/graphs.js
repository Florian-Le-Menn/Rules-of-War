let chart;
function buildGraph(type = "population", playersOnly = true) {
    let labels = [];
    for (let turn = 0; turn < Country.turn; turn++) {
        labels.push(turn);
    }
    let dataset = [];

    for (let countryName in Country.countryList) {
        let country = Country.countryList[countryName];
        if (playersOnly && !country.player) continue;

        let data;
        switch (type) {
            case "territory": data = country.territoryHistory; break;
            case "army": data = country.armyHistory; break;
            case "population":
            default: data = country.populationHistory; break;
        }
        console.log(data);
        dataset.push({
            label: countryName,
            backgroundColor: country.color,
            borderColor: country.color,
            data: data,
        });
    }

    let data = {
        labels: labels,
        datasets: dataset
    };

    let config = {
        type: 'line',
        data: data,
        options: { animation: false }
    };

    let popChart = Chart.getChart("chart");
    if (popChart != null) popChart.destroy();

    chart = new Chart(
        document.getElementById("chart"),
        config
    );
}