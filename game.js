/*
    The card object is defined like this

    This example is the seven of clubs:
    const card = {
        rank: 7,
        suit: 'clubs'
    }

    Other modifiers like lucky or polychrome are added like this:
    const card = {
        rank: 7,
        suit: 'clubs',
        enhancement: 'lucky',
        edition: 'polychrome'
    }
*/
const displayHand = document.getElementById('card-container')

var gameVars = {
    maxJokers: 5,
    maxHands: 4,
    maxDiscards: 3,
    currentHands: 4,
    currentDiscards: 3,
    handSize: 8,
    money: 4,
    probabilitySkew: 0,
    preferredSort: 'rank',
    gameState: 'none',
    score: 0,
    playedHands: {}
}

let hand = [];
var jokers = [allJokers.raisedFist];

// returns the hand type as a string
function getHandType(playedHand) {
    // we sort the hand by rank to make checking straights easy
    let tempHand = playedHand.sort(function (a, b) {
        if (a.rank < b.rank) {
            return -1; // if the first card is lower than the next it comes before
        }
        if (a.rank > b.rank) {
            return 1; // if the first card is higher than the next it comes after
        }
        return 0; // the ranks are equal
    }).map(value => value);

    // all hands are ordered by pick priority

    // these hands need five cards to be seen
    if (tempHand.length === 5) {
        // check for flush five
        for (i = 1; i < tempHand.length; i++) {
            if (tempHand[i].suit === tempHand[i - 1].suit && tempHand[i].rank === tempHand[i - 1].rank) {
                if (i === tempHand.length - 1) {
                    // every card scores in a flush five
                    for (card of tempHand) {
                        card.scoring = true;
                    }
                    return 'flush five';
                }
            } else if (jokers.includes(allJokers.smearedJoker) &&
                ((tempHand[i].suit === 'hearts' && tempHand[i - 1].suit === 'diamonds') ||
                    (tempHand[i].suit === 'diamonds' && tempHand[i - 1].suit === 'hearts') ||
                    (tempHand[i].suit === 'clubs' && tempHand[i - 1].suit === 'spades') ||
                    (tempHand[i].suit === 'spades' && tempHand[i - 1].suit === 'clubs')) &&
                tempHand[i].rank === tempHand[i - 1].rank
            ) {
                if (i === tempHand.length - 1) {
                    // every card scores in a flush five
                    for (card of tempHand) {
                        card.scoring = true;
                    }
                    return 'flush five';
                }
            } else {
                break;
            }
        }

        // check for flush house
        // toak stands for three of a kind
        let pairSeen = false;
        let toakSeen = false;
        let seenRanks = [];
        for (i = 1; i < tempHand.length; i++) {
            if (tempHand[i].suit !== tempHand[i - 1].suit) {
                if (jokers.includes(allJokers.smearedJoker)) {
                    if (!((tempHand[i].suit === 'hearts' && tempHand[i - 1].suit === 'diamonds') ||
                        (tempHand[i].suit === 'diamonds' && tempHand[i - 1].suit === 'hearts') ||
                        (tempHand[i].suit === 'clubs' && tempHand[i - 1].suit === 'spades') ||
                        (tempHand[i].suit === 'spades' && tempHand[i - 1].suit === 'clubs'))) {
                        pairSeen = false;
                        toakSeen = false;
                        break;
                    }
                } else {
                    pairSeen = false;
                    toakSeen = false;
                    break;
                }
            }

            if (!seenRanks.includes(tempHand[i].rank)) {
                let count = 0;
                for (j = i; j < tempHand.length; j++) {
                    if (tempHand[i - 1].rank === tempHand[j].rank) {
                        count++;
                    }

                    if (j === tempHand.length - 1 && count === 1) {
                        pairSeen = true;
                        seenRanks.push(tempHand[i].rank);
                    } else if (j === tempHand.length - 1 && count === 2) {
                        toakSeen = true;
                        seenRanks.push(tempHand[i].rank);
                    }
                }
            }
        }
        if (toakSeen && pairSeen) {
            // every card scores in a flush house
            for (card of tempHand) {
                card.scoring = true;
            }
            return 'flush house';
        }

        // check for five of a kind
        for (i = 1; i < tempHand.length; i++) {
            if (tempHand[i].rank !== tempHand[i - 1].rank) {
                break;
            } else if (i === tempHand.length - 1) {
                // every card scores in a five of a kind
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'five of a kind';
            }
        }
    }

    if (tempHand.length === 5 || (jokers.includes(allJokers.fourFingers) && playedHand.length >= 4)) {
        // check for straight flush
        for (i = 1; i < tempHand.length; i++) {
            if (i === tempHand.length - 1 && tempHand[i].suit === tempHand[i - 1].suit && tempHand[i].rank === 14 && tempHand[i - 1].rank === 5) {
                // every card scores in a straight flush
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'straight flush';
            } else if (tempHand[i].suit !== tempHand[i - 1].suit || tempHand[i].rank !== tempHand[i - 1].rank + 1) {
                break;
            } else if (i === tempHand.length - 1 && tempHand[tempHand.length - 1].rank === 14) {
                // if the highest card is an ace the hand is a royale flush
                // every card scores in a royale flush
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'royal flush'
            } else if (i === tempHand.length - 1) {
                // every card scores in a straight flush
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'straight flush';
            }
        }
    }

    // four of a kind is here because this is where it falls in priority, but it doesn't need five cards to be played
    // four of a kind
    for (i = 0; i < tempHand.length; i++) {
        let count = 0;
        for (j = i + 1; j < tempHand.length; j++) {
            if (tempHand[i].rank === tempHand[j].rank) {
                count++;
            }

            if (j === tempHand.length - 1 && count === 3) {
                return 'four of a kind';
            }
        }
    }

    // these hands need five cards to be played
    if (tempHand.length === 5 || (jokers.includes(allJokers.fourFingers) && playedHand.length >= 4)) {
        // check for full house
        // toak stands for three of a kind
        let pairSeen = false;
        let toakSeen = false;
        let seenRanks = [];
        for (i = 1; i < tempHand.length; i++) {
            if (!seenRanks.includes(tempHand[i].rank)) {
                let count = 0;
                for (j = i; j < tempHand.length; j++) {
                    if (tempHand[i - 1].rank === tempHand[j].rank) {
                        count++;
                    }

                    if (j === tempHand.length - 1 && count === 1) {
                        pairSeen = true;
                        seenRanks.push(tempHand[i].rank);
                    } else if (j === tempHand.length - 1 && count === 2) {
                        toakSeen = true;
                        seenRanks.push(tempHand[i].rank);
                    }
                }
            }
        }
        if (toakSeen && pairSeen) {
            // every card scores in a full house
            for (card of tempHand) {
                card.scoring = true;
            }
            return 'full house';
        }

        // check for flush
        for (i = 1; i < tempHand.length; i++) {
            if (tempHand[i].suit === tempHand[i - 1].suit) {
                if (i === tempHand.length - 1) {
                    // every card scores in a flush
                    for (card of tempHand) {
                        card.scoring = true;
                    }
                    return 'flush';
                }
            } else if (jokers.includes(allJokers.smearedJoker) &&
                ((tempHand[i].suit === 'hearts' && tempHand[i - 1].suit === 'diamonds') ||
                    (tempHand[i].suit === 'diamonds' && tempHand[i - 1].suit === 'hearts') ||
                    (tempHand[i].suit === 'clubs' && tempHand[i - 1].suit === 'spades') ||
                    (tempHand[i].suit === 'spades' && tempHand[i - 1].suit === 'clubs'))
            ) {
                if (i === tempHand.length - 1) {
                    // every card scores in a flush
                    for (card of tempHand) {
                        card.scoring = true;
                    }
                    return 'flush';
                }
            } else {
                break;
            }
        }

        // check for straight
        for (i = 1; i < tempHand.length; i++) {
            if (i === tempHand.length - 1 && tempHand[i].rank === 14 && tempHand[i - 1].rank === 5) {
                // every card scores in a straight
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'flush';
            } else if (tempHand[i].rank !== tempHand[i - 1].rank + 1) {
                break;
            } else if (i === tempHand.length - 1) {
                // every card scores in a straight
                for (card of tempHand) {
                    card.scoring = true;
                }
                return 'straight';
            }
        }
    }

    // check for three of a kind, two pair, and pair
    let pairCount = 0;
    let foundRanks = [];
    for (i = 0; i < tempHand.length; i++) {
        let count = 0;
        for (j = i + 1; j < tempHand.length; j++) {
            if (tempHand[i].rank === tempHand[j].rank) {
                count++;
            }

            if (j === tempHand.length - 1 && count === 1) {
                pairCount++;
                foundRanks.push(tempHand[i].rank);
            } else if (j === tempHand.length - 1 && count === 2) {
                for (card of tempHand) {
                    if (card.rank === tempHand[i].rank) {
                        card.scoring = true;
                    }
                }
                return 'three of a kind';
            }
        }
    }
    if (pairCount === 2) {
        for (card of tempHand) {
            if (foundRanks.includes(card.rank)) {
                card.scoring = true;
            }
        }
        return 'two pair';
    } else if (pairCount === 1) {
        for (card of tempHand) {
            if (foundRanks.includes(card.rank)) {
                card.scoring = true;
            }
        }
        return 'pair';
    }

    // if nothing passes, return high card
    // the highest played card will score
    tempHand[tempHand.length - 1].scoring = true;
    return 'high card';
}

