// buttons
const resetButton = document.getElementById('reset-button');
const randomButton = document.getElementById('random-button');
//const revealButton = document.getElementById('reveal-button');
// temp div (to be deleted)
const currentSpellDiv = document.getElementById('current-spell');
// divs and emojis
const guessContainer = document.querySelector('.guess-container');
const emoji1 = document.getElementById('emoji1');
const emoji2 = document.getElementById('emoji2');
const emoji3 = document.getElementById('emoji3');
const emoji4 = document.getElementById('emoji4');
const emoji5 = document.getElementById('emoji5');
const winInfo = document.getElementById('win-info');
// input form
const wizardleForm = document.getElementById('wizardle-form');
// emoji sources
const BLANK_SRC = "./assets/blacksquare.png";
const CHECK_SRC = "./assets/check.png";
const X_SRC = "./assets/x.png";
const UP_SRC = "./assets/uparrow.png";
const DOWN_SRC = "./assets/downarrow.png";
const PUNCTUATION = "['‘’!.&]";

// X pip spells have a specific pip cost so theyre always higher
const X_PIP_COST = 14;
var currentSpell = {name: 'Default Spell', pipCost: 0};
var spellList = [];

// game vars
let numOfGuesses = 0;

function roll(event) {

    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }

    numOfGuesses = 0;
    currentSpell = getRandomSpell();
    winInfo.textContent = '';
    
    if (currentSpellDiv.textContent != '') {
        currentSpellDiv.textContent = currentSpell.name;
    }

    // reveal randomstart button if hidden
    if (randomButton.hidden) randomButton.hidden = false;

    // reset emoji game IF IT IS NOT RESET
    if (emoji1.src.includes('blacksquare')) return;

    // initial 5 img return to blank
    emoji1.src = BLANK_SRC;
    emoji2.src = BLANK_SRC;
    emoji3.src = BLANK_SRC;
    emoji4.src = BLANK_SRC;
    emoji5.src = BLANK_SRC;

    // remove everything from guessContainer except for first 
    // row and titles
    while (guessContainer.childNodes.length > 4) {
        guessContainer.removeChild(guessContainer.lastChild);
    }

    // delete last child of last child, which is name with first guess
    // deleting name specifically because first row is not deleted
    guessContainer.lastChild.removeChild(guessContainer.lastChild.lastChild)
}

/** Returns true if given value is numeric or 'X' */
function isPipValue(value) {
    return (!isNaN(value) || value == 'X');
}

/** Takes value and returns given value or the value of X_PIP_COST if value is 'X' */
function getPipValue(value) {
    return parseInt((value == 'X') ? X_PIP_COST : value);
}

/** Sets up game */
function setupGame() {
    MainGame.forEach(insertSpell);

    currentSpell = getRandomSpell();
}

/** Puts spell into spellList */
function insertSpell(item) {

    let pipCostPos = - 1;
    let name = '';
    let pipCost;
    let element;    
    let accuracy;
    let isShad;
    let arcObtained;

    const itemSplit = item.split(' ');

    for (let i=0; i<itemSplit.length; i++) {

        if (isPipValue(itemSplit[i])) {
            pipCostPos = i;
            pipCost = getPipValue(itemSplit[i]);
            break;
        }
        name += itemSplit[i] + " ";
    }
    name = name.substring(0, name.length-1); // chop off last space

    // order is:
    // Name PipCost Element Accuracy IsShad ArcObtained

    element = itemSplit[pipCostPos+1];
    accuracy = itemSplit[pipCostPos+2];
    isShad = itemSplit[pipCostPos+3];
    arcObtained = itemSplit[pipCostPos+4];

    const spell = {
        name: name,
        pipCost: pipCost,
        element: element,
        accuracy: accuracy,
        isShad: isShad,
        arcObtained: arcObtained
    };

    spellList.push(spell);
}

function getRandomNum(cap) {
    return Math.floor(Math.random() * cap);
}

function getRandomSpell() {
    return spellList[getRandomNum(spellList.length)];
}

function editFirstRow(guessedSpell) {

    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }

    // hide randomstart button if not hidden
    if (!randomButton.hidden) randomButton.hidden = true;

    // Divs
    const guessName = document.createElement('div');
    guessName.classList.add('guess-names');

    const emojiContainer = document.querySelector('.emoji-container');

    // give guessName div the name of guess
    guessName.textContent = guessedSpell.name;

    emoji1.src = (currentSpell.element == guessedSpell.element) ? CHECK_SRC : X_SRC;
    emoji2.src = (currentSpell.pipCost < guessedSpell.pipCost) ? DOWN_SRC : (currentSpell.pipCost == guessedSpell.pipCost) ? CHECK_SRC : UP_SRC;
    emoji3.src = (currentSpell.accuracy < guessedSpell.accuracy) ? DOWN_SRC : (currentSpell.accuracy == guessedSpell.accuracy) ? CHECK_SRC : UP_SRC;
    emoji4.src = (currentSpell.isShad == guessedSpell.isShad) ? CHECK_SRC : X_SRC;
    emoji5.src = (currentSpell.arcObtained < guessedSpell.arcObtained) ? DOWN_SRC : (currentSpell.arcObtained == guessedSpell.arcObtained) ? CHECK_SRC : UP_SRC;

    // add guessName to emojiContainer
    emojiContainer.appendChild(guessName);

    checkwin(emoji1, emoji2, emoji3, emoji4, emoji5, guessedSpell);

    wizardleForm.guess.value = '';
}

