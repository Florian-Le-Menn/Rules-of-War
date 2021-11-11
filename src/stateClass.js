var statesList=[];
var nbStates=0;

class State{
	constructor(name,army,population,territory,color=null,player=false,turn=100,wars=[]){
		statesList[name]=this;
		nbStates += 1;
		this.wars=wars;
		this.name = name;
		this.army = army;
		this.population = population;
		this.territory = territory;
		this.turn = turn;
		this.player = player;
		if(color==null){
			this.color = (nbStates * 400000).toString(16);
			while (this.color.length < 6) {
				this.color = "0" + this.color;
			}
			this.color = "#" + this.color;
		}else{
			this.color=color;
		}
	}
	static exist(name){
		return (name in statesList);
	}
	static printState(name) {
		console.log(statesList[name]);
	}
	static findNameByColor(color){
		for(var stateName in statesList){
			if(statesList[stateName].color==color){
				return stateName;
			}
		}
		return null;
	}
	static manageWars(){
		for(var stateName in statesList){
			var state=statesList[stateName];
			var nbEnemies=state.wars.length;
			if(!state.player && nbEnemies>0){
				for(var enemyName of state.wars){
					state.tryAttack(statesList[enemyName],100/nbEnemies);
				}
			}
		}
	}
	donateArmy(state,nb){
		var don=Math.min(this.army,nb);
		this.army-=don;
		state.army+=don;
	}
	donateTerritory(state,nb){
		var don=Math.min(this.territory,nb);
		var donPop=parseInt((this.population*don)/this.territory);
		this.territory-=don;
		state.territory+=don;
		if(!$("#cbSansPop").is(":checked")){
			this.population-=donPop;
			state.population+=donPop;
		}
		faireChoisirDonTer(this,state,don);
	}
	addWar(state){
		if(!this.wars.includes(state.name))this.wars.push(state.name);
		if(!state.wars.includes(this.name))state.wars.push(this.name);
	}
	toString(){
		return (this.name + " [Armée = " + this.army + ", Population = " + this.population + ", Territoires = " + this.territory+"]\n");
	}
	paix(enemy){
		this.wars.splice(this.wars.indexOf(enemy.name),1);
		enemy.wars.splice(enemy.wars.indexOf(this.name),1);
	}
	tryAttack(enemy,perc){
		var listConq=terProches(this,enemy);
		if(enemy.army==0 && enemy.territory>0){
			var nbTerWon=enemy.territory;
			this.territory+=enemy.territory;
			enemy.territory=0;
			color(this,enemy,nbTerWon,listConq);
		}else if(enemy.territory > 0 && this.turn>0 && this.territory >0){
			var nbTerWon = this.attack(enemy,perc);
			color(this,enemy,nbTerWon,listConq);
		}
		if(enemy.territory==0){
			this.paix(enemy);
		}
	}
	attack(enemy,perc) {// Return the number of territories won
		console.log(this.name+" attacks "+enemy.name);
		this.addWar(enemy);
		// Before Battle
		perc = Math.min(this.turn, perc);
		var en_army_before_bat = enemy.army;
		var army_before_bat = this.army*perc/100;
		var ter_before_bat = this.territory;

		this.turn -= perc;

		var luck = 1+Math.random() *0.5;// [1-1.5]

		// Battle
		//var loses = parseInt(enemy.army /10*luck);
		var en_loses = parseInt(army_before_bat*luck/10);
		var loses = parseInt(en_loses*(0.5+Math.random() *0.5));
		loses = Math.min(army_before_bat, loses);
		en_loses = Math.min(enemy.army, en_loses);

		this.army-=loses;
		enemy.army-=en_loses;

		// After Battle
		luck = 1+Math.random() *0.5;// [1-1.5]
		var gain_ter = Math.min(enemy.territory,parseInt((en_loses / en_army_before_bat) * enemy.territory*luck));
		
		var gain_pop = parseInt((gain_ter / enemy.territory) * enemy.population);
		
		this.population += gain_pop;
		enemy.population -= gain_pop;

		this.territory += gain_ter;
		enemy.territory -= gain_ter;

		console.log("gain_ter : "+gain_ter+"\ngain_pop : "+gain_pop+"\nloses : "+loses+"\nen_loses : "+en_loses);
		if(enemy.territory==0 && enemy.player==true){
			enemy.player=false;
		}
		return gain_ter;
	}
	
