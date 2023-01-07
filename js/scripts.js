// buttons
const resetButton = document.getElementById('reset-button');
const randomButton = document.getElementById('random-button');
const emojiButton = document.getElementById('emoji-button');
// divs and emojis
const guessContainer = document.querySelector('.guess-container');
const emoji1 = document.getElementById('emoji1');
const emoji2 = document.getElementById('emoji2');
const emoji3 = document.getElementById('emoji3');
const emoji4 = document.getElementById('emoji4');
const emoji5 = document.getElementById('emoji5');
const winInfo = document.getElementById('win-info');
const compass = document.getElementById('compass');
// input form
const wizardleForm = document.getElementById('wizardle-form');
const input = document.getElementById('guess-input');
// emoji sources
let BLANK_SRC = "./assets/cards/blacksquare.png";
let CHECK_SRC = "./assets/cards/check.png";
let X_SRC = "./assets/cards/x.png";
let UP_SRC = "./assets/cards/uparrow.png";
let DOWN_SRC = "./assets/cards/downarrow.png";

// boolean to represent whether src is emoji or card
let srcIsEmoji = false;
// punctuation to filter
const PUNCTUATION = "['‘’!.&]";

// X pip spells have a specific pip cost so theyre always higher
const X_PIP_COST = 14;
let spellList = [];
let namesList = [];

// game vars
let numOfGuesses = 0;
let currentSpell = {name: 'Default Spell', pipCost: 0};

function reset(event) {

    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }

    // alert user if game is in specific state, then return and dont reset
    if (winInfo.textContent.includes('Unlucky!')) {
        window.alert("The game is not over yet!\nEven though all characteristics match, the spell is not correct.\nFinish out the game!");
        return;
    }

    // reset game vars
    numOfGuesses = 0;
    currentSpell = getRandomSpell();
    winInfo.textContent = '';

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

    clearNames()
    
    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }
    
    const guess = wizardleForm.guess.value;
    const guessedSpell = getSpellFromName(guess);
    
    // Nothing happens if spell does not exist
    if (guessedSpell.name == 'Default Spell') {
        return;
    }
    
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

    window.scrollBy(0, (srcIsEmoji ? 75 : 114)+50);
}

// autocomplete on input form
input.addEventListener("keyup", (e) => {

    // initialze namesList if first entry
    if (namesList.length == 0) {
        setupNamesList();
    }

    // clear anything in list
    clearNames()

    for (let name of namesList) {

        if (startsWithIgnorePunct(name, input.value) &&
        input.value != '') {
            // li element
            let listItem = document.createElement('li');

            // common class name
            listItem.classList.add('list-items');
            listItem.style.cursor = 'pointer';
            listItem.setAttribute('onclick', `insertNameInField("${name}")`);

            // bolding matched letters
            // accounting for punctuation
            let position = getPosWithPunct(name, input.value);
            let word = `<b>${name.substr(0, position)}</b>`;
            word += name.substr(position);

            // display word in list
            listItem.innerHTML = word;
            document.querySelector('.list').appendChild(listItem);
        }
    }
});

