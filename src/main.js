var tour=1;
var eventGiveTerritory = function() {
	$(this).attr('style','fill:'.concat(statesList[$("#bnReceiver").text()].color));
	nbToGive-=1;
	if(nbToGive==0){
		$("#notice").text("");
		$("#bnDonator").prop("disabled",false);
		$("#bnReceiver").prop("disabled",false);
		// Cancelling the listener
		$(".givable").unbind("click.givable");
		$(".givable").each(function(){
			$(this).removeClass("givable");
		});
	}else{
		$("#notice").text("Sélectionnez "+nbToGive+" territoires de "+$("#bnDonator").text()+" a donner à "+$("#bnReceiver").text());
	}
};

$(function(){
	//charger();
	State.initialize();
	//iniColors();
	$("#bnAttack").click(function(){
		var atk = statesList[$("#bnPaysAtk").text()];
		var def = statesList[$("#bnPaysDef").text()];
		if(atk.player==false){
			atk.army+=20000
			atk.player=true;
		}
		atk.tryAttack(def,$("#perc").val());
		actualiserInfos();
	});
	$("#bnInfoOk").click(function(){
		if($("#stateField").val()=="general"){
			str="Liste des pays :\n";
			for(var stateName in statesList){
				var state=statesList[stateName];
				str+=state.toString();
			}
			console.log(str);
		}else if($("#stateField").val()=="joueurs"){
			str="Liste des joueurs :\n";
			for(var stateName in statesList){
				var state=statesList[stateName];
				if(state.player){
					str+=state.toString();
				}
			}
			console.log(str);
		}else if(State.exist($("#stateField").val())){
			console.log(statesList[$("#stateField").val()]);
		}
	});
	
	$("#bnFin").click(function(){
		tour+=1;
		$("#tour").text("TOUR "+tour);
		newTurn();
		actualiserInfos();
	});
	$("button.pressable").each(function(){
		$(this).click(function(){
			if($(this).hasClass("pressed")){
				$(this).removeClass("pressed");
			}else{
				$("button.pressable").removeClass("pressed");
				$(this).addClass("pressed");
			}
		});
	});
	$("#infoPlayer").click(function(){
		var stateName=$("#stateField").text();
		var state=statesList[stateName];
		state.player=!state.player;
		$("#infoPlayer").text(state.player);
	});
	$("#bnDownload").click(function(){
		download(State.saveList(),"load.js","");
	});
	$("#bnImg").click(function() {
		
		//load a svg snippet in the canvas with id = 'drawingArea'
		canvg(document.getElementById('canvas'), $("#svg").wrap("<p/>").parent().html());
		$("#svg").unwrap();
		// the canvas calls to output a png
		var canvas = document.getElementById("canvas");
		var img = canvas.toDataURL("image/png");
		downloadCanvas();
	});
	function downloadImage(){
	document.getElementById('download').click();
	}

	function downloadCanvas(){
	var a = document.getElementById('download');
	var b = a.href;
	a.href = document.getElementsByTagName('canvas')[0].toDataURL();
	downloadImage();
	a.href = b;
	}
	$("path").each(function(){
		$(this).click(function(){
			var fillPos=$(this).attr("style").indexOf("fill:");
			var stateName=State.findNameByColor($(this).attr("style").substring(fillPos+5,fillPos+12));
			var state=statesList[stateName];
			$("#stateField").val(stateName);
			actualiserInfos();
			
			$("button.pressed").text(stateName);
		});
	});
	$("#bnRefresh").click(function(){
		actualiserInfos();
	});
	$("#bnDon").click(function(){
		var donator = statesList[$("#bnDonator").text()];
		var receiver = statesList[$("#bnReceiver").text()];
		var amountArmy = parseInt($("#nbDonArmy").val());
		var amountTerritory = parseInt($("#nbDonTerritory").val());
		if(amountArmy>0){
			donator.donateArmy(receiver,amountArmy);
		}
		if(amountTerritory>0){
			donator.donateTerritory(receiver,amountTerritory);
		}
		actualiserInfos();
	});
	
	window.onbeforeunload = function() {
	  return "Data will be lost if you leave the page, are you sure?";
	};
	$("#copyClipboardPlayers").click(function(){
		var str="Liste des joueurs :\n";
		for(var stateName in statesList){
			var state=statesList[stateName];
			if(state.player){
				str+=state.toString();
			}
		}
		var textArea = document.createElement("textarea");

		textArea.value = str;

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		document.execCommand('copy');

		document.body.removeChild(textArea);
	});
	$("#copyClipboardGeneral").click(function(){
		var str="Liste des joueurs :\n";
		for(var stateName in statesList){
			var state=statesList[stateName];
			str+=state.toString();
		}
		var textArea = document.createElement("textarea");

		textArea.value = str;

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		document.execCommand('copy');

		document.body.removeChild(textArea);
	});
	$("#bnInvertAtk").click(function(){
		var tmp=$("#bnAtk").text();
		$("#bnAtk").text($("#bnDef").text());
		$("#bnDef").text(tmp);
	});
	$("#bnInvertDon").click(function(){
		var tmp=$("#bnDonator").text();
		$("#bnDonator").text($("#bnReceiver").text());
		$("#bnReceiver").text(tmp);
	});
});


