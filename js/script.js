/*
Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco (attenzione: non bisogna copiare tutta la cartella dell'esercizio ma solo l'index.html, e le cartelle js/ css/ con i relativi script e fogli di stile, per evitare problemi con l'inizializzazione di git).
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe. Attenzione: nella stessa cella può essere posizionata al massimo una bomba, perciò nell’array delle bombe non potranno esserci due numeri uguali.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina. Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o quando raggiunge il numero massimo possibile di numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
BONUS:
Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
- difficoltà 1 ⇒ 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
- difficoltà 2 ⇒ 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
- difficoltà 3 ⇒ 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;
*/

const eleSelectLevel = document.querySelector('#select-level');
const eleBtnPlay = document.querySelector('#btn-play');
const eleBtnHelp = document.querySelector('#btn-help');
const eleStartScreen = document.querySelector('.start-screen');
const eleGrid = document.querySelector('.grid');
let arrMines;
let score;
let maxScore;


eleBtnPlay.addEventListener('click', function () {
	score = 0; // inizializzo score ad ogni nuovo gioco
	const nCells = parseInt(eleSelectLevel.value);
	const nMines = 16;
	maxScore = nCells - nMines;
	arrMines = generateMines(nMines, 1, nCells);
	console.log(arrMines.sort((a, b) => a - b));

	// pulire la griglia ad ogni cambio di livello
	eleGrid.innerHTML = '';

	eleGrid.classList.remove('hidden');
	eleStartScreen.classList.add('hidden');

	const sideSquare = Math.sqrt(nCells);
	eleGrid.style.setProperty('--sideSquare', sideSquare);

	for (let i = 1; i <= nCells; i++) {
		const eleCell = document.createElement('div');
		eleCell.classList.add('cell');
		eleCell.innerHTML = i;
		eleGrid.append(eleCell);

		eleCell.addEventListener('click', toggleCell);
	}
});

eleBtnHelp.addEventListener('click', function () {
	if (eleBtnHelp.dataset.function == 'show-help') {
		eleBtnHelp.innerHTML = 'Back to game';
		eleBtnHelp.dataset.function = 'show-game';
		eleGrid.classList.add('hidden');
		eleStartScreen.classList.remove('hidden');
	} else if (eleBtnHelp.dataset.function == 'show-game') {
		eleBtnHelp.innerHTML = 'Show help';
		eleBtnHelp.dataset.function = 'show-help';
		eleGrid.classList.remove('hidden');
		eleStartScreen.classList.add('hidden');
	}
});

function toggleCell() {
	// this dentro a questa funzione corrisponde all'elemento a cui
	// determinare il tipo di cella
	const cellNumber = parseInt(this.innerHTML);

	if (arrMines.includes(cellNumber)) { // arrMines.includes(i) // questo funzione grazie al concetto di "clojure" ma se la funzione e' stata definita in uno scope che include la i
		this.classList.add('mine');
		disableAllCells(true);
		alert('Il tuo punteggio e: ' + score);
	} else {
		this.removeEventListener('click', toggleCell); // evitiamo di accumulare punteggio cliccando su celle gia' aperte
		score++; // incremento score al ogni click di cella senza bomba
		this.classList.add('no-mine');
		if (score == maxScore) {
			disableAllCells(false);
			alert('Complimenti hai vinto! Il tuo punteggio e: ' + score);
		}
	}
}

function generateMines(nMines, min, max) {
	const arrRandoms = [];
	for (let i = 0; i < nMines; i++) {
		do {
			randomNumber = getRandomInteger(min, max);
		} while (arrRandoms.includes(randomNumber))
		arrRandoms.push(randomNumber);
	}
	return arrRandoms;
}

function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function disableAllCells(showMines) {
	const listCells = eleGrid.querySelectorAll('.cell');
	// console.log(listCells);
	for (let i = 0; i < listCells.length; i++) {
		// se e' una bomba la illumina
		const cellNumber = parseInt(listCells[i].innerHTML);
		// console.log(cellNumber);
		if (showMines && arrMines.includes(cellNumber)) {
			listCells[i].classList.add('mine');
		}
		// toglie l'event listener dalla cella per disattivarla
		listCells[i].removeEventListener('click', toggleCell);
		// console.log('listener rimosso');
	}
}