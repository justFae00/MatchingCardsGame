const cardsContainer = document.getElementsByClassName("cards-container")[0];

//cards start from:
let cardsCount = 4;

//track chosen cards
let chosenCards = [];

//track moves
let movesCounter = 0;
const movesCount = document.getElementById("moves-count");

//track correct guesses
let correctMovesCounter = 0;

let currentLevel = 1;

const nextMatchButton = document.getElementById("next-match-button");

//audio file for flipping the cards
const flipAudio = new Audio();
flipAudio.src = "assets/Card-flip-sound-effect.mp3";

function startMatch() {
  cardsContainer.style.filter = "none";
  nextMatchButton.style.visibility = "hidden";

  placeCards();

  setCardNumber();

  handleCards();

  //L1 => 6, L2 => 8, L3 => 10, L4 => 14, L5 => 18, L6 => 22, L7 => 28, L8 => 36
  cardsCount = cardsCount + Math.floor(cardsCount / 10) * 2 + 2;
}

//creat cards elements and add them to cards-container
function placeCards() {
  for (let index = 0; index < cardsCount; index++) {
    const cardTemp = document.createElement("div");
    cardTemp.className = "card";
    const innerTemp = document.createElement("div");
    innerTemp.className = "card-inner";
    const frontTemp = document.createElement("div");
    frontTemp.className = "card-front";
    const backTemp = document.createElement("div");
    backTemp.className = "card-back";

    innerTemp.appendChild(frontTemp);
    innerTemp.appendChild(backTemp);
    cardTemp.appendChild(innerTemp);
    cardsContainer.appendChild(cardTemp);
  }
}

//assign numbers to cards
function setCardNumber() {
  const cards = document.querySelectorAll(".card");
  const len = Math.floor(cards.length / 2);

  //set an array of numbers containing numbers in range of cards/2
  let numbers = [];

  for (let index = 1; index <= len; index++) {
    numbers.push(index);
  }

  //repeat the numbers
  for (let index = 1; index <= len; index++) {
    numbers.push(index);
  }

  //randomize it
  numbers.sort(() => Math.random() - 0.5);

  //assign a random number to each card
  for (let index = 0; index < cards.length; index++) {
    const cardBack = cards[index].querySelector(".card-back");
    //cardBack.innerHTML = numbers[index];
    cards[index].flippable = true;

    const imgSrc = "assets/" + +numbers[index] + ".jpg";
    const tempImg = document.createElement("img");
    tempImg.className = "card-img";
    tempImg.src = imgSrc;
    cardBack.appendChild(tempImg);

    const cardFront = cards[index].querySelector(".card-front");
    const frontImg = document.createElement("img");
    frontImg.src = "assets/front.jpg";
    cardFront.appendChild(frontImg);
  }
}

//single click handler
function handleCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      flipCard(card);

      //can't click on a single card twice in a row
      if (card.flippable) {
        chosenCards.push(card);
        movesCounter++;
        movesCount.innerHTML = "moves: " + movesCounter;
      }

      card.flippable = false;

      if (chosenCards.length === 2) {
        if (cardsMatch(chosenCards)) {
          //correct guessed cards won't flip
          chosenCards.forEach((card) => (card.flippable = false));
          correctMovesCounter++;

          //reset the array
          chosenCards = [];
        } else {
          //wrong guessed cards are flippable
          chosenCards.forEach((card) => (card.flippable = true));

          setTimeout(() => {
            //reset the cards and array
            chosenCards.forEach((card) => flipCard(card));
            chosenCards = [];
          }, 900);
        }
      }
      //in case more than 2 cards are chosen within 0.9s, ignore the rest.
      else if (chosenCards.length > 2) {
        chosenCards.slice(2).forEach((card) => flipCard(card));

        chosenCards.slice(2).forEach((card) => (card.flippable = true));
      }

      if (correctMovesCounter === Math.floor(cards.length / 2)) {
        setTimeout(() => {
          endMatchMsg();
          if (currentLevel === 8) {
            alert("That's all! Thanks for playing!");
          } else {
            nextMatchButton.style.visibility = "visible";
            cardsContainer.style.filter = "blur(5px)";
            currentLevel++;
          }
        }, 1300);
      }
    });
  });
}

//if card is flippable, flip it back or front
function flipCard(card) {
  const inner = card.querySelector(".card-inner");

  if (card.flippable) {
    flipAudio.play();

    if (inner.style.transform === "rotateY(180deg)") {
      inner.style.transform = "";
    } else {
      inner.style.transform = "rotateY(180deg)";
    }
  }
}

//check if cards match
function cardsMatch(chosenCards) {
  return (
    chosenCards[0].querySelector(".card-back").innerHTML ===
    chosenCards[1].querySelector(".card-back").innerHTML
  );
}

//delete cards and reset variables
function clearAll() {
  const tempCards = document.querySelectorAll(".card");
  for (const element of tempCards) {
    element.remove();
  }

  chosenCards = [];

  movesCounter = 0;
  movesCount.innerHTML = "moves: " + movesCounter;

  correctMovesCounter = 0;
}

//alert a massage based on moves (less the better)
function endMatchMsg() {
  const cards = document.querySelectorAll(".card");

  if (movesCounter === cards.length) {
    alert("Perfection!");
  } else if (movesCounter <= cards.length * 2) {
    alert("Great job!");
  } else {
    alert("Well done!");
  }
}

//next match button to proceed
nextMatchButton.addEventListener("click", function () {
  clearAll();
  startMatch();
});

startMatch();
