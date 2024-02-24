//your code here

//your code here
let placedCards = 0;

const whiteBox2List = Array.from(document.querySelectorAll(".whitebox2"));

const draggingInfo = {
    beingDragged: null,
    sourceContainer: null,

    reset: function () {
        this.beingDragged = null;
        this.sourceContainer = null;
    }
}

const cardsList = document.querySelectorAll(".imgsbox");
// for all card images, add drag events listeners
cardsList.forEach((card) => {
    card.addEventListener("dragstart", onCardDragStart);
    card.addEventListener("dragend", onCardDragend);
})

function onCardDragStart(event) {

    draggingInfo.beingDragged = event.target;
    draggingInfo.sourceContainer = event.target.parentElement;

    console.info(draggingInfo);
}
function onCardDragend(event) {

    draggingInfo.reset();
}

const cardDestinationContainersList = document.querySelectorAll("div.placed");
const cardDestinationPlaceholderImages = Array.from(document.querySelector(".typesOfCards").querySelectorAll("img"));

cardDestinationContainersList.forEach((cardHolder) => {
    cardHolder.addEventListener("dragover", onContainerDragover);
    cardHolder.addEventListener("drop", dropOnContainer);
})

function onContainerDragover(event) {
    const container = event.target;
    event.preventDefault();
}
function dropOnContainer(event) {
    event.preventDefault();
    event.stopPropagation();

    const container = event.target.parentElement;
    const droppedCard = draggingInfo.beingDragged;
    console.info("dropping", draggingInfo.beingDragged, "on", container, "event target:", event.target);

    // verify
    const containerType = container.getAttribute("data-forCardType");
    const cardType = droppedCard.getAttribute("data-cardType");

    console.log(containerType, cardType);
    if (containerType === cardType) {

        // dropping is allowed
        // container.lastElementChild.remove();
        // container.replaceChild(droppedCard, container.lastElementChild);
        container.appendChild(droppedCard);
        container.firstElementChild.remove();
        container.classList.add("hold");

        placedCards++;

        checkVictory();
    }

    // otherwise dragend happens
    // draggingInfo.reset();
}

// winning event handling
const victoryContainer = document.querySelector(".won");

const resetButton = victoryContainer.querySelector("button");
resetButton.addEventListener("click", resetGame);

function checkVictory() {
    if (placedCards === 5) {
        victoryContainer.classList.remove("hide");
    }
}
function resetGame() {

    // reset placedCards to 0
    placedCards = 0;

    // reset the deck
    let boxIdx = 0;
    cardsList.forEach((card) => {
        whiteBox2List[boxIdx++].appendChild(card);
    })

    // reset the .placed divs
    for (let idx = 0; idx < 4; idx++) {
        cardDestinationContainersList[idx]
        cardDestinationContainersList[idx].appendChild(cardDestinationPlaceholderImages[idx]);
        cardDestinationContainersList[idx].classList.remove("hold");
    }

    // // hide victory container
    victoryContainer.classList.add("hide");
}

const shuffleButton = document.querySelector("#shuffle");
shuffleButton.addEventListener("click", shuffleCards);

function shuffleCards() {
    let swaps = 0;

    let prevFirst = -1, prevSecond = -1;

    while (swaps < 2) {

        const first_w2_id = getRandomTo4();
        const second_w2_id = getRandomTo4();

        // not picked the same card
        if (first_w2_id === second_w2_id) {
            continue;
        }
        // not undoing the previous swap
        else if ((first_w2_id === prevFirst) && (second_w2_id === prevSecond)) {
            continue;
        }
        else if ((first_w2_id === prevSecond) && (second_w2_id === prevFirst)) {
            continue;
        }
        else {
            const first_whiteBox2 = document.getElementById(`${first_w2_id}`);
            const firstParent = first_whiteBox2.parentElement;

            const second_whiteBox2 = document.getElementById(`${second_w2_id}`);
            const secondParent = second_whiteBox2.parentElement;

            console.info(first_w2_id, second_w2_id);

            firstParent.appendChild(second_whiteBox2);
            secondParent.appendChild(first_whiteBox2);

            prevFirst = first_w2_id;
            prevSecond = second_w2_id;

            swaps++;
        }
    }

    function getRandomTo4() {
        return (Math.floor(Math.random() * 5));
    }
}