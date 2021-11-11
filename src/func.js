const MAX_SAFE_INTEGER = 9007199254740991;
var nbToGive=0;

function color(atk, def, nb, listConqIni) {
	listConqIni.splice(nb);
	for(var e of listConqIni){
		e[1].setAttribute('style', 'fill:'.concat(atk.color));
	}
	var lisLen=listConqIni.length;
	nb-=lisLen;
	while(nb>0 && lisLen>0){
		var listConq=terProches(atk,def);
		listConq.splice(nb);
		for(var e of listConq){
			e[1].setAttribute('style', 'fill:'.concat(atk.color));
		}
		lisLen=listConq.length;
		nb-=lisLen;
	}
    return nb;//On retourne le nombre de territoires non capturés
}

function terProches(atk,def){
	var list = document.getElementsByTagName('path');
	var colAtk = atk.color;
	var colDef = def.color;
	var listAtk = [];
	var listDef = [];
	var listConq=[];
	var fillPos,i,j,cpt = 0;
	for (i = 0; i < list.length; i = i + 1) {
		fillPos=list[i].getAttribute("style").indexOf("fill:");
		switch (list[i].getAttribute('style').substring(fillPos+5,fillPos+12)) {
		case colDef:
			listDef.push(list[i]);
			break;
		case colAtk:
			listAtk.push(list[i]);
			break;
		default:
			break;
		}
	}
	for (i = 0; i < listDef.length; i = i + 1) {//pour chaque def
		var xDef=parseFloat(listDef[i].getAttribute('d').split(" ")[1].split(",")[0]);
		var yDef=parseFloat(listDef[i].getAttribute('d').split(" ")[1].split(",")[1]);
		var minDist=MAX_SAFE_INTEGER;
		for (j = 0; j < listAtk.length; j = j + 1) {//pour chaque atk
			var xAtk=parseFloat(listAtk[j].getAttribute('d').split(" ")[1].split(",")[0]);
			var yAtk=parseFloat(listAtk[j].getAttribute('d').split(" ")[1].split(",")[1]);
			var dist=(Math.pow(xAtk-xDef,2)+Math.pow(yAtk-yDef,2));
			if(dist<minDist){
				minDist=dist;
			}
		}
		listConq.push([minDist,listDef[i]])
	}
	listConq.sort(sortFunction);
	return listConq;
}
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function iniColors(){
	var list = document.getElementsByTagName('path');
    var i = 0;
    //Pour chaque province, si elle appartient au pays X alors lui donner la couleur de ce pays.
	for (i = 0; i < list.length; i = i + 1) {
		switch (list[i].getAttribute('style').substring(0, 12)) {
		case 'fill:#061a80':
			list[i].setAttribute('style','fill:'.concat(statesList["albanie"].color));
			break;
		case 'fill:#5b8d80':
			list[i].setAttribute('style','fill:'.concat(statesList["grece"].color));
			break;
		case 'fill:#f42400':
			list[i].setAttribute('style','fill:'.concat(statesList["turquie"].color));
			break;
		case 'fill:#f42400':
			list[i].setAttribute('style','fill:'.concat(statesList["chypre"].color));
			break;
		case 'fill:#2ab980':
			list[i].setAttribute('style','fill:'.concat(statesList["bulgarie"].color));
			break;
		case 'fill:#927c00':
			list[i].setAttribute('style','fill:'.concat(statesList["macedoine"].color));
			break;
		case 'fill:#7a1200':
			list[i].setAttribute('style','fill:'.concat(statesList["kosovo"].color));
			break;
		case 'fill:#a4cb80':
			list[i].setAttribute('style','fill:'.concat(statesList["montenegro"].color));
			break;
		case 'fill:#d59f80':
			list[i].setAttribute('style','fill:'.concat(statesList["serbie"].color));
			break;
		case 'fill:#c96a80':
			list[i].setAttribute('style','fill:'.concat(statesList["roumanie"].color));
			break;
		case 'fill:#9eb100':
			list[i].setAttribute('style','fill:'.concat(statesList["moldavie"].color));
			break;
		case 'fill:#fa3e80':
			list[i].setAttribute('style','fill:'.concat(statesList["ukraine"].color));
			break;
		case 'fill:#1e8480':
			list[i].setAttribute('style','fill:'.concat(statesList["bielorussie"].color));
			break;
		case 'fill:#864700':
			list[i].setAttribute('style','fill:'.concat(statesList["lituanie"].color));
			break;
		case 'fill:#802c80':
			list[i].setAttribute('style','fill:'.concat(statesList["lettonie"].color));
			break;
		case 'fill:#493e00':
			list[i].setAttribute('style','fill:'.concat(statesList["estonie"].color));
			break;
		case 'fill:#4f5880':
			list[i].setAttribute('style','fill:'.concat(statesList["finlande"].color));
			break;
		case 'fill:#e7ef00':
			list[i].setAttribute('style','fill:'.concat(statesList["suede"].color));
			break;
		case 'fill:#aae600':
			list[i].setAttribute('style','fill:'.concat(statesList["norvege"].color));
			break;
		case 'fill:#b71b00':
			list[i].setAttribute('style','fill:'.concat(statesList["pologne"].color));
			break;
		case 'fill:#dbba00':
			list[i].setAttribute('style','fill:'.concat(statesList["slovaquie"].color));
			break;
		case 'fill:#61a800':
			list[i].setAttribute('style','fill:'.concat(statesList["hongrie"].color));
			break;
		case 'fill:#c35000':
			list[i].setAttribute('style','fill:'.concat(statesList["republique_tcheque"].color));
			break;
		case 'fill:#124f80':
			list[i].setAttribute('style','fill:'.concat(statesList["autriche"].color));
			break;
		case 'fill:#36ee80':
			list[i].setAttribute('style','fill:'.concat(statesList["croatie"].color));
			break;
		case 'fill:#249f00':
			list[i].setAttribute('style','fill:'.concat(statesList["bosnie"].color));
			break;
		case 'fill:#e1d480':
			list[i].setAttribute('style','fill:'.concat(statesList["slovenie"].color));
			break;
		case 'fill:#73f780':
			list[i].setAttribute('style','fill:'.concat(statesList["italie"].color));
			break;
		case 'fill:#ee0980':
			list[i].setAttribute('style','fill:'.concat(statesList["suisse"].color));
			break;
		case 'fill:#0c3500':
			list[i].setAttribute('style','fill:'.concat(statesList["allemagne"].color));
			break;
		case 'fill:#3d0900':
			list[i].setAttribute('style','fill:'.concat(statesList["danemark"].color));
			break;
		case 'fill:#b10080':
			list[i].setAttribute('style','fill:'.concat(statesList["pays_bas"].color));
			break;
		case 'fill:#186a00':
			list[i].setAttribute('style','fill:'.concat(statesList["belgique"].color));
			break;
		case 'fill:#8c6180':
			list[i].setAttribute('style','fill:'.concat(statesList["luxembourg"].color));
			break;
		case 'fill:#557300':
			list[i].setAttribute('style','fill:'.concat(statesList["france"].color));
			break;
		case 'fill:#432380':
			list[i].setAttribute('style','fill:'.concat(statesList["espagne"].color));
			break;
		case 'fill:#bd3580':
			list[i].setAttribute('style','fill:'.concat(statesList["portugal"].color));
			break;
		case 'fill:#cf8500':
			list[i].setAttribute('style','fill:'.concat(statesList["royaume_uni"].color));
			break;
		case 'fill:#67c280':
			list[i].setAttribute('style','fill:'.concat(statesList["irlande"].color));
			break;
		case 'fill:#6ddd00':
			list[i].setAttribute('style','fill:'.concat(statesList["islande"].color));
			break;
		case 'fill:#30d400':
			list[i].setAttribute('style','fill:'.concat(statesList["chypre"].color));
			break;
		case 'fill:#989680':
			list[i].setAttribute('style','fill:'.concat(statesList["malte"].color));
			break;
		default:
			break;
		}
	}
}
function newTurn(){
	State.manageWars();
	for(var key in statesList){
		state=statesList[key];
		state.turn = 100;
		state.army = parseInt(state.army + state.population / 2000);
		state.population = parseInt(state.population * 1.1);
	};
}
function faireChoisirDonTer(donator,receiver,nb){
	$("#bnDonator").prop("disabled",true);
	$("#bnReceiver").prop("disabled",true);
	$("#bnDonator").removeClass("pressed");
	$("#bnReceiver").removeClass("pressed");
	nbToGive=nb;
	$("#notice").text("Sélectionnez "+nbToGive+" territoires de "+donator.name+" a donner à "+receiver.name);
	$("path").each(function(){
		if($(this).attr('style').substring(5, 12)==donator.color){
			$(this).addClass("givable");
		}
	});
	
	$(".givable").bind("click.givable",eventGiveTerritory);
}
function actualiserInfos(){
	if(State.exist($("#stateField").val())){
		var state=statesList[$("#stateField").val()];
		$("#infoPop").text(state.population);
		$("#infoArmy").text(state.army);
		$("#infoTer").text(state.territory);
		$("#infoPlayer").text(state.player);
	}
}
function saveSVG(){
	var str=$("#svg").wrap("<p/>").parent().html();
	$("#svg").unwrap();
	return str;
}
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}