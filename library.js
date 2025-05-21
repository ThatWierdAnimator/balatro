var handVars = {
    'flush five': {
        chips: 160,
        mult: 16
    },
    'flush house': {
        chips: 140,
        mult: 14
    },
    'five of a kind': {
        chips: 120,
        mult: 12
    },
    'royal flush': {
        chips: 100,
        mult: 8
    },
    'straight flush': {
        chips: 100,
        mult: 8
    },
    'four of a kind': {
        chips: 60,
        mult: 7
    },
    'full house': {
        chips: 40,
        mult: 4
    },
    'flush': {
        chips: 35,
        mult: 4
    },
    'straight': {
        chips: 30,
        mult: 4
    },
    'three of a kind': {
        chips: 30,
        mult: 3
    },
    'two pair': {
        chips: 20,
        mult: 2
    },
    'pair': {
        chips: 10,
        mult: 2
    },
    'high card': {
        chips: 5,
        mult: 1
    }
}

/* 
    Joker Triggers:

    afterScore - Triggered after all cards are scored in a hand
    duringScore - Triggered when each card is scored, if it has a condition attribute the condition is checks
    beforeScore - Triggered just before all cards are scored

    Skipped Jokers:
    Four Fingers
    Mime
    Credit Card
    Ceremonial Dagger
    Marble Joker
    Raised Fist
    Choas the Clown
    Delayed Gratification
    Supernova
    Space Joker
    Egg
    Burglar
    Blackboard

    Unfinished Jokers:
    8 Ball

    Current Joker - Ice Cream
*/
var allJokers = {
    'joker': {
        name: 'Joker',
        trigger: 'afterScore',
        effect: () => currentScore.mult += 4
    },
    'greedyJoker': {
        name: 'Greedy Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'diamonds',
        effect: () => currentScore.mult += 3
    },
    'lustyJoker': {
        name: 'Lusty Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'hearts',
        effect: () => currentScore.mult += 3
    },
    'wrathfulJoker': {
        name: 'Wrathful Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'spades',
        effect: () => currentScore.mult += 3
    },
    'gluttonousJoker': {
        name: 'Gluttonous Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'clubs',
        effect: () => currentScore.mult += 3
    },
    'jollyJoker': {
        name: 'Jolly Joker',
        trigger: 'afterScore',
        condition: () => {
            for (i = 0; i < playedHand.length; i++) {
                for (j = i + 1; j < playedHand.length; j++) {
                    if (playedHand[i].rank === playedHand[j].rank) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.mult += 8;
        }
    },
    'zanyJoker': {
        name: 'Zany Joker',
        trigger: 'afterScore',
        condition: () => {
            for (i = 0; i < playedHand.length; i++) {
                let count = 0;
                for (j = i + 1; j < playedHand.length; j++) {
                    if (playedHand[i].rank === playedHand[j].rank) {
                        count++;
                    }

                    if (j === playedHand.length - 1 && count === 2) {
                        return true;
                    }
                }
            }
        },
        effect: () => currentScore.mult += 12
    },
    'madJoker': {
        name: 'Mad Joker',
        trigger: 'afterScore',
        condition: () => {
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
                    }
                }
            }
            if (pairCount === 2) {
                return true;
            }
        },
        effect: () => currentScore.mult += 10
    },
    'crazyJoker': {
        name: 'Crazy Joker',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].rank !== playedHand[i - 1].rank + 1) {
                        break;
                    } else if (i === playedHand.length - 1) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.mult += 12
        }
    },
    'drollJoker': {
        name: 'Droll Joker',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit !== playedHand[i - 1].suit) {
                        break;
                    } else if (i === playedHand.length - 1) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.mult += 10
        }
    },
    'slyJoker': {
        name: 'Sly Joker',
        trigger: 'afterScore',
        condition: () => {
            for (i = 0; i < playedHand.length; i++) {
                for (j = i + 1; j < playedHand.length; j++) {
                    if (playedHand[i].rank === playedHand[j].rank) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.chips += 50;
        }
    },
    'wilyJoker': {
        name: 'Wily Joker',
        trigger: 'afterScore',
        condition: () => {
            for (i = 0; i < playedHand.length; i++) {
                let count = 0;
                for (j = i + 1; j < playedHand.length; j++) {
                    if (playedHand[i].rank === playedHand[j].rank) {
                        count++;
                    }

                    if (j === playedHand.length - 1 && count === 2) {
                        return true;
                    }
                }
            }
        },
        effect: () => currentScore.chips += 100
    },
    'cleverJoker': {
        name: 'Clever Joker',
        trigger: 'afterScore',
        condition: () => {
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
                    }
                }
            }
            if (pairCount === 2) {
                return true;
            }
        },
        effect: () => currentScore.chips += 80
    },
    'deviousJoker': {
        name: 'Devious Joker',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].rank !== playedHand[i - 1].rank + 1) {
                        break;
                    } else if (i === playedHand.length - 1) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.chips += 100
        }
    },
    'craftyJoker': {
        name: 'Crafty Joker',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit !== playedHand[i - 1].suit) {
                        break;
                    } else if (i === playedHand.length - 1) {
                        return true;
                    }
                }
            }
        },
        effect: () => {
            currentScore.chips += 80
        }
    },
    'halfJoker': {
        name: 'Half Joker',
        trigger: 'afterScore',
        condition: () => playedHand.length <= 3,
        effect: () => currentScore.mult += 20
    },
    'jokerStencil': {
        name: 'Joker Stencil',
        trigger: 'afterScore',
        effect: () => {
            let count = gameVars.maxJokers - jokers.length;
            for (let joker of jokers) {
                if (joker === allJokers.jokerStencil) {
                    count++;
                }
            }
            currentScore.mult *= count;
        }
    },
    'banner': {
        name: 'Banner',
        trigger: 'afterScore',
        effect: () => currentScore.chips += gameVars.currentDiscards * 30
    },
    'mysticSummit': {
        name: 'Mystic Summit',
        trigger: 'afterScore',
        condition: () => gameVars.currentDiscards === 0,
        effect: () => currentScore.mult += 15
    },
    'loyaltyCard': {
        name: 'Loyalty Card',
        trigger: 'afterScore',
        condition: () => {
            if (!('loyaltyCardCountdown' in gameVars)) {
                gameVars.loyaltyCardCountdown = 6;
            }
            gameVars.loyaltyCardCountdown -= 1;
            if (gameVars.loyaltyCardCountdown === 0) {
                gameVars.loyaltyCardCountdown = 6;
                return true;
            }
        },
        effect: () => currentScore.mult *= 4
    },
    '8ball': {
        name: '8 Ball',
        trigger: 'duringScore',
        condition: () => card.rank === 8 && Math.floor(Math.random() * 4) === 0,
        effect: () => {
            console.log('Tarot generated!');
        }
    },
    'misprint': {
        name: 'Misprint',
        trigger: 'afterScore',
        effect: () => currentScore.mult += Math.floor(Math.random() * 24)
    },
    'dusk': {
        name: 'Dusk',
        trigger: 'duringScore',
        retriggering: true,
        condition: () => gameVars.currentHands === 0 && !gameVars.retrigger,
        effect: () => handleCard(card, true)
    },
    'fibonacci': {
        name: 'Fibonacci',
        trigger: 'duringScore',
        condition: () => {
            if (card.rank === 14 ||
                card.rank === 8 ||
                card.rank === 5 ||
                card.rank === 3 ||
                card.rank === 2
            ) {
                return true;
            }
        },
        effect: () => currentScore.mult += 8
    },
    'steelJoker': {
        name: 'Steel Joker',
        trigger: 'afterScore',
        condition: () => {
            for (let checkedCard of deck) {
                if (checkedCard.enhancement === 'steel') {
                    return true;
                }
            }
        },
        effect: () => {
            let multMultiplier = 1;
            for (let checkedCard of deck) {
                if (checkedCard.enhancement === 'steel') {
                    multMultiplier += 0.2;
                }
            }

            currentScore.mult *= multMultiplier;
        }
    },
    'scaryFace': {
        name: 'Scary Face',
        trigger: 'duringScore',
        condition: () => jokers.includes(allJokers.pareidolia) || (card.rank <= 13 && card.rank >= 11),
        effect: () => currentScore.chips += 30
    },
    'abstractJoker': {
        name: 'Abstract Joker',
        trigger: 'afterScore',
        effect: () => currentScore.mult += jokers.length * 3
    },
    'hack': {
        name: 'Hack',
        trigger: 'duringScore',
        retriggering: true,
        condition: () => card.rank <= 5 && card.rank >= 2 && !gameVars.retrigger && card.enhancement !== 'stone',
        effect: () => handleCard(card, true)
    },
    'pareidolia': {
        name: 'Pareidolia'
    },
    'grosMichel': {
        name: 'Gros Michel',
        trigger: 'afterScore',
        effect: () => {
            currentScore.mult += 15;

            if (Math.floor(Math.random() * 6) === 0) {
                jokers.splice(this.index, 1);
                gameVars.michelDestroyed = true;
            }
        },
        index: 0
    },
    'evenSteven': {
        name: 'Even Steven',
        trigger: 'duringScore',
        condition: () => card.rank <= 10 && card.rank % 2 === 0,
        effect: () => currentScore.mult += 4
    },
    'oddTodd': {
        name: 'Odd Todd',
        trigger: 'duringScore',
        condition: () => (card.rank <= 10 && card.rank & 2 === 1) || card.rank === 14,
        effect: () => currentScore.chips += 31
    },
    'scholar': {
        name: 'Scholar',
        trigger: 'duringScore',
        condition: () => card.rank === 14,
        effect: () => {
            currentScore.chips += 20;
            currentScore.mult += 4;
        }
    },
    'businessCard': {
        name: 'Business Card',
        trigger: 'duringScore',
        condition: () => (jokers.includes(allJokers.pareidolia) || (card.rank <= 13 && card.rank >= 11)) && Math.floor(Math.random() * 2) === 0,
        effect: () => gameVars.money += 2
    },
    'rideTheBus': {
        name: 'Ride the Bus',
        trigger: 'afterScore',
        condition: () => {
            if (!('rideTheBusMult' in gameVars)) {
                gameVars.rideTheBusMult = 0;
            }

            // check if there aren't any face cards in the hand
            if (!playedHand.map((card) => {
                if (card.rank <= 13 && card.rank >= 11) {
                    return true;
                } else {
                    return false;
                }
            }).includes(true)) {
                gameVars.rideTheBusMult++;
            }

            if (gameVars.rideTheBusMult > 0) {
                return true;
            }
        },
        effect: () => currentScore.mult += gameVars.rideTheBusMult
    },
    'runner': {
        name: 'Runner',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush',
        effect: () => {
            if (!('runnerChips' in gameVars)) {
                gameVars.runnerChips = 0;
            }

            gameVars.runnerChips += 15;

            currentScore.chips += gameVars.runnerChips;
        }
    },
    'bloodStone': {
        name: 'Bloodstone',
        trigger: 'duringScore',
        condition: () => card.suit === 'hearts' && Math.floor(Math.random() * 2) === 0,
        effect: () => currentScore.mult *= 1.5
    }
}