// count up chips and apply scoring joker effects
function scoreHand(localHand) {
    if (gameVars.currentHands > 0 && localHand.length > 0) {
        // all played cards are unselected and removed from the hand
        for (card of localHand) {
            delete card.selected;
            hand.splice(hand.findIndex(c => c === card), 1);
        }

        console.clear();

        // remove a hand from play
        gameVars.currentHands--;

        // global variables so jokers can access them
        playedHand = localHand;
        // get the hand's score from the score library
        currentScore = { ...handVars[getHandType(playedHand)] };
        console.log(getHandType(playedHand));

        // log the played hand to gameVars
        if (!(getHandType(playedHand) in gameVars.playedHands)) {
            gameVars.playedHands[getHandType(playedHand)] = 0;
        }
        gameVars.playedHands[getHandType(playedHand)]++;

        // sets gameVars.mostPlayedHand to the key that's value is equal to the highest number of hands played
        gameVars.mostPlayedHand = Object.keys(gameVars.playedHands).find(key => gameVars.playedHands[key] === Math.max(...Object.values(gameVars.playedHands)));

        // check if any jokers trigger before score
        for (let joker of jokers) {
            handleJoker(joker, 'beforeScore');
        }

        // handle all held in hand jokers
        for (card of hand) {
            handleHeldCard(card);

            // if it works it works ¯\_(ツ)_/¯
            delete gameVars.retrigger;
        }

        // loop over every card
        for (card of playedHand) {
            // if the card is stone it always scores
            if (card.enhancement === 'stone') {
                card.scoring = true;
            }

            // if the card scores, handle the card
            if (card.scoring) {
                handleCard(card);
            }

            // if it works it works ¯\_(ツ)_/¯
            delete gameVars.retrigger;
        }

        // check if any of the jokers trigger after card scoring
        for (let joker of jokers) {
            handleJoker(joker, 'afterScore');
        }

        // reset all cards
        for (card of playedHand) {
            delete card.scoring;
        }

        // log chips, mult, and score to the console
        console.log(`Chips: ${currentScore.chips}\nMult: ${Number(currentScore.mult.toFixed(2))}\nScore: ${Math.round(currentScore.chips * currentScore.mult)}`);

        // the current score to the round score
        gameVars.score += currentScore.chips * currentScore.mult;
        // check if that's enough to beat the round
        if (gameVars.score >= gameVars.neededScore) {
            // remove the needed score and change the game state
            delete gameVars.neededScore;
            gameVars.gameState = 'roundEnd';
            console.log(`Ending score: ${Math.round(gameVars.score)}`)
            console.log('win!!! yey!!1!!!');

            // run all jokers that are at the end of round
            for (let joker of jokers) {
                handleJoker(joker, 'roundEnd');
            }

            // run all gold cards
            for (card of hand) {
                handleHeldCard(card);
            }
        } else {
            console.log(`Hands left: ${gameVars.currentHands}`);
            console.log(`Score to beat blind: ${gameVars.neededScore}\nCurrent score: ${Math.round(gameVars.score)}`);
            // otherwise deal another hand
            dealHand();
        }
    } else {
        if (localHand.length > 0) {
            console.log('No hands remaining');
        }
    }
}