	static initialize() {
		statesList=[];
		new State("Albanie", 8000, 2870324, 4, "#94bd15");
		new State("Allemagne", 176800, 82740900, 76, "#6c6c6c");
		new State("Autriche", 21350, 8830487, 16, "#ececec");
		new State("Belgique", 29600, 11409388, 11, "#9fdb24");
		new State("Bielorussie", 62000, 9484300, 18, "#ffaec9");
		new State("Bosnie", 10500, 3511372, 8, "#733373");
		new State("Bulgarie", 31300, 7050034, 15, "#a17e80");
		new State("Chypre", 12000, 854800, 1, "#cec400");
		new State("Croatie", 15550, 4105493, 10, "#79afeb");
		new State("Danemark", 16600, 5785864, 11, "#3c4088");
		new State("Espagne", 123200, 46659302, 44, "#e7b50c");
		new State("Estonie", 6400, 1319133, 5, "#3187dd");
		new State("Finlande", 22200, 5514997, 18, "#2846ae");
		new State("France", 202950, 67247000, 94, "#1432d2");
		new State("Grèce", 142950, 10768193, 29, "#4d9ac4");
		new State("Hongrie", 26500, 9771000, 14, "#5d9358");
		new State("Irlande", 9100, 4792500, 10, "#5bff53");
		new State("Islande", 3962, 350710, 3, "#b48994");
		new State("Italie", 174500, 60483973, 47, "#49984c");
		new State("Kosovo", 2800, 1783531, 2, "#127a9c");
		new State("Lettonie", 5310, 1926500, 11, "#c6487d");
		new State("Lituanie", 17030, 2800830, 10, "#d9dd31");
		new State("Luxembourg", 900, 602005, 1, "#99d9ea");
		new State("Macedoine", 8000, 2073702, 3, "#ce93ce");
		new State("Malte", 1950, 434403, 1, "#efe4b0");
		new State("Moldavie", 5150, 3550900, 4, "#8f87de");
		new State("Montenegro", 1950, 622359, 2, "#caecf4");
		new State("Norvège", 24950, 5302778, 13, "#17728f");
		new State("Pays-Bas", 35410, 17235500, 13, "#dc8a39");
		new State("Pologne", 99300, 38422346, 33, "#df7ddf");
		new State("Portugal", 29600, 10291027, 16, "#39a065");
		new State("République Tchèque", 21950, 10613350, 9, "#e45255");
		new State("Roumanie", 70500, 19638000, 23, "#889d17");
		new State("Royaume-Uni", 152350, 66040229, 48, "#8d0303");
		new State("Serbie", 28150, 7001444, 13, "#b65849");
		new State("Slovaquie", 15850, 5443120, 6, "#f1fa89");
		new State("Slovenie", 7250, 2066880, 3, "#c4ba00");
		new State("Suède", 29750, 10161797, 20, "#97c6bc");
		new State("Suisse", 20950, 8492956, 13, "#997a6c");
		new State("Turquie", 355200, 80810525, 62, "#445621");
		new State("Ukraine", 204000, 42300723, 43, "#dcca60");
		
		new State("Arabie Saoudite",227000,33413660,31,"#43af23");
		new State("Armenie",44800,2972900,3,"#ec5f00");
		new State("Azerbaidjan",66950,9898085,11,"#5e9742");
		new State("Bahrein",8200,1451200,1,"#14351b");
		new State("Emirats Arabes Unis",63000,9541615,3,"#ff577f");
		new State("Georgie",20650,3729600,11,"#d79595");
		new State("Irak",64000,39339753,13,"#c04555");
		new State("Iran",523000,81598700,47,"#037500");
		new State("Israel",176500,8879010,5,"#27829f");
		new State("Jordanie",100500,10189400,5,"#6da368");
		new State("Koweit",15500,4226920,2,"#9dc82a");
		new State("Liban",60000,6093509,4,"#cf6f40");
		new State("Oman",42600,4590404,9,"#7296a9");
		new State("Palestine",80000,4780978,2,"#115b27");//Arbitrary army (no official number)
		new State("Qatar",11800,2685053,1,"#5a5a4d");
		new State("Syrie",127500,18284407,8,"#bcee11");
		new State("Yemen",20000,28915284,17,"#ffbfbf");
		
		
		new State("Egypte",438500,97257200,49,"#a64839");
		new State("Libye",40000,6470956,20,"#b73e3e");//Arbitrary army (no official number)
		new State("Tunisie",35800,11446300,10,"#5e3278");
		new State("Algérie",130000,42545964,29,"#628699");
		new State("Maroc",195800,34719600,29,"#0f6f27");
		
	}
	static saveList(){
		var str="function charger(){\n";
		for(var stateName in statesList){
			var state=statesList[stateName];
			str+="new State('"+stateName+"',"+state.army+","+state.population+","+state.territory+",'"+state.color+"',"+state.player+","+state.turn+",[";
			for(var enemyName of state.wars){
				str+="'"+enemyName+"',";
			}
			if(str.slice(-1)==","){
				str=str.slice(0,-1);
			}
			str+="]);\n";
		}
		str+="$('body').find('svg:first').remove();$('body').prepend('";
		str+=$("#svg").wrap("<p/>").parent().html();
		str+="');}";
		$("#svg").unwrap();
		str=str.replace(/\n/g,"");
		return str;
	}
}
