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
    duringScore - Triggered when each card is scored, if it has a condition attribute the condition is checked
    beforeScore - Triggered just before all cards are scored
    roundStart - Triggered when the round starts
    roundEnd - Triggered when the round ends
    onDiscard - Triggered when a discard happens
    heldInHand - Triggered after beforeScore and before duringScore, meant for held in hand abilities

    Skipped Jokers:
    Credit Card
    Ceremonial Dagger
    Choas the Clown
    Space Joker
    Egg
    DNA
    Blue Joker
    Sixth Sense
    Constellation
    Faceless Joker
    Green Joker
    To Do List
    Cavendish
    Card Sharp
    Red Card
    Madness
    Riff Raff
    Shortcut
    Hologram
    Baron
    Cloud 9
    Rocket
    Luchador
    Gift Card
    Turtle Bean
    Reserved Parking
    Mail-In Rebate
    To the Moon
    Hallucination
    Fortune Teller
    Juggler
    Drunkard
    Golden Joker
    Baseball Card
    Diet Cola
    Trading Card
    Flash Card
    Popcorn
    Ancient Joker
    Ramen
    Castle
    Campfire
    Mr. Bones
    Swashbuckler
    Troubadour
    Certificate
    Throwback
    Showman
    Merry Andy
    The Idol
    Matador
    Hit the Road
    Stuntman
    Invisible Joker
    Satellite
    Shoot the Moon
    Cartomancer
    Astronomer
    Burnt Joker
    Canio
    Yorick
    Chicot
    Perkeo

    Unfinished Jokers:
    8 Ball
    Gros Michel
    Superposition
    Séance
    Vagabond

    Current Joker - The Duo
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
        condition: () => card.suit === 'diamonds' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'hearts'),
        effect: () => currentScore.mult += 3
    },
    'lustyJoker': {
        name: 'Lusty Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'hearts' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'diamonds'),
        effect: () => currentScore.mult += 3
    },
    'wrathfulJoker': {
        name: 'Wrathful Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'spades' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'clubs'),
        effect: () => currentScore.mult += 3
    },
    'gluttonousJoker': {
        name: 'Gluttonous Joker',
        trigger: 'duringScore',
        condition: () => card.suit === 'clubs' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'spades'),
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
            let tempHand = playedHand.sort(function (a, b) {
                if (a.rank < b.rank) {
                    return -1; // if the first card is lower than the next it comes before
                }
                if (a.rank > b.rank) {
                    return 1; // if the first card is higher than the next it comes after
                }
                return 0; // the ranks are equal
            }).map(value => value);

            if (tempHand.length === 5 || (jokers.includes(allJokers.fourFingers) && tempHand.length >= 4)) {
                for (i = 1; i < tempHand.length; i++) {
                    if (tempHand[i].rank !== tempHand[i - 1].rank + 1) {
                        break;
                    } else if (i === tempHand.length - 1) {
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
            if (playedHand.length === 5 || (jokers.includes(allJokers.fourFingers) && playedHand.length >= 4)) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit === playedHand[i - 1].suit) {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else if (jokers.includes(allJokers.smearedJoker) &&
                        ((playedHand[i].suit === 'hearts' && playedHand[i - 1].suit === 'diamonds') ||
                            (playedHand[i].suit === 'diamonds' && playedHand[i - 1].suit === 'hearts') ||
                            (playedHand[i].suit === 'clubs' && playedHand[i - 1].suit === 'spades') ||
                            (playedHand[i].suit === 'spades' && playedHand[i - 1].suit === 'clubs'))
                    ) {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else {
                        break;
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
            let tempHand = playedHand.sort(function (a, b) {
                if (a.rank < b.rank) {
                    return -1; // if the first card is lower than the next it comes before
                }
                if (a.rank > b.rank) {
                    return 1; // if the first card is higher than the next it comes after
                }
                return 0; // the ranks are equal
            }).map(value => value);

            if (tempHand.length === 5 || (jokers.includes(allJokers.fourFingers) && tempHand.length >= 4)) {
                for (i = 1; i < tempHand.length; i++) {
                    if (tempHand[i].rank !== tempHand[i - 1].rank + 1) {
                        break;
                    } else if (i === tempHand.length - 1) {
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
            if (playedHand.length === 5 || (jokers.includes(allJokers.fourFingers) && playedHand.length >= 4)) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit === playedHand[i - 1].suit) {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else if (jokers.includes(allJokers.smearedJoker) &&
                        ((playedHand[i].suit === 'hearts' && playedHand[i - 1].suit === 'diamonds') ||
                            (playedHand[i].suit === 'diamonds' && playedHand[i - 1].suit === 'hearts') ||
                            (playedHand[i].suit === 'clubs' && playedHand[i - 1].suit === 'spades') ||
                            (playedHand[i].suit === 'spades' && playedHand[i - 1].suit === 'clubs'))
                    ) {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else {
                        break;
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
    'fourFingers': {
        name: 'Four Fingers'
    },
    'mime': {
        name: 'Mime',
        retriggering: true,
        trigger: 'heldInHand',
        effect: () => handleHeldCard(card, true)
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
    'marbleJoker': {
        name: 'Marble Joker',
        trigger: 'roundStart',
        effect: () => deck.push(new Card('rand', 'rand', 'stone'))
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
        condition: () => card.rank === 8 && Math.floor(Math.random() * 4) < 1 + gameVars.probabilitySkew,
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
        condition: () => gameVars.currentHands === 0,
        effect: () => handleCard(card, true)
    },
    'raisedFist': {
        name: 'Raised Fist',
        trigger: 'heldInHand',
        condition: () => card === hand.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard),
        effect: () => {
            currentScore.mult += hand.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard).rank * 2
        }
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
    'delayedGratification': {
        name: 'Delayed Gratification',
        trigger: 'roundEnd',
        condition: () => gameVars.firstDiscard,
        effect: () => gameVars.money += gameVars.currentDiscards * 2
    },
    'hack': {
        name: 'Hack',
        trigger: 'duringScore',
        retriggering: true,
        condition: () => card.rank <= 5 && card.rank >= 2 && card.enhancement !== 'stone',
        effect: () => handleCard(card, true)
    },
    'pareidolia': {
        name: 'Pareidolia'
    },
    'grosMichel': {
        name: 'Gros Michel',
        trigger: 'afterScore',
        effect: function () {
            currentScore.mult += 15;

            // this is triggered once the round ends

            // if (Math.floor(Math.random() * 6) < 1 + gameVars.probabilitySkew) {
            //     jokers.splice(jokers.findIndex(joker => joker === this), 1);
            //     gameVars.michelDestroyed = true;
            // }
        }
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
        condition: () => (jokers.includes(allJokers.pareidolia) || (card.rank <= 13 && card.rank >= 11)) && Math.floor(Math.random() * 2) < 1 + gameVars.probabilitySkew,
        effect: () => gameVars.money += 2
    },
    'supernova': {
        name: 'Supernova',
        trigger: 'afterScore',
        effect: () => currentScore.mult += gameVars.playedHands[getHandType(playedHand)]
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
            } else {
                gameVars.rideTheBusMult = 0;
            }

            if (gameVars.rideTheBusMult > 0) {
                return true;
            }
        },
        effect: () => currentScore.mult += gameVars.rideTheBusMult
    },
    'blackboard': {
        name: 'Blackboard',
        trigger: 'afterScore',
        condition: () => hand.filter(c => c.suit === 'hearts' || c.suit === 'diamonds').length === 0,
        effect: () => currentScore.mult *= 3
    },
    'burglar': {
        name: 'Burglar',
        trigger: 'roundStart',
        effect: () => {
            gameVars.currentHands += 3;
            gameVars.currentDiscards = 0;
        }
    },
    'runner': {
        name: 'Runner',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush',
        effect: () => {
            if (!('runnerChips' in gameVars)) {
                gameVars.runnerChips = 0;
            }

            gameVars.runnerChips += 15;

            currentScore.chips += gameVars.runnerChips;
        }
    },
    'iceCream': {
        name: 'Ice Cream',
        trigger: 'afterScore',
        effect: () => {
            if (!('iceCreamChips' in gameVars)) {
                gameVars.iceCreamChips = 100;
            } else {
                gameVars.iceCreamChips -= 5;
            }

            currentScore.chips += gameVars.iceCreamChips
        }
    },
    'dna': {
        name: 'DNA',
        trigger: 'beforeScore',
        condition: () => gameVars.firstHand && playedHand.length === 1,
        effect: () => {
            deck.push(new Card(card.rank, card.suit, card.enhancement, card.seal, card.edition));
        }
    },
    'splash': {
        name: 'Splash',
        trigger: 'beforeScore',
        effect: () => {
            for (let card of playedHand) {
                card.scoring = true;
            }
        }
    },
    'hiker': {
        name: 'Hiker',
        trigger: 'duringScore',
        effect: () => {
            if (!('bonusChips' in card)) {
                card.bonusChips = 0;
            }

            card.bonusChips += 5;
        }
    },
    'superposition': {
        name: 'Superposition',
        trigger: 'beforeScore',
        condition: () => {
            if ((getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush') && playedHand.reduce((c1, c2) => c1.rank === 14 || c2.rank === 14)) {
                return true;
            }
        },
        effect: () => console.log('Tarot generated!')
    },
    'squareJoker': {
        name: 'Square Joker',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 4) {
                if (!('squareJokerChips' in gameVars)) {
                    gameVars.squareJokerChips = 0;
                }

                gameVars.squareJokerChips += 4;
            }

            if ('squareJokerChips' in gameVars && gameVars.squareJokerChips > 0) {
                return true;
            }
        },
        effect: () => currentScore.chips += gameVars.squareJokerChips
    },
    'seance': {
        name: 'Séance',
        trigger: 'beforeScore',
        condition: () => getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush',
        effect: () => console.log('Spectral generated!')
    },
    'vampire': {
        name: 'Vampire',
        trigger: 'afterScore',
        condition: () => 'vampireMult' in gameVars && gameVars.vampireMult > 1,
        effect: () => currentScore.mult *= gameVars.vampireMult,
        modifyTrigger: 'beforeScore',
        modifyCondition: () => playedHand.find(c => 'enhancement' in c) !== undefined,
        modifyEffect: () => {
            for (card of playedHand) {
                if ('enhancement' in card) {
                    delete card.enhancement;
                    if (!('vampireMult' in gameVars)) {
                        gameVars.vampireMult = 1;
                    }
                    gameVars.vampireMult += 0.2;
                }
            }
        }
    },
    'vagabond': {
        name: 'Vagabond',
        trigger: 'beforeScore',
        condition: () => gameVars.money <= 4,
        effect: () => console.log('Tarot generated!')
    },
    'obelisk': {
        name: 'Obelisk',
        trigger: 'afterScore',
        condition: () => 'obeliskMult' in gameVars && gameVars.obeliskMult > 1,
        effect: () => currentScore.mult *= gameVars.obeliskMult,
        modifyTrigger: 'beforeScore',
        modifyCondition: () => {
            if (!('obeliskMult' in gameVars)) {
                gameVars.obeliskMult = 1;
            }

            if (getHandType(playedHand) === gameVars.mostPlayedHand) {
                gameVars.obeliskMult = 1;
            } else {
                return true;
            }
        },
        modifyEffect: () => gameVars.obeliskMult += 0.2
    },
    'midasMask': {
        name: 'Midas Mask',
        trigger: 'beforeScore',
        condition: () => jokers.includes(allJokers.pareidolia) || playedHand.find(c => c.rank >= 11 && c.rank <= 13) !== undefined,
        effect: () => {
            for (card of playedHand) {
                if (jokers.includes(allJokers.pareidolia) || (card.rank >= 11 && card.rank <= 13)) {
                    card.enhancement = 'gold';
                }
            }
        }
    },
    'photograph': {
        name: 'Photograph',
        trigger: 'duringScore',
        condition: () => {
            if (!('firstPlayedFace' in gameVars)) {
                gameVars.firstPlayedFace = true;
            }

            if (card === playedHand[gameVars.firstPlayedFaceCardPos + 1]) {
                gameVars.firstPlayedFace = false;
            }

            if ((jokers.includes(allJokers.pareidolia) || (card.rank <= 13 && card.rank >= 11)) && gameVars.firstPlayedFace) {
                gameVars.firstPlayedFaceCardPos = playedHand.findIndex(c => c === card);
                return true;
            }
        },
        effect: () => currentScore.mult *= 2,
        modifyTrigger: 'afterScore',
        modifyEffect: () => {
            delete gameVars.firstPlayedFace;
            delete gameVars.firstPlayedFaceCardPos;
        }
    },
    'erosion': {
        name: 'Erosion',
        trigger: 'afterScore',
        condition: () => deck.length < 52,
        effect: () => currentScore.mult += (52 - deck.length) * 4
    },
    'stoneJoker': {
        name: 'Stone Joker',
        trigger: 'afterScore',
        condition: () => deck.find(c => c.enhancement === 'stone') !== undefined,
        effect: () => currentScore.chips += deck.filter(c => c.enhancement === 'stone').length * 25
    },
    'luckyCat': {
        name: 'Lucky Cat',
        trigger: 'afterScore',
        condition: () => 'luckyHits' in gameVars && gameVars.luckyHits > 0,
        effect: () => currentScore.mult *= gameVars.luckyHits * 0.25 + 1
    },
    'bull': {
        name: 'Bull',
        trigger: 'afterScore',
        condition: () => gameVars.money > 0,
        effect: () => currentScore.chips += gameVars.money * 2
    },
    'spareTrousers': {
        name: 'Spare Trousers',
        trigger: 'afterScore',
        condition: () => 'trousersMult' in gameVars && gameVars.trousersMult > 0,
        effect: () => currentScore.mult += gameVars.trousersMult,
        modifyTrigger: 'beforeScore',
        modifyCondition: () => {
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
        modifyEffect: () => {
            if (!('trousersMult' in gameVars)) {
                gameVars.trousersMult = 0;
            }

            gameVars.trousersMult += 2;
        }
    },
    'walkieTalkie': {
        name: 'Walkie Talkie',
        trigger: 'duringScore',
        condition: () => card.rank === 4 || card.rank === 10,
        effect: () => {
            currentScore.chips += 10;
            currentScore.mult += 4;
        }
    },
    'seltzer': {
        name: 'Seltzer',
        retriggering: true,
        trigger: 'duringScore',
        condition: () => {
            if (!('seltzerLife' in gameVars)) {
                gameVars.seltzerLife = 10;
            }

            if (gameVars.seltzerLife > 0) {
                return true;
            }
        },
        effect: function () {
            handleCard(card, true);
            gameVars.seltzerLife--;
            if (gameVars.seltzerLife <= 0) {
                jokers.splice(jokers.findIndex(joker => joker === this), 1);
            }
        }
    },
    'smileyFace': {
        name: 'Smiley Face',
        trigger: 'duringScore',
        condition: () => jokers.includes(allJokers.pareidolia) || (card.rank >= 11 && card.rank <= 13),
        effect: () => currentScore.mult += 5
    },
    'goldenTicket': {
        name: 'Golden Ticket',
        trigger: 'duringScore',
        condition: () => card.enhancement === 'gold',
        effect: () => gameVars.money += 4
    },
    'acrobat': {
        name: 'Acrobat',
        trigger: 'afterScore',
        condition: () => gameVars.currentHands === 0,
        effect: () => currentScore.mult *= 3
    },
    'sockAndBuskin': {
        name: 'Sock and Buskin',
        retriggering: true,
        trigger: 'duringScore',
        condition: () => jokers.includes(allJokers.pareidolia) || (card.rank <= 13 && card.rank >= 11),
        effect: () => handleCard(card, true)
    },
    'smearedJoker': {
        name: 'Smeared Joker'
    },
    'hangingChad': {
        name: 'Hanging Chad',
        retriggering: true,
        trigger: 'duringScore',
        condition: () => card === playedHand[0],
        effect: () => {
            handleCard(card, true);
            handleCard(card, true);
        }
    },
    'roughGem': {
        name: 'Rough Gem',
        trigger: 'duringScore',
        condition: () => card.suit === 'diamonds' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'hearts'),
        effect: () => gameVars.money++
    },
    'bloodStone': {
        name: 'Bloodstone',
        trigger: 'duringScore',
        condition: () => (card.suit === 'hearts' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'diamonds')) && Math.floor(Math.random() * 2) < 1 + gameVars.probabilitySkew,
        effect: () => currentScore.mult *= 1.5
    },
    'arrowHead': {
        name: 'Arrowhead',
        trigger: 'duringScore',
        condition: () => card.suit === 'spades' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'clubs'),
        effect: () => currentScore.chips += 50
    },
    'onyxAgate': {
        name: 'Onyx Agate',
        trigger: 'duringScore',
        condition: () => card.suit === 'clubs' || (jokers.includes(allJokers.smearedJoker) && card.suit === 'spades'),
        effect: () => currentScore.mult += 7
    },
    'glassJoker': {
        name: 'Glass Joker',
        trigger: 'afterScore',
        condition: () => 'glassBreaks' in gameVars && gameVars.glassBreaks > 0,
        effect: () => currentScore.mult *= 0.75 * gameVars.glassBreaks + 1
    },
    'flowerPot': {
        name: 'Flower Pot',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.some(card => card.suit === 'spades') && playedHand.some(card => card.suit === 'hearts') && playedHand.some(card => card.suit === 'clubs') && playedHand.some(card => card.suit === 'diamonds')) {
                return true;
            }

            if (jokers.includes(allJokers.smearedJoker)) {
                let blackCount = 0;
                let redCount = 0;

                for (card of playedHand) {
                    if (card.suit === 'spades' || card.suit === 'clubs') {
                        blackCount++;
                    } else if (card.suit === 'hearts' || card.suit === 'diamonds') {
                        redCount++;
                    }
                }

                if (redCount >= 2 && blackCount >= 2) {
                    return true;
                }
            }
        },
        effect: () => currentScore.mult *= 3
    },
    'blueprint': {
        name: 'Blueprint',
        modifyTrigger: 'beforeScore',
        modifyEffect: function () {
            if ('retriggering' in jokers[this.index + 1]) {
                this.retriggering = jokers[this.index + 1].retriggering;
            }
            if ('trigger' in jokers[this.index + 1]) {
                this.trigger = jokers[this.index + 1].trigger;
            }
            if ('condition' in jokers[this.index + 1]) {
                this.condition = jokers[this.index + 1].condition;
            }
            if ('effect' in jokers[this.index + 1]) {
                this.effect = jokers[this.index + 1].effect;
            }
        }
    },
    'weeJoker': {
        name: 'Wee Joker',
        trigger: 'afterScore',
        condition: () => 'weeChips' in gameVars && gameVars.weeChips > 0,
        effect: () => currentScore.chips += gameVars.weeChips,
        modifyTrigger: 'duringScore',
        modifyCondition: () => card.rank === 2,
        modifyEffect: () => {
            if (!('weeChips' in gameVars)) {
                gameVars.weeChips = 0;
            }

            gameVars.weeChips += 8;
        }
    },
    'oopsAllSixes': {
        name: 'Oops! All 6s',
        trigger: 'beforeScore',
        effect: () => gameVars.probabilitySkew = jokers.filter(j => j === allJokers.oopsAllSixes).length
    },
    'seeingDouble': {
        name: 'Seeing Double',
        trigger: 'afterScore',
        condition: () => playedHand.some(card => card.suit === 'clubs' && card.scoring) && playedHand.some(card => card.suit !== 'clubs' && card.scoring),
        effect: () => currentScore.mult *= 2
    },
    'theDuo': {
        name: 'The Duo',
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
        effect: () => currentScore.mult *= 2
    },
    'theTrio': {
        name: 'The Trio',
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
        effect: () => currentScore.mult *= 3
    },
    'theFamily': {
        name: 'The Family',
        trigger: 'afterScore',
        condition: () => {
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
        },
        effect: () => currentScore.mult *= 4
    },
    'theOrder': {
        name: 'The Order',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush',
        effect: () => currentScore.mult *= 3
    },
    'theTribe': {
        name: 'The Tribe',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'flush' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush' || getHandType(playedHand) === 'flush five' || getHandType(playedHand) === 'flush house',
        effect: () => currentScore.mult *= 2
    },
    'brainstorm': {
        name: 'Blueprint',
        modifyTrigger: 'beforeScore',
        modifyEffect: function () {
            this.retriggering = jokers[0].retriggering;
            if ('trigger' in jokers[0]) {
                this.trigger = jokers[0].trigger;
            }
            if ('condition' in jokers[0]) {
                this.condition = jokers[0].condition;
            }
            if ('effect' in jokers[0]) {
                this.effect = jokers[0].effect;
            }
        }
    },
    'driversLiscense': {
        name: 'Drivers Liscense',
        trigger: 'afterScore',
        condition: () => deck.filter(c => c.enhancement).length >= 16,
        effect: () => currentScore.mult *= 3
    },
    'bootStraps': {
        name: 'Bootstraps',
        trigger: 'afterScore',
        condition: () => gameVars.money >= 5,
        effect: () => currentScore.mult += Math.floor(gameVars.money / 5) * 2
    },
    'triboulet': {
        name: 'Triboulet',
        trigger: 'duringScore',
        condition: () => card.rank === 12 || card.rank === 13,
        effect: () => currentScore.mult *= 2
    }
}

// see how many jokers are in there
// console.log(`${Object.keys(allJokers).length} jokers added!\n${Number((Object.keys(allJokers).length/150).toFixed(3))*100}% complete!`)

var cardsSpawned = 0;
var allSuits = ['spades', 'hearts', 'clubs', 'diamonds'];
let allEnhancements = ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'];
let allSeals = ['red', 'blue', 'gold', 'purple'];
let allEditions = ['foil', 'holographic', 'polychrome'];
// card constructor function
function Card(rank, suit, enhancement, seal, edition) {
    if (rank === 'rand') {
        this.rank = Math.floor(Math.random() * 13) + 2;
    } else {
        this.rank = rank;
    }

    if (suit === 'rand') {
        this.suit = allSuits[Math.floor(Math.random() * allSuits.length)];
    } else {
        this.suit = suit;
    }

    if (enhancement !== 'none' && enhancement !== undefined) {
        if (enhancement === 'rand') {
            this.enhancement = allEnhancements[Math.floor(Math.random() * allEnhancements.length)];
        } else {
            this.enhancement = enhancement;
        }
    }

    if (seal !== 'none' && seal !== undefined) {
        if (seal === 'rand') {
            this.seal = allSeals[Math.floor(Math.random() * allSeals.length)];
        } else {
            this.seal = seal;
        }
    }

    if (edition !== 'none' && edition !== undefined) {
        if (edition === 'rand') {
            this.edition = allEditions[Math.floor(Math.random() * allEditions.length)];
        } else {
            this.edition = edition;
        }
    }

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
]