/** js startsWith() function but it ignores these punctuation */
function startsWithIgnorePunct(str, val) {
    str = str.replace(/['‘’!.&]/g, '').toLowerCase();
    val = val.replace(/['‘’!.&]/g, '').toLowerCase();
    return str.startsWith(val);
}

/** returns position of end of partialString compared to fullString ignoring punctuation

   Ex: (Dr. Von's Monster) (dr vons mo) -> returns 12 as the string 'dr vons mo' has 
   a length of 10 and there are 2 punctuation in the fullString at that point, (. and ')
*/
function getPosWithPunct(fullString, partialString) {
    fullString = fullString.toLowerCase()
    partialString = partialString.toLowerCase()

    let punctCount = 0;
    let fCursor = 0

    for (let pCursor = 0; pCursor < fullString.length; pCursor++) {
        if (partialString[pCursor] == undefined) break;
        if (fullString[fCursor] != partialString[pCursor]) {
            punctCount++;
            fCursor++;
        }
        fCursor++;
    }

    return punctCount + partialString.length;
}

// update input field value
function insertNameInField(value) {
    input.value = value;
    input.focus();
}

// remove all names in list
function clearNames() {
    // clears auto fill
    let items = document.querySelectorAll('.list-items');
    items.forEach((item) => {
        item.remove();
    });
}

function setupNamesList() {

    if (currentSpell.name == 'Default Spell') {
        setupGame();
    }

    for (let spell of spellList) {
        namesList.push(spell.name);
    }
    namesList.sort();
}

// returns true if spell names are equal ignoring caps and punctuation
function spellNamesEqual(name1, name2) {
    name1 = name1.replace(/['‘’!.&]/g, '').toLowerCase();
    name2 = name2.replace(/['‘’!.&]/g, '').toLowerCase();
    return (name1 == name2)
}

function getSpellFromName(name) {

    if (spellList.length == 0) {
        setupGame();
    }

    for (const spell of spellList) {
        // current spell name from list removing punctuation
        let currentSpellName = spell.name;

        // return spell if in list
        if (spellNamesEqual(name, currentSpellName))
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

function toggleEmojis() {

    // vars for both emoji and card css properties
    const bigTitleGap = '30px';
    const smallTitleGap = '10px';
    const bigContainerWidth = '510px';
    const smallContainerWidth = '415px';
    const bigImgHeight = '143px';
    const bigImgWidth = '94px';
    const smallImgHeight = '75px';
    const smallImgWidth = '75px';

    // change sources
    swapSources()

    // get root to access and modify data
    const root = document.querySelector(':root');

    // if going from emoji to card
    if (srcIsEmoji) {
        root.style.setProperty('--titleGap', bigTitleGap);
        root.style.setProperty('--containerWidth', bigContainerWidth);
        root.style.setProperty('--imgHeight', bigImgHeight);
        root.style.setProperty('--imgWidth', bigImgWidth);
    }
    else { // if going from card to emoji
        root.style.setProperty('--titleGap', smallTitleGap);
        root.style.setProperty('--containerWidth', smallContainerWidth);
        root.style.setProperty('--imgHeight', smallImgHeight);
        root.style.setProperty('--imgWidth', smallImgWidth);
    }

    // toggle boolean
    srcIsEmoji = !srcIsEmoji;
}

function swapSources() {
    
    // update sources of future imgs
    
    // change sources
    if (CHECK_SRC.includes('cards')) {
        BLANK_SRC = BLANK_SRC.replace('cards', 'emojis');
        CHECK_SRC = CHECK_SRC.replace('cards', 'emojis');
        X_SRC = X_SRC.replace('cards', 'emojis');
        UP_SRC = UP_SRC.replace('cards', 'emojis');
        DOWN_SRC = DOWN_SRC.replace('cards', 'emojis');
    }
    else {
        BLANK_SRC = BLANK_SRC.replace('emojis', 'cards');
        CHECK_SRC = CHECK_SRC.replace('emojis', 'cards');
        X_SRC = X_SRC.replace('emojis', 'cards');
        UP_SRC = UP_SRC.replace('emojis', 'cards');
        DOWN_SRC = DOWN_SRC.replace('emojis', 'cards');
    }
    
    // update sources of existing imgs

    // grab all emojis
    let emojis = document.querySelectorAll('.emoji-img');
    
    // change all emojis sources
    emojis.forEach(img => {
        if (srcIsEmoji) {
            img.src = img.src.replace('emojis', 'cards');
        }
        else {
            img.src = img.src.replace('cards', 'emojis');
        }
    });
}

// toggles compass from off to on on mouse enter/exit
function toggleCompass() {
    compass.src = compass.src.includes('compasson') ? "./assets/compassoff.png" : "./assets/compasson.png";
}

resetButton.onclick = reset;
randomButton.onclick = randomStart;
emojiButton.onclick = toggleEmojis;
wizardleForm.onsubmit = addGuess;
compass.onmouseenter = toggleCompass;
compass.onmouseleave = toggleCompass;
