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
    maxDiscards: 3
}

let hand = [];
var jokers = [allJokers['rideTheBus']];

// card constructor function
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
}

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
            if (playedHand[i].suit !== playedHand[i - 1].suit || playedHand[i].rank !== playedHand[i - 1].rank + 1) {
                break;
            } else if (i === playedHand.length - 1 && playedHand[playedHand.length - 1].rank === 14) {
                // if the highest card is an ace the hand is a royale flush
                // every card scores in a royale flush
                for (card of playedHand) {
                    card.scoring = true;
                }
                return 'royale flush'
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
            if (playedHand[i].rank !== playedHand[i - 1].rank + 1) {
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

    // check if any jokers trigger before score
    for (let joker of jokers) {
        if (joker.trigger === 'beforeScore') {
            handleJoker(joker);
        }
    }

    // loop over every card
    for (card of playedHand) {
        // add that cards rank to the chips
        if (card.scoring) {
            currentScore.chips += card.rank;

            // check if any jokers trigger during card scoring
            for (let joker of jokers) {
                if (joker.trigger === 'duringScore') {
                    handleJoker(joker);
                }
            }

            card.scoring = false;
        }
    }

    // check if any of the jokers trigger after card scoring
    for (let joker of jokers) {
        if (joker.trigger === 'afterScore') {
            handleJoker(joker);
        }
    }

    // log chips, mult, and score to the console
    console.log(`Chips: ${currentScore.chips}\nMult: ${currentScore.mult}\nScore: ${Math.round(currentScore.chips * currentScore.mult)}`);
}

// handles the joker, checks for condition and applies effect
function handleJoker(joker) {
    // the condition statement is inside this if statement so we don't trigger the else statement if the condition isn't met
    if ('condition' in joker) {
        if (joker.condition()) {
            joker.effect();
        }
    } else {
        joker.effect();
    }
}

scoreHand([new Card(14, 'hearts'), new Card(6, 'hearts'), new Card(4, 'hearts'), new Card(10, 'hearts'), new Card(8, 'hearts')]);
scoreHand([new Card(14, 'hearts'), new Card(6, 'hearts'), new Card(4, 'hearts'), new Card(10, 'hearts'), new Card(8, 'hearts')]);
scoreHand([new Card(14, 'hearts'), new Card(6, 'hearts'), new Card(4, 'hearts'), new Card(10, 'hearts'), new Card(8, 'hearts')]);