var cardsSpawned = 0;
// card constructor function
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.id = cardsSpawned;
    cardsSpawned++;
}

// defines a standard deck
var deck = [
    new Card(2, 'spades'),
    new Card(3, 'spades'),
    new Card(4, 'spades'),
    new Card(5, 'spades'),
    new Card(6, 'spades'),
    new Card(7, 'spades'),
    new Card(8, 'spades'),
    new Card(9, 'spades'),
    new Card(10, 'spades'),
    new Card(11, 'spades'),
    new Card(12, 'spades'),
    new Card(13, 'spades'),
    new Card(14, 'spades'),
    new Card(2, 'hearts'),
    new Card(3, 'hearts'),
    new Card(4, 'hearts'),
    new Card(5, 'hearts'),
    new Card(6, 'hearts'),
    new Card(7, 'hearts'),
    new Card(8, 'hearts'),
    new Card(9, 'hearts'),
    new Card(10, 'hearts'),
    new Card(11, 'hearts'),
    new Card(12, 'hearts'),
    new Card(13, 'hearts'),
    new Card(14, 'hearts'),
    new Card(2, 'clubs'),
    new Card(3, 'clubs'),
    new Card(4, 'clubs'),
    new Card(5, 'clubs'),
    new Card(6, 'clubs'),
    new Card(7, 'clubs'),
    new Card(8, 'clubs'),
    new Card(9, 'clubs'),
    new Card(10, 'clubs'),
    new Card(11, 'clubs'),
    new Card(12, 'clubs'),
    new Card(13, 'clubs'),
    new Card(14, 'clubs'),
    new Card(2, 'diamonds'),
    new Card(3, 'diamonds'),
    new Card(4, 'diamonds'),
    new Card(5, 'diamonds'),
    new Card(6, 'diamonds'),
    new Card(7, 'diamonds'),
    new Card(8, 'diamonds'),
    new Card(9, 'diamonds'),
    new Card(10, 'diamonds'),
    new Card(11, 'diamonds'),
    new Card(12, 'diamonds'),
    new Card(13, 'diamonds'),
    new Card(14, 'diamonds'),
    {
        rank: 15,
        suit: 'balls',
        id: 52
    }
]