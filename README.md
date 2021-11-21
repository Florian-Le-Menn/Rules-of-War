# Rules-of-War

This application is a game master tool for playing a conquest game with multiple players. 


## Principles of the game

This is a turn based game where every players will share the same turns. New players can join any time and chose a country that is not taken yet.
Each turn, every player will be able to attack other countries by deploying a percentage of his army. For example they can chose to attack a single country with 100% of their forces or attack 2 countries with 50/50%, 70/30%, etc... or dividing it between even more enemies. The game will prevent any player from using a total of more than 100% per turn.
When an attack is done, both countries armies will fight and suffer army and population losses, but the winner of the battle will also steal some territories and population from the other one.

When every player made their move, the game master can decide to end the turn. At the end of the turn, every country will automatically gain some army depending on their population size, and gain some population depending on their population and territory size. The new turn then beggins and every player can attack again.

When an attack is made, the game considers automatically the attacker to be a player from now on.

Beware, when a non-player country is attacked, it will keep attacking back each turn untill it is completely defeated.

It is up to the game master to decide if a country can only attack border countries, oversea countries or any country. (simulating air deployment) For more flexibility, the game will allow everything.

## Tool guide for the game master

### Countries informations

After clicking on any territory of a country on the map, its informations are shown in the right panel.
The available informations are :
- Population size
- Army size
- Number of territories
- Wether the country is controlled by a player or by the computer

### Battles

To start a battle between two countries, you have to click on the "Attacker" button in the right panel and then on the attacking country on the map, then do the same with the "Defender" button, write the percentage of force the attacker uses, and finally click on the 'Attack' button just below. 

### Trades

Diplomacy between players might lead to trade decisions. As the game master you can make a player give a set amount of territories, population and/or army. When giving territories, the player can decide to also give the population living on these territories or not. You can check the checkbox depending on the case.
Sometimes a war between more than 2 countries can result in weird borders between the winners, you can correct that by making a country give X territories to the other without donation of population, and vice versa.
When giving territories from a country to another you will have to select the specific territories one by one.

## Other

The "Player informations" and "General informations" will generate a report in the web console. (f12 > console)
It will be displayed in a more user friendly way in a future version.