// discard the hand
function discardHand(localHand) {
    if (gameVars.currentDiscards > 0 && localHand.length > 0) {
        // trigger all onDiscard jokers
        for (let joker of jokers) {
            handleJoker(joker, 'onDiscard');
        }

        // all discarded cards are unselected and removed from the hand
        for (card of localHand) {
            delete card.selected;
            hand.splice(hand.findIndex(c => c === card), 1);
        }

        // remove a hand from play
        gameVars.currentDiscards--;

        // global variables so jokers can access them
        playedHand = localHand;

        // deal another hand
        dealHand();

        console.log(`Discards left: ${gameVars.currentDiscards}`);
    } else {
        if (localHand.length > 0) {
            console.log('No remaining discards');
        }
    }
}

// handles the joker, checks for condition and applies effect
function handleJoker(joker, trigger) {
    if (joker.modifyTrigger === trigger) {
        if ('modifyEffect' in joker) {
            if ('modifyCondition' in joker) {
                if (joker.modifyCondition()) {
                    joker.modifyEffect();
                }
            } else {
                joker.modifyEffect();
            }
        }
    }

    if (joker.trigger === trigger) {
        // the condition statement is inside this if statement so we don't trigger the else statement if the condition isn't met
        if ('condition' in joker) {
            if (joker.condition()) {
                joker.effect();
            }
        } else {
            joker.effect();
        }
    }
}

