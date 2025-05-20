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
let hand = [];
let jokers = [allJokers.midasMask];

// card constructor function
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
}

// returns the hand type as a string
function getHandType(playedHand) {
    // we sort the hand by rank to make checking straights easy
    playedHand.sort(function(a, b) {
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
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].suit !== playedHand[i-1].suit || playedHand[i].rank !== playedHand[i-1].rank) {
                break;
            } else if (i === playedHand.length - 1) {
                console.log('flush five');
                return 'flush five';
            }
        }
    
        // check for flush house
        // toak stands for three of a kind
        let pairSeen = false;
        let toakSeen = false;
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].suit !== playedHand[i-1].suit) {
                pairSeen = false;
                toakSeen = false;
                break;
            }
    
            let count = 0;
            let breakIt = false;
            for (j=i;j<playedHand.length;j++) {
                if (playedHand[i-1].rank === playedHand[j].rank) {
                    count++;
                }
    
                if (j === playedHand.length - 1 && count === 1) {
                    pairSeen = true;
                } else if (j === playedHand.length - 1 && count === 2) {
                    toakSeen = true;
                } else if (j === playedHand.length - 1 && count === 3) {
                    pairSeen = false;
                    toakSeen = false;
                    breakIt = true;
                }
            }

            if (breakIt) {
                break;
            }
        }
        if (toakSeen && pairSeen) {
            console.log('flush house');
            return 'flush house';
        }
    
        // check for five of a kind
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].rank !== playedHand[i-1].rank) {
                break;
            } else if (i === playedHand.length - 1) {
                console.log('five of a kind');
                return 'five of a kind';
            }
        }
    
        // check for straight flush
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].suit !== playedHand[i-1].suit || playedHand[i].rank !== playedHand[i-1].rank+1) {
                break;
            } else if (i === playedHand.length - 1 && playedHand[playedHand.length-1].rank === 14) {
                // if the highest card is an ace the hand is a royale flush
                console.log('royale flush');
                return 'royale flush'
            } else if (i === playedHand.length - 1) {
                console.log('straight flush');
                return 'straight flush';
            }
        }
    }

    // four of a kind is here because this is where it falls in priority, but it doesn't need five cards to be played
    // four of a kind
    for (i=0;i<playedHand.length;i++) {
        let count = 0;
        for (j=i+1;j<playedHand.length;j++) {
            if (playedHand[i].rank === playedHand[j].rank) {
                count++;
            }

            if (j === playedHand.length - 1 && count === 3) {
                console.log('four of a kind');
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
        for (i=0;i<playedHand.length;i++) {
            let count = 0;
            for (j=i+1;j<playedHand.length;j++) {
                if (playedHand[i].rank === playedHand[j].rank) {
                    count++;
                }
    
                if (j === playedHand.length - 1 && count === 1) {
                    pairSeen = true;
                } else if (j === playedHand.length - 1 && count === 2) {
                    toakSeen = true;
                }
            }
        }
        if (toakSeen && pairSeen) {
            console.log('full house');
            return 'full house';
        }
    
        // check for flush
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].suit !== playedHand[i-1].suit) {
                break;
            } else if (i === playedHand.length - 1) {
                console.log('flush');
                return 'flush';
            }
        }
    
        // check for straight
        for (i=1;i<playedHand.length;i++) {
            if (playedHand[i].rank !== playedHand[i-1].rank+1) {
                break;
            } else if (i === playedHand.length - 1) {
                console.log('straight');
                return 'straight';
            }
        }
    }

    // check for three of a kind, two pair, and pair
    let pairCount = 0;
    for (i=0;i<playedHand.length;i++) {
        let count = 0;
        for (j=i+1;j<playedHand.length;j++) {
            if (playedHand[i].rank === playedHand[j].rank) {
                count++;
            }

            if (j === playedHand.length - 1 && count === 1) {
                pairCount++;
            } else if (j === playedHand.length - 1 && count === 2) {
                console.log('three of a kind');
                return 'three of a kind';
            }
        }
    }
    if (pairCount === 2) {
        console.log('two pair');
        return 'two pair';
    } else if (pairCount === 1) {
        console.log('pair');
        return 'pair';
    }

    // if nothing passes, return high card
    console.log('high card');
    return 'high card';
}

// count up chips and apply scoring joker effects
function scoreHand(playedHand) {
    // get the hand's score from the score library
    let currentScore = handVars[getHandType(playedHand)];

    // check if any jokers trigger before score
    for (let joker of jokers) {
        if (joker.trigger === 'beforeScore') {
            if ('needs' in joker && joker.needs.includes('hand')) {
                if ('condition' in joker) {
                    if (joker.condition(playedHand)) {
                        console.log('triggered')
                        joker.effect(currentScore, hand);
                    }
                }
            }
        }
    }

    // loop over every card
    for (let card of playedHand) {
        // add that cards rank to the chips
        currentScore.chips += card.rank;

        // check if any jokers trigger during card scoring
        for (let joker of jokers) {
            if (joker.trigger === 'duringScore') {
                // if so, check if the joker needs the current card
                if ('needs' in joker && joker.needs.includes('card')) {
                    // if the joker has a condition that needs to be met, check it with the card
                    if ('condition' in joker) {
                        // the condition is inside this if statement so that the else statement isn't triggered when the condition is false
                        if (joker.condition(card)) {
                            joker.effect(currentScore, card);
                        }
                    } else {
                        joker.effect(currentScore, card);
                    }
                } else {
                    // if the joker has a condition that needs to be met, check it
                    if ('condition' in joker) {
                        if (joker.condition()) {
                            joker.effect(currentScore);
                        }
                    } else {
                        joker.effect(currentScore);
                    }
                }
            }
        }
    }

    // check if any of the jokers trigger after card scoring
    for (let joker of jokers) {
        if (joker.trigger === 'afterScore') {
            // if the joker needs the hand, give it to them
            if ('needs' in joker && joker.needs.includes('hand')) {
                if ('condition' in joker) {
                    if (joker.condition(playedHand)) {
                        joker.effect(currentScore, playedHand);
                    }
                } else {
                    joker.effect(currentScore, playedHand);
                }
            } else {
                if ('condition' in joker) {
                    if (joker.condition()) {
                        joker.effect(currentScore);
                    }
                } else {
                    joker.effect(currentScore);
                }
            }
        }
    }

    // log chips, mult, and score to the console
    console.log(`Chips: ${currentScore.chips}\nMult: ${currentScore.mult}\nScore: ${currentScore.chips * currentScore.mult}`);
}

scoreHand([new Card(12, 'hearts')]);