/** Adds guess to list if available */
function addGuess(event) {
    event.preventDefault();
    
    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }
    
    const guess = wizardleForm.guess.value;
    const guessedSpell = getSpellFromName(guess);
    
    // Nothing happens if spell does not exist
    if (guessedSpell.name == 'Default Spell') return;
    
    // hide randomstart button if not hidden
    if (!randomButton.hidden) randomButton.hidden = true;
    
    numOfGuesses++;
    
    if (numOfGuesses == 1) {
        editFirstRow(guessedSpell);
        return;
    }

    // Divs
    const emojiContainer = document.createElement('div');
    emojiContainer.classList.add('emoji-container');
    
    const emojiRow = document.createElement('div');
    emojiRow.classList.add('emoji-row');
    
    const guessName = document.createElement('div');
    guessName.classList.add('guess-names');
    
    // Imgs    
    const elementImg = document.createElement('img');
    elementImg.classList.add('emoji-img')
    
    const pipCostImg = document.createElement('img');
    pipCostImg.classList.add('emoji-img')
    
    const accuracyImg = document.createElement('img');
    accuracyImg.classList.add('emoji-img')
    
    const usesShadowImg = document.createElement('img');
    usesShadowImg.classList.add('emoji-img')
    
    const arcObtainedImg = document.createElement('img');
    arcObtainedImg.classList.add('emoji-img')
    
    // give srcs for imgs
    elementImg.src = (currentSpell.element == guessedSpell.element) ? CHECK_SRC : X_SRC;
    pipCostImg.src = (currentSpell.pipCost < guessedSpell.pipCost) ? DOWN_SRC : (currentSpell.pipCost == guessedSpell.pipCost) ? CHECK_SRC : UP_SRC;
    accuracyImg.src = (currentSpell.accuracy < guessedSpell.accuracy) ? DOWN_SRC : (currentSpell.accuracy == guessedSpell.accuracy) ? CHECK_SRC : UP_SRC;
    usesShadowImg.src = (currentSpell.isShad == guessedSpell.isShad) ? CHECK_SRC : X_SRC;
    arcObtainedImg.src = (currentSpell.arcObtained < guessedSpell.arcObtained) ? DOWN_SRC : (currentSpell.arcObtained == guessedSpell.arcObtained) ? CHECK_SRC : UP_SRC;
    
    // give guessName div the name of guess
    guessName.textContent = guessedSpell.name;
    
    // add imgs to emoji container
    emojiRow.appendChild(elementImg);
    emojiRow.appendChild(pipCostImg);
    emojiRow.appendChild(accuracyImg);
    emojiRow.appendChild(usesShadowImg);
    emojiRow.appendChild(arcObtainedImg);
    
    // add emoji row to emoji container
    emojiContainer.appendChild(emojiRow);
    
    // add guessName div to emoji container
    emojiContainer.appendChild(guessName);
    
    // add emoji container to guess container
    guessContainer.appendChild(emojiContainer);
    
    
    checkwin(elementImg, pipCostImg, accuracyImg, usesShadowImg, arcObtainedImg, guessedSpell);
    
    wizardleForm.guess.value = '';
}

function getSpellFromName(name) {

    // get random spell
    /*if (name == "random") {
        return getRandomSpell();
    }*/

    // spell name removing punctuation
    const givenName = name.replace(/['‘’!.&]/g,'');

    if (spellList.length == 0) {
        setupGame();
    }

    for (const spell of spellList) {
        // current spell name from list removing punctuation
        let currentSpellName = spell.name.replace(/['‘’!.&]/g, '');

        // return spell if in list
        if (currentSpellName.toLowerCase() == givenName.toLowerCase())
            return spell;
    }
    // return default spell if spell name doesn't exist
    return {
        name: 'Default Spell'
    };
}

function randomStart() {
    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }
    numOfGuesses++;
    editFirstRow(getRandomSpell());
}

function checkwin(img1, img2, img3, img4, img5, guessedSpell) {

    if (currentSpell.name == guessedSpell.name) {
        winInfo.textContent = `You guessed ${currentSpell.name} in ${numOfGuesses} ${(numOfGuesses==1) ? 'attempt' : 'attempts'}!`;
    }
    // if all characteristics match, but spell does not match (ex: Nature's Wrath and Unicorn)
    else if (img1.src.includes('check') &&
    img2.src.includes('check') &&
    img3.src.includes('check') &&
    img4.src.includes('check') &&
    img5.src.includes('check')) {
        winInfo.textContent = `Unlucky! The game is not over. Is there another ${currentSpell.pipCost} pip ${currentSpell.element} spell?`;
    }
}

function toggleAnswer(event) {
    currentSpellDiv.textContent = currentSpellDiv.textContent == '' ? currentSpell.name : '';
}

resetButton.onclick = roll;
randomButton.onclick = randomStart;
//revealButton.onclick = toggleAnswer;
wizardleForm.onsubmit = addGuess;