// handles cards, applies edition and enhancements
function handleCard(card, retrigger) {
    // tell other scripts a retrigger is going on
    if (gameVars.retrigger === undefined) {
        gameVars.retrigger = false;
    } else {
        gameVars.retrigger = retrigger;
    }

    // handle all enhancements
    if ('enhancement' in card) {
        if (card.enhancement === 'mult') {
            currentScore.mult += 4;
        } else if (card.enhancement === 'bonus') {
            currentScore.chips += 30;
        } else if (card.enhancement === 'stone') {
            currentScore.chips += 50;
        } else if (card.enhancement === 'lucky') {
            if (Math.floor(Math.random() * 5) < 1 + gameVars.probabilitySkew) {
                currentScore.mult += 20;

                if (jokers.includes(allJokers.luckyCat)) {
                    if (!('luckyHits') in gameVars || gameVars.luckyHits === undefined) {
                        gameVars.luckyHits = 0;
                    }

                    gameVars.luckyHits++;
                }
            }

            if (Math.floor(Math.random() * 20) < 1 + gameVars.probabilitySkew) {
                gameVars.money += 20;

                if (jokers.includes(allJokers.luckyCat)) {
                    if (!('luckyHits') in gameVars || gameVars.luckyHits === undefined) {
                        gameVars.luckyHits = 0;
                    }

                    gameVars.luckyHits++;
                }
            }
        } else if (card.enhancement === 'glass') {
            currentScore.mult *= 2;

            if (Math.floor(Math.random() * 4) < 1 + gameVars.probabilitySkew) {
                if (!('glassBreaks') in gameVars || gameVars.glassBreaks === undefined) {
                    gameVars.glassBreaks = 0;
                }

                gameVars.glassBreaks++;

                deck.splice(getCardIndex(card.id), 1);
            }
        }
    }

    // handle all editions
    if ('edition' in card) {
        if (card.edition === 'foil') {
            currentScore.chips += 50;
        } else if (card.edition === 'holographic') {
            currentScore.mult += 10;
        } else if (card.edition === 'polychrome') {
            currentScore.mult *= 1.5;
        }
    }

    // if the card isn't a stone card, add the rank to chips
    // we check if the card is enhanced first so the code doesn't break trying to check for a null enhancement
    if (!('enhancement' in card) || card.enhancement !== 'stone') {
        currentScore.chips += card.rank;

        if ('bonusChips' in card) {
            currentScore.chips += card.bonusChips;
        }
    }

    // check if any jokers trigger during card scoring
    for (let joker of jokers) {
        if (joker.retriggering) {
            if (!gameVars.retrigger) {
                handleJoker(joker, 'duringScore');
            }
        } else {
            handleJoker(joker, 'duringScore');
        }
    }

    // handle all seals
    if ('seal' in card) {
        if (card.seal === 'gold') {
            gameVars.money += 3;
        } else if (card.seal === 'red' && !retrigger) {
            handleCard(card, true);
        }
    }
}

