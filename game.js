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
var gameVars = {
    maxJokers: 5,
    maxHands: 4,
    maxDiscards: 3,
    currentHands: 4,
    currentDiscards: 3,
    money: 4,
    playedHands: {}
}

let hand = [];
var jokers = [allJokers.sockAndBuskin];

// returns the hand type as a string
function getHandType(playedHand) {
    // we sort the hand by rank to make checking straights easy
    playedHand.sort(function (a, b) {
        if (a.rank < b.rank) {
            return -1; // if the first card is lower than the next it comes before
        }
        if (a.rank > b.rank) {
            return 1; // if the first card is higher than the next it comes after
        }
        return 0; // the ranks are equal
    });

    // all hands are ordered by pick priority

    // these hands need five cards to be seen
    if (playedHand.length === 5) {
        // check for flush five
        for (i = 1; i < playedHand.length; i++) {
            if (playedHand[i].suit !== playedHand[i - 1].suit || playedHand[i].rank !== playedHand[i - 1].rank) {
                break;
            } else if (i === playedHand.length - 1) {
                // every card scores in a flush five
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'flush five';
            }
        }

        // check for flush house
        // toak stands for three of a kind
        let pairSeen = false;
        let toakSeen = false;
        let seenRanks = [];
        for (i = 1; i < playedHand.length; i++) {
            if (playedHand[i].suit !== playedHand[i - 1].suit) {
                pairSeen = false;
                toakSeen = false;
                break;
            }

            if (!seenRanks.includes(playedHand[i].rank)) {
                let count = 0;
                for (j = i; j < playedHand.length; j++) {
                    if (playedHand[i - 1].rank === playedHand[j].rank) {
                        count++;
                    }

                    if (j === playedHand.length - 1 && count === 1) {
                        pairSeen = true;
                        seenRanks.push(playedHand[i].rank);
                    } else if (j === playedHand.length - 1 && count === 2) {
                        toakSeen = true;
                        seenRanks.push(playedHand[i].rank);
                    }
                }
            }
        }
        if (toakSeen && pairSeen) {
            // every card scores in a flush house
            for (card of playedHand) {
                card.scoring = true;
            }
            return 'flush house';
        }

        // check for five of a kind
        for (i = 1; i < playedHand.length; i++) {
            if (playedHand[i].rank !== playedHand[i - 1].rank) {
                break;
            } else if (i === playedHand.length - 1) {
                // every card scores in a five of a kind
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'five of a kind';
            }
        }

        // check for straight flush
        for (i = 1; i < playedHand.length; i++) {
            if (i === playedHand.length - 1 && playedHand[i].suit === playedHand[i - 1].suit && playedHand[i].rank === 14 && playedHand[i - 1].rank === 5) {
                // every card scores in a straight flush
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'straight flush';
            } else if (playedHand[i].suit !== playedHand[i - 1].suit || playedHand[i].rank !== playedHand[i - 1].rank + 1) {
                break;
            } else if (i === playedHand.length - 1 && playedHand[playedHand.length - 1].rank === 14) {
                // if the highest card is an ace the hand is a royale flush
                // every card scores in a royale flush
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'royal flush'
            } else if (i === playedHand.length - 1) {
                // every card scores in a straight flush
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'straight flush';
            }
        }
    }

    // four of a kind is here because this is where it falls in priority, but it doesn't need five cards to be played
    // four of a kind
    for (i = 0; i < playedHand.length; i++) {
        let count = 0;
        for (j = i + 1; j < playedHand.length; j++) {
            if (playedHand[i].rank === playedHand[j].rank) {
                count++;
            }

            if (j === playedHand.length - 1 && count === 3) {
                return 'four of a kind';
            }
        }
    }

    // these hands need five cards to be played
    if (playedHand.length === 5) {
        // check for full house
        // toak stands for three of a kind
        let pairSeen = false;
        let toakSeen = false;
        let seenRanks = [];
        for (i = 1; i < playedHand.length; i++) {
            if (!seenRanks.includes(playedHand[i].rank)) {
                let count = 0;
                for (j = i; j < playedHand.length; j++) {
                    if (playedHand[i - 1].rank === playedHand[j].rank) {
                        count++;
                    }

                    if (j === playedHand.length - 1 && count === 1) {
                        pairSeen = true;
                        seenRanks.push(playedHand[i].rank);
                    } else if (j === playedHand.length - 1 && count === 2) {
                        toakSeen = true;
                        seenRanks.push(playedHand[i].rank);
                    }
                }
            }
        }
        if (toakSeen && pairSeen) {
            // every card scores in a full house
            for (card of playedHand) {
                card.scoring = true;
            }
            return 'full house';
        }

        // check for flush
        for (i = 1; i < playedHand.length; i++) {
            if (playedHand[i].suit !== playedHand[i - 1].suit) {
                break;
            } else if (i === playedHand.length - 1) {
                // every card scores in a flush
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'flush';
            }
        }

        // check for straight
        for (i = 1; i < playedHand.length; i++) {
            if (i === playedHand.length - 1 && playedHand[i].rank === 14 && playedHand[i - 1].rank === 5) {
                // every card scores in a straight
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'flush';
            } else if (playedHand[i].rank !== playedHand[i - 1].rank + 1) {
                break;
            } else if (i === playedHand.length - 1) {
                // every card scores in a straight
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'straight';
            }
        }
    }

    // check for three of a kind, two pair, and pair
    let pairCount = 0;
    let foundRanks = [];
    for (i = 0; i < playedHand.length; i++) {
        let count = 0;
        for (j = i + 1; j < playedHand.length; j++) {
            if (playedHand[i].rank === playedHand[j].rank) {
                count++;
            }

            if (j === playedHand.length - 1 && count === 1) {
                pairCount++;
                foundRanks.push(playedHand[i].rank);
            } else if (j === playedHand.length - 1 && count === 2) {
                for (card of playedHand) {
                    if (card.rank === playedHand[i].rank) {
                        card.scoring = true;
                    }
                }
                return 'three of a kind';
            }
        }
    }
    if (pairCount === 2) {
        for (card of playedHand) {
            if (foundRanks.includes(card.rank)) {
                card.scoring = true;
            }
        }
        return 'two pair';
    } else if (pairCount === 1) {
        for (card of playedHand) {
            if (foundRanks.includes(card.rank)) {
                card.scoring = true;
            }
        }
        return 'pair';
    }

    // if nothing passes, return high card
    // the highest played card will score
    playedHand[playedHand.length - 1].scoring = true;
    return 'high card';
}