// handles cards held in hand
function handleHeldCard(card, retrigger) {
    // tell other scripts a retrigger is going on
    if (gameVars.retrigger === undefined) {
        gameVars.retrigger = false;
    } else {
        gameVars.retrigger = retrigger;
    }

    // handle all enhancements
    if ('enhancement' in card) {
        if (card.enhancement === 'steel') {
            currentScore.mult *= 1.5;
        } else if (card.enhancement === 'gold' && gameVars.gameState === 'roundEnd') {
            gameVars.money += 3
        }
    }

    // check if any jokers trigger during card scoring
    for (let joker of jokers) {
        // all the retrigger nonsense
        if (joker.retriggering) {
            if (!gameVars.retrigger) {
                handleJoker(joker, 'heldInHand');
            }
        } else {
            handleJoker(joker, 'heldInHand');
        }
    }

    // handle all seals
    if ('seal' in card) {
        if (card.seal === 'red' && !retrigger) {
            handleHeldCard(card, true);
        } else if (card.seal === 'blue' && gameVars.gameState === 'roundEnd') {
            // gimme a planet card gang
        }
    }
}

// returns the card's deck index by it's id
function getCardIndex(id) {
    return deck.findIndex(card => card.id === id);
}

// deals a hand
function dealHand() {
    // deal enough cards to make the hand's size equal to the max hand size
    for (i = hand.length; i < gameVars.handSize; i++) {
        // check if there are enough cards to deal
        if (deck.filter(c => !c.dealt).length > 0) {
            // get an id that can be valid
            let id = Math.floor(Math.random() * cardsSpawned);
            // check if that card isn't destroyed or dealt
            if (deck[getCardIndex(id)] && !deck[getCardIndex(id)].dealt) {
                // deal the card
                deck[getCardIndex(id)].dealt = true;
                hand.push(deck[getCardIndex(id)]);
            } else {
                // if the card is destroyed or dealt we rerun this process
                i -= 1;
            }
        }
    }
    // sort hand by the preferred sort
    sortHand(gameVars.preferredSort);
}