// count up chips and apply scoring joker effects
function scoreHand(localHand) {
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

    // log chips, mult, and score to the console
    console.log(`Chips: ${currentScore.chips}\nMult: ${Number(currentScore.mult.toFixed(2))}\nScore: ${Math.round(currentScore.chips * currentScore.mult)}`);
}

// handles the joker, checks for condition and applies effect
function handleJoker(joker, trigger) {
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

    if (joker.modifyTrigger === trigger) {
        if ('modifyCondition' in joker) {
            if ('modifyCondition' in joker) {
                if (joker.modifyCondition()) {
                    joker.modifyEffect();
                }
            } else {
                joker.modifyEffect();
            }
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
            if (Math.floor(Math.random() * 5) === 0) {
                currentScore.mult += 20;

                if (!('luckyHits') in gameVars || gameVars.luckyHits === undefined) {
                    gameVars.luckyHits = 0;
                }

                gameVars.luckyHits++;
            }

            if (Math.floor(Math.random() * 20) === 0) {
                gameVars.money += 20;

                if (!('luckyHits') in gameVars || gameVars.luckyHits === undefined) {
                    gameVars.luckyHits = 0;
                }

                gameVars.luckyHits++;
            }
        } else if (card.enhancement === 'glass') {
            currentScore.mult *= 2;

            if (Math.floor(Math.random() * 4) === 0) {
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
        if (joker.trigger === 'duringScore') {
            if (joker.retriggering) {
                if (!gameVars.retrigger) {
                    handleJoker(joker, 'duringScore');
                    gameVars.retrigger = false;
                }
            } else {
                handleJoker(joker, 'duringScore');
            }
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

    // reset the card
    card.scoring = false;
}

// returns the card's index by it's id
function getCardIndex(id) {
    return deck.findIndex(card => card.id === id);
}

scoreHand([new Card(2, 'hearts')]);