// sorts hand by rank or suit
function sortHand(type) {
    displayHand.innerHTML = '';
    if (type === 'rank') {
        gameVars.preferredSort = 'rank';
        hand.sort(function (a, b) {
            if (allSuits.findIndex(suit => suit === a.suit) < allSuits.findIndex(suit => suit === b.suit)) {
                if (a.rank < b.rank) {
                    return 1;
                } else if (a.rank > b.rank) {
                    return -1;
                } else {
                    return -1;
                }
            } else if (allSuits.findIndex(suit => suit === a.suit) > allSuits.findIndex(suit => suit === b.suit)) {
                if (a.rank < b.rank) {
                    return 1;
                } else if (a.rank > b.rank) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (a.rank < b.rank) {
                    return 1;
                } else if (a.rank > b.rank) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
    }
    if (type === 'suit') {
        gameVars.preferredSort = 'suit';
        hand.sort(function (a, b) {
            if (a.rank < b.rank) {
                if (allSuits.findIndex(suit => suit === a.suit) < allSuits.findIndex(suit => suit === b.suit)) {
                    return -1;
                } else if (allSuits.findIndex(suit => suit === a.suit) > allSuits.findIndex(suit => suit === b.suit)) {
                    return 1;
                } else {
                    return 1;
                }
            } else if (a.rank > b.rank) {
                if (allSuits.findIndex(suit => suit === a.suit) < allSuits.findIndex(suit => suit === b.suit)) {
                    return -1;
                } else if (allSuits.findIndex(suit => suit === a.suit) > allSuits.findIndex(suit => suit === b.suit)) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (allSuits.findIndex(suit => suit === a.suit) < allSuits.findIndex(suit => suit === b.suit)) {
                    return -1;
                } else if (allSuits.findIndex(suit => suit === a.suit) > allSuits.findIndex(suit => suit === b.suit)) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }
    for (i = 0; i < hand.length; i++) {
        let template = `<button class="card" id="card-${i}" onclick="function toggleSelectSelf() {
            if (hand.filter(c => c.selected).length < 5 && !hand[${i}].selected) {
                document.getElementById('card-${i}').classList.add('selected');
                hand[${i}].selected = true;
            } else if (hand[${i}].selected) {
                document.getElementById('card-${i}').classList.remove('selected');
                hand[${i}].selected = false;
            }
        } toggleSelectSelf()"><p>`;

        if (hand[i].selected) {
            template = `<button class="card selected" id="card-${i}" onclick="function toggleSelectSelf() {
                if (hand.filter(c => c.selected).length < 5 && !hand[${i}].selected) {
                    document.getElementById('card-${i}').classList.add('selected');
                    hand[${i}].selected = true;
                } else if (hand[${i}].selected) {
                    document.getElementById('card-${i}').classList.remove('selected');
                    hand[${i}].selected = false;
                }
            } toggleSelectSelf()"><p>`;
        }

        if ('edition' in hand[i]) {
            template += `${hand[i].edition} `
        }

        if ('seal' in hand[i]) {
            template += `${hand[i].seal} seal `
        }

        if ('enhancement' in hand[i]) {
            template += `${hand[i].enhancement} `
        }

        if (hand[i].rank === 14) {
            displayHand.innerHTML += `${template}Ace of ${hand[i].suit}</p></button>`
        } else if (hand[i].rank === 13) {
            displayHand.innerHTML += `${template}King of ${hand[i].suit}</p></button>`
        } else if (hand[i].rank === 12) {
            displayHand.innerHTML += `${template}Queen of ${hand[i].suit}</p></button>`
        } else if (hand[i].rank === 11) {
            displayHand.innerHTML += `${template}Jack of ${hand[i].suit}</p></button>`
        } else {
            displayHand.innerHTML += `${template}${hand[i].rank} of ${hand[i].suit}</p></button>`
        }
    }
}

// handle a round
function runRound(neededScore) {
    // run all roundStart jokers
    for (let joker of jokers) {
        handleJoker(joker, 'roundStart');
    }

    console.log(`Hands left: ${gameVars.currentHands}`);
    console.log(`Discards left: ${gameVars.currentDiscards}`);
    console.log(`Score to beat blind: ${neededScore}`);
    // set variables
    gameVars.currentDiscards = gameVars.maxDiscards;
    gameVars.currentHands = gameVars.maxHands;
    gameVars.neededScore = neededScore;
    gameVars.gameState = 'inRound';
    gameVars.score = 0;

    // deal a hand
    dealHand();
}

runRound(300);