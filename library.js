var handVars = {
    'flush five': {
        name: 'flush five',
        chips: 160,
        mult: 16,
        available: false
    },
    'flush house': {
        name: 'flush house',
        chips: 140,
        mult: 14,
        available: false
    },
    'five of a kind': {
        name: 'five of a kind',
        chips: 120,
        mult: 12,
        available: false
    },
    'royal flush': {
        name: 'royal flush',
        chips: 100,
        mult: 8,
        available: true
    },
    'straight flush': {
        name: 'straight flush',
        chips: 100,
        mult: 8,
        available: true
    },
    'four of a kind': {
        name: 'four of a kind',
        chips: 60,
        mult: 7,
        available: true
    },
    'full house': {
        name: 'full house',
        chips: 40,
        mult: 4,
        available: true
    },
    'flush': {
        name: 'flush',
        chips: 35,
        mult: 4,
        available: true
    },
    'straight': {
        name: 'straight',
        chips: 30,
        mult: 4,
        available: true
    },
    'three of a kind': {
        name: 'three of a kind',
        chips: 30,
        mult: 3,
        available: true
    },
    'two pair': {
        name: 'two pair',
        chips: 20,
        mult: 2,
        available: true
    },
    'pair': {
        name: 'pair',
        chips: 10,
        mult: 2,
        available: true
    },
    'high card': {
        name: 'high card',
        chips: 5,
        mult: 1,
        available: true
    }
}

var planetCards = {
    'mercury': {
        name: 'Mercury',
        type: 'planet',
        hand: 'pair',
        chips: 15,
        mult: 1
    },
    'venus': {
        name: 'Venus',
        type: 'planet',
        hand: 'three of a kind',
        chips: 20,
        mult: 2
    },
    'earth': {
        name: 'Earth',
        type: 'planet',
        hand: 'full house',
        chips: 25,
        mult: 2
    },
    'mars': {
        name: 'Mars',
        type: 'planet',
        hand: 'four of a kind',
        chips: 30,
        mult: 3
    },
    'jupiter': {
        name: 'Jupiter',
        type: 'planet',
        hand: 'flush',
        chips: 15,
        mult: 2
    },
    'saturn': {
        name: 'Saturn',
        type: 'planet',
        hand: 'straight',
        chips: 30,
        mult: 3
    },
    'uranus': {
        name: 'Uranus',
        type: 'planet',
        hand: 'two pair',
        chips: 20,
        mult: 1
    },
    'neptune': {
        name: 'Neptune',
        type: 'planet',
        hand: 'straight flush',
        chips: 40,
        mult: 4
    },
    'pluto': {
        name: 'Pluto',
        type: 'planet',
        hand: 'high card',
        chips: 15,
        mult: 1
    },
    'planetX': {
        name: 'Planet X',
        type: 'planet',
        hand: 'five of a kind',
        chips: 35,
        mult: 3
    },
    'ceres': {
        name: 'Ceres',
        type: 'planet',
        hand: 'flush house',
        chips: 40,
        mult: 4
    },
    'eris': {
        name: 'Eris',
        type: 'planet',
        hand: 'flush five',
        chips: 50,
        mult: 3
    }
}

var tarotCards = {
    'fool': {
        name: 'The Fool',
        type: 'tarot',
        condition: () => 'lastTarotPlanet' in gameVars && gameVars.lastTarotPlanet.name !== 'The Fool',
        effect: () => consumables.push({ ...gameVars.lastTarotPlanet })
    },
    'magician': {
        name: 'The Magician',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 2,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'lucky';
            }
        }
    },
    'highPriestess': {
        name: 'The High Priestess',
        type: 'tarot',
        effect: () => {
            for (i = 0; i < 2; i++) {
                // it works trust me
                consumables.push({ ...Object.values(planetCards).filter(p => p.hand === Object.values(handVars).filter(h => h.available && h.name !== 'royal flush')[Math.floor(Math.random() * Object.values(handVars).filter(h => h.available && h.name !== 'royal flush').length)].name)[0] });

                // if there are duplicates and no showman remove the duplicate
                // also if the planet is undefined remove it
                // also if there are no more available planets just make more
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'planet').length < Object.values(handVars).filter(h => h.available && h.name !== 'royal flush').length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
        }
    },
    'empress': {
        name: 'The Empress',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 2,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'mult';
            }
        }
    },
    'emperor': {
        name: 'The Emporer',
        type: 'tarot',
        effect: () => {
            for (i = 0; i < 2; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...tarotCards[Object.keys(tarotCards)[Math.floor(Math.random() * Object.keys(tarotCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(tarotCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
        }
    },
    'hierophant': {
        name: 'The Hierophant',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 2,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'bonus';
            }
        }
    },
    'lovers': {
        name: 'The Lovers',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'wild';
            }
        }
    },
    'chariot': {
        name: 'The Chariot',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'steel';
            }
        }
    },
    'justice': {
        name: 'Justice',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'glass';
            }
        }
    },
    'hermit': {
        name: 'The Hermit',
        type: 'tarot',
        effect: () => {
            if (gameVars.money >= 20) {
                gameVars.money += 20;
            } else if (gameVars.money > 0) {
                gameVars.money *= 2;
            }
        }
    },
    'wheel': {
        name: 'The Wheel of Fortune',
        type: 'tarot',
        condition: () => jokers.filter(j => !('edition' in j)).length > 0,
        effect: () => {
            if (randomNum < 0.0375) {
                jokers.filter(j => !('edition' in j))[Math.floor(Math.random() * jokers.filter(j => !('edition' in j)).length)].enhancement = 'polychrome';
            } else if (randomNum < 0.0875) {
                jokers.filter(j => !('edition' in j))[Math.floor(Math.random() * jokers.filter(j => !('edition' in j)).length)].enhancement = 'holographic';
            } else if (randomNum < 0.125) {
                jokers.filter(j => !('edition' in j))[Math.floor(Math.random() * jokers.filter(j => !('edition' in j)).length)].enhancement = 'foil';
            }
        }
    },
    'strength': {
        name: 'Strength',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 2,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.rank++;

                if (card.rank >= 15) {
                    card.rank = 2;
                }
            }
        }
    },
    'hangedMan': {
        name: 'The Hanged Man',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 2,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                deck.splice(getCardIndex(card.id), 1);
                hand.splice(hand.findIndex(c => c === card), 1);

                for (joker of jokers) {
                    handleJoker(joker, 'onDestroy');
                }
            }
        }
    },
    'death': {
        name: 'Death',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 2,
        effect: () => {
            let left = hand.filter(c => c.selected)[0];
            let right = hand.filter(c => c.selected)[1];

            left.rank = right.rank;
            left.suit = right.suit;

            if (right.enhancement) {
                left.enhancement = right.enhancement;
            }

            if (right.seal) {
                left.seal = right.seal;
            }

            if (right.edition) {
                left.edition = right.edition;
            }
        }
    },
    'devil': {
        name: 'The Devil',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'gold';
            }
        }
    },
    'tower': {
        name: 'The Tower',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.enhancement = 'stone';
            }
        }
    },
    'star': {
        name: 'The Star',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 3,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.suit = 'diamonds';
            }
        }
    },
    'moon': {
        name: 'The Moon',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 3,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.suit = 'clubs';
            }
        }
    },
    'sun': {
        name: 'The Sun',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 3,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.suit = 'hearts';
            }
        }
    },
    'judgement': {
        name: 'Judgement',
        type: 'tarot',
        effect: () => {
            if (jokers.length < gameVars.maxJokers) {
                jokers.push(Object.values(allJokers).filter(j => {
                    if (j.rarity === 'legendary') {
                        return false;
                    }

                    if (jokers.some(c => c.name === allJokers.showman.name)) {
                        return true;
                    }

                    for (let joker of jokers) {
                        if (j.name === joker.name) {
                            return false;
                        }
                    }
                    return true;
                })[Math.floor(Math.random() * Object.values(allJokers).filter(j => {
                    if (j.rarity === 'legendary') {
                        return false;
                    }

                    if (jokers.some(c => c.name === allJokers.showman.name)) {
                        return true;
                    }

                    for (let joker of jokers) {
                        if (j.name === joker.name) {
                            return false;
                        }
                    }
                    return true;
                }).length)]);
            }
            updateJokers();
        }
    },
    'world': {
        name: 'The World',
        type: 'tarot',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length > 0 && hand.filter(c => c.selected).length <= 3,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.suit = 'spades';
            }
        }
    }
}

var spectralCards = {
    'familiar': {
        name: 'Familiar',
        type: 'spectral',
        effect: () => {
            let destroyedCard = hand[Math.floor(Math.random() * hand.length)];
            hand.splice(hand.findIndex(c => c === destroyedCard), 1);
            deck.splice(getCardIndex(destroyedCard.id), 1);

            card = destroyedCard;
            for (joker of jokers) {
                handleJoker(joker, 'onDestroy');
            }

            for (let i = 0; i < 3; i++) {
                deck.push(new Card('face', 'rand', 'rand'));
                hand.push(deck[deck.length - 1]);
            }
        }
    },
    'grim': {
        name: 'Grim',
        type: 'spectral',
        effect: () => {
            let destroyedCard = hand[Math.floor(Math.random() * hand.length)];
            hand.splice(hand.findIndex(c => c === destroyedCard), 1);
            deck.splice(getCardIndex(destroyedCard.id), 1);

            card = destroyedCard;
            for (joker of jokers) {
                handleJoker(joker, 'onDestroy');
            }

            for (let i = 0; i < 2; i++) {
                deck.push(new Card('ace', 'rand', 'rand'));
                hand.push(deck[deck.length - 1]);
            }
        }
    },
    'incantation': {
        name: 'Incantation',
        type: 'spectral',
        effect: () => {
            let destroyedCard = hand[Math.floor(Math.random() * hand.length)];
            hand.splice(hand.findIndex(c => c === destroyedCard), 1);
            deck.splice(getCardIndex(destroyedCard.id), 1);

            card = destroyedCard;
            for (joker of jokers) {
                handleJoker(joker, 'onDestroy');
            }

            for (let i = 0; i < 4; i++) {
                deck.push(new Card('num', 'rand', 'rand'));
                hand.push(deck[deck.length - 1]);
            }
        }
    },
    'talisman': {
        name: 'Talisman',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.seal = 'gold';
            }
        }
    },
    'aura': {
        name: 'Aura',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                let random = Math.random();
                if (random < 0.15) {
                    card.edition = 'polychrome';
                } else if (random < 0.5) {
                    card.edition = 'holographic';
                } else {
                    card.edition = 'foil';
                }
            }
        }
    },
    'wraith': {
        name: 'Wraith',
        type: 'spectral',
        effect: () => {
            jokers.push(Object.values(allJokers).filter(j => j.rarity === 'rare')[Math.floor(Math.random() * Object.values(allJokers).filter(j => j.rarity === 'rare').length)]);
            updateJokers();

            gameVars.money = 0;
        }
    },
    'sigil': {
        name: 'Sigil',
        type: 'spectral',
        effect: () => {
            let newSuit = allSuits[Math.floor(Math.random() * allSuits.length)];
            for (card of hand) {
                card.suit = newSuit;
            }
        }
    },
    'ouija': {
        name: 'Ouija',
        type: 'spectral',
        effect: () => {
            let newRank = Math.floor(Math.random() * 13) + 2;
            for (card of hand) {
                card.rank = newRank;
            }

            gameVars.handSize--;
        }
    },
    'ectoplasm': {
        name: 'Ectoplasm',
        type: 'spectral',
        effect: () => {
            jokers[Math.floor(Math.random() * jokers.length)].edition = 'negative';

            gameVars.handSize--;
        }
    },
    'immolate': {
        name: 'Immolate',
        type: 'spectral',
        effect: () => {
            for (let i = 0; i < 5; i++) {
                let destroyedCard = hand[Math.floor(Math.random() * hand.length)];
                hand.splice(hand.findIndex(c => c === destroyedCard), 1);
                deck.splice(getCardIndex(destroyedCard.id), 1);
            }

            gameVars.money += 20;
        }
    },
    'ankh': {
        name: 'Ankh',
        type: 'spectral',
        effect: () => {
            let copiedJoker = jokers[Math.floor(Math.random() * jokers.length)];

            for (joker of jokers.filter(j => j !== copiedJoker)) {
                jokers.splice(jokers.findIndex(j => j === joker), 1);
            }

            jokers.push({ ...copiedJoker });
            updateJokers();
        }
    },
    'dejaVu': {
        name: 'Deja Vu',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.seal = 'red';
            }
        }
    },
    'hex': {
        name: 'Hex',
        type: 'spectral',
        effect: () => {
            let hexedJoker = jokers[Math.floor(Math.random() * jokers.length)];

            for (joker of jokers.filter(j => j !== hexedJoker)) {
                jokers.splice(jokers.findIndex(j => j === joker), 1);
            }

            jokers[jokers.findIndex(j => j === hexedJoker)].edition = 'polychrome';
        }
    },
    'trance': {
        name: 'Trance',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.seal = 'blue';
            }
        }
    },
    'medium': {
        name: 'Medium',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            for (card of hand.filter(c => c.selected)) {
                card.seal = 'purple';
            }
        }
    },
    'cryptid': {
        name: 'Cryptid',
        type: 'spectral',
        deselecting: true,
        condition: () => hand.filter(c => c.selected).length === 1,
        effect: () => {
            let card = hand.filter(c => c.selected)[0];
            for (let i = 0; i < 2; i++) {
                deck.push(new Card(card.rank, card.suit));

                if (card.enhancement) {
                    deck[deck.length - 1].enhancement = card.enhancement;
                }

                if (card.seal) {
                    deck[deck.length - 1].seal = card.seal;
                }

                if (card.edition) {
                    deck[deck.length - 1].edition = card.edition;
                }

                hand.push(deck[deck.length - 1]);
            }
        }
    },
    'soul': {
        name: 'Soul',
        type: 'spectral',
        effect: () => {
            jokers.push(Object.values(allJokers).filter(j => j.rarity === 'legendary')[Math.floor(Math.random() * Object.values(allJokers).filter(j => j.rarity === 'legendary').length)]);
            updateJokers();
        }
    },
    'blackHole': {
        name: 'Black Hole',
        type: 'spectral',
        effect: () => {
            for (handType of Object.keys(gameVars.handLevels)) {
                gameVars.handLevels[handType]++;
            }
        }
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
    onDestroy - Triggered when a card is destroyed
    copyAbility - Triggered before every trigger, used for modifying blueprint or brainstorm

    Skipped Jokers:
    Credit Card
    Ceremonial Dagger
    Choas the Clown
    Space Joker
    Egg
    Constellation
    Red Card
    Riff Raff
    Hologram
    Rocket
    Luchador
    Gift Card
    To the Moon
    Hallucination
    Fortune Teller
    Baseball Card
    Diet Cola
    Flash Card
    Campfire
    Swashbuckler
    Throwback
    Matador
    Invisible Joker
    Satellite
    Cartomancer
    Astronomer
    Burnt Joker
    Canio
    Chicot
    Perkeo

    Also skipped temperance tarot card

    Unfinished Jokers:
    Cavedish (should only appear in shop once michel is destroyed)
    Madness (don't do stuff on boss blind)
    Showman (add shop and stuff)

    Current Joker - MY MOM (HEYO!!! (GOTTEM!!1!))
*/
var allJokers = {
    'joker': {
        name: 'Joker',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult += 4
    },
    'greedyJoker': {
        name: 'Greedy Joker',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.suit === 'diamonds' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'hearts') || card.enhancement === 'wild',
        effect: () => currentScore.mult += 3
    },
    'lustyJoker': {
        name: 'Lusty Joker',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.suit === 'hearts' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'diamonds') || card.enhancement === 'wild',
        effect: () => currentScore.mult += 3
    },
    'wrathfulJoker': {
        name: 'Wrathful Joker',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.suit === 'spades' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'clubs') || card.enhancement === 'wild',
        effect: () => currentScore.mult += 3
    },
    'gluttonousJoker': {
        name: 'Gluttonous Joker',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.suit === 'clubs' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'spades') || card.enhancement === 'wild',
        effect: () => currentScore.mult += 3
    },
    'jollyJoker': {
        name: 'Jolly Joker',
        rarity: 'common',
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
        rarity: 'common',
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
        rarity: 'common',
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
        rarity: 'common',
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

            if (tempHand.length === 5 || (jokers.find(j => j.name === allJokers.fourFingers.name) && tempHand.length >= 4)) {
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
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5 || (jokers.find(j => j.name === allJokers.fourFingers.name) && playedHand.length >= 4)) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit === playedHand[i - 1].suit || playedHand[i].enhancement === 'wild' || playedHand[i - 1].enhancement === 'wild') {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else if (jokers.find(j => j.name === allJokers.smearedJoker.name) &&
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
        rarity: 'common',
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
        rarity: 'common',
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
        rarity: 'common',
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
        rarity: 'common',
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

            if (tempHand.length === 5 || (jokers.find(j => j.name === allJokers.fourFingers.name) && tempHand.length >= 4)) {
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
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.length === 5 || (jokers.find(j => j.name === allJokers.fourFingers.name) && playedHand.length >= 4)) {
                for (i = 1; i < playedHand.length; i++) {
                    if (playedHand[i].suit === playedHand[i - 1].suit || playedHand[i].enhancement === 'wild' || playedHand[i - 1].enhancement === 'wild') {
                        if (i === playedHand.length - 1) {
                            return true;
                        }
                    } else if (jokers.find(j => j.name === allJokers.smearedJoker.name) &&
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
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => playedHand.length <= 3,
        effect: () => currentScore.mult += 20
    },
    'jokerStencil': {
        name: 'Joker Stencil',
        rarity: 'uncommon',
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
        name: 'Four Fingers',
        rarity: 'uncommon'
    },
    'mime': {
        name: 'Mime',
        rarity: 'uncommon',
        retriggering: true,
        trigger: 'heldInHand',
        effect: () => handleHeldCard(card, true)
    },
    'banner': {
        name: 'Banner',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.chips += gameVars.currentDiscards * 30
    },
    'mysticSummit': {
        name: 'Mystic Summit',
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => gameVars.currentDiscards === 0,
        effect: () => currentScore.mult += 15
    },
    'marbleJoker': {
        name: 'Marble Joker',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => deck.push(new Card('rand', 'rand', 'stone'))
    },
    'loyaltyCard': {
        name: 'Loyalty Card',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => {
            if (!('loyaltyCardCountdown' in gameVars)) {
                gameVars.loyaltyCardCountdown = 6;
            }

            if (gameVars.loyaltyCardCountdown === 0) {
                gameVars.loyaltyCardCountdown = 6;
                return true;
            }
        },
        effect: () => currentScore.mult *= 4,
        modifyTrigger: 'beforeScore',
        modifyEffect: () => {
            if (!('loyaltyCardCountdown' in gameVars)) {
                gameVars.loyaltyCardCountdown = 6;
            }
            gameVars.loyaltyCardCountdown--;
        }
    },
    '8ball': {
        name: '8 Ball',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.rank === 8 && Math.floor(Math.random() * 4) < 1 + gameVars.probabilitySkew,
        effect: () => {
            for (i = 0; i < 1; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...tarotCards[Object.keys(tarotCards)[Math.floor(Math.random() * Object.keys(tarotCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(tarotCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
            updateConsumables();
        }
    },
    'misprint': {
        name: 'Misprint',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult += Math.floor(Math.random() * 24)
    },
    'dusk': {
        name: 'Dusk',
        rarity: 'uncommon',
        trigger: 'duringScore',
        retriggering: true,
        condition: () => gameVars.currentHands === 0,
        effect: () => handleCard(card, true)
    },
    'raisedFist': {
        name: 'Raised Fist',
        rarity: 'common',
        trigger: 'heldInHand',
        condition: () => card === hand.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard),
        effect: () => {
            currentScore.mult += hand.reduce((minCard, card) => card.rank < minCard.rank ? card : minCard).rank * 2
        }
    },
    'fibonacci': {
        name: 'Fibonacci',
        rarity: 'uncommon',
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
        rarity: 'uncommon',
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
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank <= 13 && card.rank >= 11),
        effect: () => currentScore.chips += 30
    },
    'abstractJoker': {
        name: 'Abstract Joker',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult += jokers.length * 3
    },
    'delayedGratification': {
        name: 'Delayed Gratification',
        rarity: 'common',
        trigger: 'roundEnd',
        condition: () => gameVars.firstDiscard,
        effect: () => gameVars.money += gameVars.currentDiscards * 2
    },
    'hack': {
        name: 'Hack',
        rarity: 'common',
        trigger: 'duringScore',
        retriggering: true,
        condition: () => card.rank <= 5 && card.rank >= 2 && card.enhancement !== 'stone',
        effect: () => handleCard(card, true)
    },
    'pareidolia': {
        name: 'Pareidolia',
        rarity: 'common'
    },
    'grosMichel': {
        name: 'Gros Michel',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult += 15,
        modifyTrigger: 'roundEnd',
        modifyCondition: () => Math.floor(Math.random() * 6) < 1 + gameVars.probabilitySkew,
        modifyEffect: function () {
            jokers.splice(jokers.findIndex(joker => joker === this), 1);
            gameVars.michelDestroyed = true;
        }
    },
    'evenSteven': {
        name: 'Even Steven',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.rank <= 10 && card.rank % 2 === 0,
        effect: () => currentScore.mult += 4
    },
    'oddTodd': {
        name: 'Odd Todd',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => (card.rank <= 10 && card.rank & 2 === 1) || card.rank === 14,
        effect: () => currentScore.chips += 31
    },
    'scholar': {
        name: 'Scholar',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.rank === 14,
        effect: () => {
            currentScore.chips += 20;
            currentScore.mult += 4;
        }
    },
    'businessCard': {
        name: 'Business Card',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => (jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank <= 13 && card.rank >= 11)) && Math.floor(Math.random() * 2) < 1 + gameVars.probabilitySkew,
        effect: () => gameVars.money += 2
    },
    'supernova': {
        name: 'Supernova',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult += gameVars.playedHands[getHandType(playedHand)]
    },
    'rideTheBus': {
        name: 'Ride the Bus',
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => {
            if (!('rideTheBusMult' in gameVars)) {
                gameVars.rideTheBusMult = 0;
            }

            // check if there aren't any face cards in the hand
            if (!playedHand.map((card) => {
                if (card.rank <= 13 && card.rank >= 11 && !jokers.find(j => j.name === allJokers.pareidolia.name)) {
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
    'burglar': {
        name: 'Burglar',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => {
            gameVars.currentHands += 3;
            gameVars.currentDiscards = 0;
        }
    },
    'blackboard': {
        name: 'Blackboard',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => hand.filter(c => (c.suit === 'hearts' || c.suit === 'diamonds') && c.enhancement !== 'wild').length === 0,
        effect: () => currentScore.mult *= 3
    },
    'runner': {
        name: 'Runner',
        rarity: 'common',
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
        rarity: 'common',
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
        rarity: 'rare',
        trigger: 'beforeScore',
        condition: () => gameVars.firstHand && playedHand.length === 1,
        effect: () => {
            deck.push(new Card(card.rank, card.suit, card.enhancement, card.seal, card.edition));
            hand.push(deck[deck.length - 1]);
        }
    },
    'splash': {
        name: 'Splash',
        rarity: 'common',
        trigger: 'beforeScore',
        effect: () => {
            for (let card of playedHand) {
                card.scoring = true;
            }
        }
    },
    'blueJoker': {
        name: 'Blue Joker',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.chips += deck.filter(c => !c.dealt).length * 2
    },
    'sixthSense': {
        name: 'Sixth Sense',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => playedHand.length === 1 && playedHand[0].rank === 6 && gameVars.firstHand,
        effect: () => {
            deck.splice(getCardIndex(playedHand[0].id), 1);
            for (i = 0; i < 1; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...spectralCards[Object.keys(spectralCards)[Math.floor(Math.random() * Object.keys(spectralCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(spectralCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
            updateConsumables();
        }
    },
    'hiker': {
        name: 'Hiker',
        rarity: 'uncommon',
        trigger: 'duringScore',
        effect: () => {
            if (!('bonusChips' in card)) {
                card.bonusChips = 0;
            }

            card.bonusChips += 5;
        }
    },
    'facelessJoker': {
        name: 'Faceless Joker',
        rarity: 'common',
        trigger: 'onDiscard',
        condition: () => playedHand.filter(c => c.rank >= 11 && c.rank <= 13).length >= 3,
        effect: () => gameVars.money += 3
    },
    'greenJoker': {
        name: 'Green Joker',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => {
            if (!('greenJokerMult' in gameVars)) {
                gameVars.greenJokerMult = 0;
            }
            gameVars.greenJokerMult++;

            currentScore.mult += gameVars.greenJokerMult;
        },
        modifyTrigger: 'onDiscard',
        modifyCondition: () => 'greenJokerMult' in gameVars && gameVars.greenJokerMult > 0,
        modifyEffect: () => gameVars.greenJokerMult--
    },
    'superposition': {
        name: 'Superposition',
        rarity: 'common',
        trigger: 'beforeScore',
        condition: () => {
            if ((getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush') && playedHand.reduce((c1, c2) => c1.rank === 14 || c2.rank === 14)) {
                return true;
            }
        },
        effect: () => {
            for (i = 0; i < 1; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...tarotCards[Object.keys(tarotCards)[Math.floor(Math.random() * Object.keys(tarotCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(tarotCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
            updateConsumables();
        }
    },
    'toDoList': {
        name: 'To Do List',
        rarity: 'common',
        trigger: 'afterScore',
        condition: () => {
            if (!('toDoTarget' in gameVars)) {
                while (true) {
                    let randomHandType = Object.keys(handVars)[Math.floor(Math.random() * Object.keys(handVars).length)];
                    if (handVars[randomHandType].available) {
                        gameVars.toDoTarget = randomHandType;
                        break;
                    }
                }
            }

            return getHandType(playedHand) === gameVars.toDoTarget;
        },
        effect: () => gameVars.money += 5,
        modifyTrigger: 'roundEnd',
        modifyEffect: () => {
            while (true) {
                let randomHandType = Object.keys(handVars)[Math.floor(Math.random() * Object.keys(handVars).length)];
                if (handVars[randomHandType].available) {
                    gameVars.toDoTarget = randomHandType;
                    break;
                }
            }
        }
    },
    'cavendish': {
        name: 'Cavendish',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => currentScore.mult *= 3,
        modifyCondition: () => Math.floor(Math.random() * 1000) < 1 + gameVars.probabilitySkew,
        modifyEffect: function () {
            jokers.splice(jokers.findIndex(joker => joker === this), 1);
            gameVars.michelDestroyed = true;
        }
    },
    'cardSharp': {
        name: 'Card Sharp',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => {
            if (getHandType(playedHand) in gameVars.startOfRoundPlayedHands) {
                return gameVars.playedHands[getHandType(playedHand)] > gameVars.startOfRoundPlayedHands[getHandType(playedHand)] + 1
            } else {
                return gameVars.playedHands[getHandType(playedHand)] > 1
            }
        },
        effect: () => currentScore.mult *= 3,
        modifyTrigger: 'roundStart',
        modifyEffect: () => gameVars.startOfRoundPlayedHands = { ...gameVars.playedHands }
    },
    'madness': {
        name: 'Madness',
        rarity: 'uncommon',
        trigger: 'afterScore',
        effect: () => currentScore.mult *= gameVars.madnessMult,
        modifyTrigger: 'roundStart',
        modifyEffect: () => {
            if (!('madnessMult' in gameVars)) {
                gameVars.madnessMult = 1;
            }
            gameVars.madnessMult += 0.5;

            // check if madness is the only joker
            if (jokers.filter(j => j !== allJokers.madness).length > 1) {
                // deletes a random joker that isn't madness
                jokers.splice(jokers.findIndex(j => j === jokers.filter(j => j !== allJokers.madness)[Math.random() * jokers.filter(j => j !== allJokers.madness).length]), 1);
            }
        }
    },
    'squareJoker': {
        name: 'Square Joker',
        rarity: 'common',
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
        rarity: 'uncommon',
        trigger: 'beforeScore',
        condition: () => getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush',
        effect: () => {
            for (i = 0; i < 1; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...spectralCards[Object.keys(spectralCards)[Math.floor(Math.random() * Object.keys(spectralCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(spectralCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
            updateConsumables();
        }
    },
    'vampire': {
        name: 'Vampire',
        rarity: 'uncommon',
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
    'shortCut': {
        name: 'Shortcut',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => gameVars.straightGap = 1
    },
    'vagabond': {
        name: 'Vagabond',
        rarity: 'rare',
        trigger: 'beforeScore',
        condition: () => gameVars.money <= 4,
        effect: () => {
            for (i = 0; i < 1; i++) {
                // push a random tarot to the consumables
                consumables.push({ ...tarotCards[Object.keys(tarotCards)[Math.floor(Math.random() * Object.keys(tarotCards).length)]] });

                // if there are duplicates and no showman remove the duplicate
                // also if the tarot is undefined remove it
                // also if there are no more unused tarots ignore this
                if ((consumables.some(c => c.name === consumables[consumables.length - 1].name && c !== consumables[consumables.length - 1]) && !jokers.find(j => j.name === allJokers.showman.name)) && consumables.filter(c => c.type === 'tarot' && c.name !== 'The Emporer').length < Object.keys(tarotCards).length || Object.keys(consumables[consumables.length - 1]).length === 0) {
                    consumables.pop();
                    i--;
                }
            }
            updateConsumables();
        }
    },
    'baron': {
        name: 'Baron',
        rarity: 'rare',
        trigger: 'heldInHand',
        condition: () => card.rank === 13,
        effect: () => currentScore.mult *= 1.5
    },
    'cloud9': {
        name: 'Cloud 9',
        rarity: 'uncommon',
        trigger: 'roundEnd',
        condition: () => deck.filter(c => c.rank === 9 && c.enhancement !== 'stone').length > 0,
        effect: () => gameVars.money += deck.filter(c => c.rank === 9 && c.enhancement !== 'stone').length
    },
    'obelisk': {
        name: 'Obelisk',
        rarity: 'rare',
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
        rarity: 'uncommon',
        trigger: 'beforeScore',
        condition: () => jokers.find(j => j.name === allJokers.pareidolia.name) || playedHand.find(c => c.rank >= 11 && c.rank <= 13) !== undefined,
        effect: () => {
            for (card of playedHand) {
                if (jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank >= 11 && card.rank <= 13)) {
                    card.enhancement = 'gold';
                }
            }
        }
    },
    'photograph': {
        name: 'Photograph',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => {
            if (!('firstPlayedFace' in gameVars)) {
                gameVars.firstPlayedFace = true;
            }

            if (card === playedHand[gameVars.firstPlayedFaceCardPos + 1]) {
                gameVars.firstPlayedFace = false;
            }

            if ((jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank <= 13 && card.rank >= 11)) && gameVars.firstPlayedFace) {
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
    'turtleBean': {
        name: 'Turtle Bean',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => {
            if (!('turtleBeanHandSize' in gameVars)) {
                gameVars.turtleBeanHandSize = 5;
            }
            gameVars.handSize += gameVars.turtleBeanHandSize;
        },
        modifyTrigger: 'roundEnd',
        modifyEffect: () => {
            gameVars.handSize -= gameVars.turtleBeanHandSize;
            gameVars.turtleBeanHandSize--;
        }
    },
    'erosion': {
        name: 'Erosion',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => deck.length < 52,
        effect: () => currentScore.mult += (52 - deck.length) * 4
    },
    'reservedParking': {
        name: 'Reserved Parking',
        rarity: 'common',
        trigger: 'heldInHand',
        condition: () => ((card.rank <= 13 && card.rank >= 11) || jokers.find(j => j.name === allJokers.pareidolia.name)) && Math.floor(Math.random() * 2) < 1 + gameVars.probabilitySkew,
        effect: () => gameVars.money += 1
    },
    'mailInRebate': {
        name: 'Mail-In Rebate',
        rarity: 'common',
        trigger: 'onDiscard',
        condition: () => playedHand.filter(c => c.rank === gameVars.mailInRank).length > 0,
        effect: () => gameVars.money += playedHand.filter(c => c.rank === gameVars.mailInRank).length * 3,
        modifyTrigger: 'roundStart',
        modifyEffect: () => gameVars.mailInRank = Math.floor(Math.random() * 13) + 2
    },
    'juggler': {
        name: 'Juggler',
        rarity: 'common',
        trigger: 'roundStart',
        effect: () => gameVars.handSize++,
        modifyTrigger: 'roundEnd',
        modifyEffect: () => gameVars.handSize--
    },
    'drunkard': {
        name: 'Drunkard',
        rarity: 'common',
        trigger: 'roundStart',
        effect: () => gameVars.maxDiscards++,
        modifyTrigger: 'roundEnd',
        modifyEffect: () => gameVars.maxDiscards--
    },
    'stoneJoker': {
        name: 'Stone Joker',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => deck.find(c => c.enhancement === 'stone') !== undefined,
        effect: () => currentScore.chips += deck.filter(c => c.enhancement === 'stone').length * 25
    },
    'goldenJoker': {
        name: 'Golden Joker',
        rarity: 'common',
        trigger: 'roundEnd',
        effect: () => gameVars.money += 4
    },
    'luckyCat': {
        name: 'Lucky Cat',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => 'luckyHits' in gameVars && gameVars.luckyHits > 0,
        effect: () => currentScore.mult *= gameVars.luckyHits * 0.25 + 1
    },
    'bull': {
        name: 'Bull',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => gameVars.money > 0,
        effect: () => currentScore.chips += gameVars.money * 2
    },
    'tradingCard': {
        name: 'Trading Card',
        rarity: 'uncommon',
        trigger: 'onDiscard',
        condition: () => gameVars.firstDiscard && playedHand.length === 1,
        effect: () => {
            gameVars.money += 3;
            deck.splice(getCardIndex(playedHand[0].id), 1);
        }
    },
    'popcorn': {
        name: 'Popcorn',
        rarity: 'common',
        trigger: 'afterScore',
        effect: () => {
            if (!('popcornMult' in gameVars)) {
                gameVars.popcornMult = 20;
            }
            currentScore.mult += gameVars.popcornMult;
        },
        modifyTrigger: 'roundEnd',
        modifyEffect: function () {
            gameVars.popcornMult -= 4;
            if (gameVars.popcornMult <= 0) {
                jokers.splice(jokers.findIndex(j => j === this), 1);
            }
        }
    },
    'spareTrousers': {
        name: 'Spare Trousers',
        rarity: 'uncommon',
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
    'ancientJoker': {
        name: 'Ancient Joker',
        rarity: 'rare',
        trigger: 'duringScore',
        condition: () => card.suit === gameVars.ancientJokerSuit || card.enhancement === 'wild',
        effect: () => currentScore.mult *= 1.5,
        modifyTrigger: 'roundStart',
        modifyEffect: () => gameVars.ancientJokerSuit = allSuits[Math.floor(Math.random() * allSuits.length)]
    },
    'ramen': {
        name: 'Ramen',
        rarity: 'uncommon',
        trigger: 'afterScore',
        effect: () => {
            if (!('ramenMult' in gameVars)) {
                gameVars.ramenMult = 2;
            }
            currentScore.mult *= gameVars.ramenMult;
        },
        modifyTrigger: 'onDiscard',
        modifyEffect: function () {
            if (!('ramenMult' in gameVars)) {
                gameVars.ramenMult = 2;
            }
            gameVars.ramenMult -= playedHand.length / 100;

            if (gameVars.ramenMult <= 1) {
                jokers.splice(jokers.findIndex(j => j === this), 1);
            }
        }
    },
    'walkieTalkie': {
        name: 'Walkie Talkie',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.rank === 4 || card.rank === 10,
        effect: () => {
            currentScore.chips += 10;
            currentScore.mult += 4;
        }
    },
    'seltzer': {
        name: 'Seltzer',
        rarity: 'uncommon',
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
    'castle': {
        name: 'Castle',
        rarity: 'uncommon',
        trigger: 'afterScore',
        effect: () => {
            if (!('castleChips' in gameVars)) {
                gameVars.castleChips = 0;
            }

            currentScore.chips += gameVars.castleChips;
        },
        modifyTriggers: ['onDiscard', 'roundStart'],
        modifyConditions: [() => playedHand.filter(c => c.suit === gameVars.castleSuit || c.enhancement === 'wild').length > 0],
        modifyEffects: [() => {
            if (!('castleChips' in gameVars)) {
                gameVars.castleChips = 0;
            }

            gameVars.castleChips += playedHand.filter(c => c.suit === gameVars.castleSuit || c.enhancement === 'wild').length * 3;
        }, () => gameVars.castleSuit = allSuits[Math.floor(Math.random() * allSuits.length)]]
    },
    'smileyFace': {
        name: 'Smiley Face',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank >= 11 && card.rank <= 13),
        effect: () => currentScore.mult += 5
    },
    'goldenTicket': {
        name: 'Golden Ticket',
        rarity: 'common',
        trigger: 'duringScore',
        condition: () => card.enhancement === 'gold',
        effect: () => gameVars.money += 4
    },
    'mrBones': {
        name: 'Mr. Bones',
        rarity: 'uncommon'
    },
    'acrobat': {
        name: 'Acrobat',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => gameVars.currentHands === 0,
        effect: () => currentScore.mult *= 3
    },
    'sockAndBuskin': {
        name: 'Sock and Buskin',
        rarity: 'uncommon',
        retriggering: true,
        trigger: 'duringScore',
        condition: () => jokers.find(j => j.name === allJokers.pareidolia.name) || (card.rank <= 13 && card.rank >= 11),
        effect: () => handleCard(card, true)
    },
    'troubadour': {
        name: 'Troubadour',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => {
            gameVars.handSize += 2;
            gameVars.maxHands--;
        },
        modifyTrigger: 'roundEnd',
        modifyEffect: () => {
            gameVars.handSize -= 2;
            gameVars.maxHands++;
        }
    },
    'certificate': {
        name: 'Certificate',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => {
            deck.push(new Card('rand', 'rand', 'none', 'rand'));
            hand.push(deck[deck.length - 1]);
        }
    },
    'smearedJoker': {
        name: 'Smeared Joker',
        rarity: 'uncommon'
    },
    'hangingChad': {
        name: 'Hanging Chad',
        rarity: 'common',
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
        rarity: 'uncommon',
        trigger: 'duringScore',
        condition: () => card.suit === 'diamonds' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'hearts') || card.enhancement === 'wild',
        effect: () => gameVars.money++
    },
    'bloodStone': {
        name: 'Bloodstone',
        rarity: 'uncommon',
        trigger: 'duringScore',
        condition: () => (card.suit === 'hearts' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'diamonds') || card.enhancement === 'wild') && Math.floor(Math.random() * 2) < 1 + gameVars.probabilitySkew,
        effect: () => currentScore.mult *= 1.5
    },
    'arrowHead': {
        name: 'Arrowhead',
        rarity: 'uncommon',
        trigger: 'duringScore',
        condition: () => card.suit === 'spades' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'clubs') || card.enhancement === 'wild',
        effect: () => currentScore.chips += 50
    },
    'onyxAgate': {
        name: 'Onyx Agate',
        rarity: 'uncommon',
        trigger: 'duringScore',
        condition: () => card.suit === 'clubs' || (jokers.find(j => j.name === allJokers.smearedJoker.name) && card.suit === 'spades') || card.enhancement === 'wild',
        effect: () => currentScore.mult += 7
    },
    'glassJoker': {
        name: 'Glass Joker',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => 'glassBreaks' in gameVars && gameVars.glassBreaks > 0,
        effect: () => currentScore.mult *= 0.75 * gameVars.glassBreaks + 1
    },
    'showman': {
        name: 'Showman',
        rarity: 'uncommon'
    },
    'flowerPot': {
        name: 'Flower Pot',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => {
            if (playedHand.some(card => card.suit === 'spades') && playedHand.some(card => card.suit === 'hearts') && playedHand.some(card => card.suit === 'clubs') && playedHand.some(card => card.suit === 'diamonds')) {
                return true;
            }

            // to account for smeared joker
            if (jokers.find(j => j.name === allJokers.smearedJoker.name)) {
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

            // to account for wild cards
            let unseenSuitCount = 4;
            for (suit of allSuits) {
                if (playedHand.some(c => c.suit === suit)) {
                    unseenSuitCount--;
                }
            }

            if (unseenSuitCount <= playedHand.filter(c => c.enhancement === 'wild').length) {
                return true;
            }
        },
        effect: () => currentScore.mult *= 3
    },
    'blueprint': {
        name: 'Blueprint',
        rarity: 'rare',
        modifyTrigger: 'copyAbility',
        modifyEffect: function () {
            if (jokers[jokers.findIndex(j => j === this) + 1]) {
                if ('retriggering' in jokers[jokers.findIndex(j => j === this) + 1]) {
                    this.retriggering = jokers[jokers.findIndex(j => j === this) + 1].retriggering;
                }
                if ('trigger' in jokers[jokers.findIndex(j => j === this) + 1]) {
                    this.trigger = jokers[jokers.findIndex(j => j === this) + 1].trigger;
                }
                if ('condition' in jokers[jokers.findIndex(j => j === this) + 1]) {
                    this.condition = jokers[jokers.findIndex(j => j === this) + 1].condition;
                }
                if ('effect' in jokers[jokers.findIndex(j => j === this) + 1]) {
                    this.effect = jokers[jokers.findIndex(j => j === this) + 1].effect;
                }
            }
        }
    },
    'weeJoker': {
        name: 'Wee Joker',
        rarity: 'rare',
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
    'merryAndy': {
        name: 'Merry Andy',
        rarity: 'uncommon',
        trigger: 'roundStart',
        effect: () => {
            gameVars.maxDiscards += 3;
            gameVars.handSize--;
        },
        modifyTrigger: 'roundEnd',
        modifyEffect: () => {
            gameVars.maxDiscards -= 3;
            gameVars.handSize++;
        }
    },
    'oopsAllSixes': {
        name: 'Oops! All 6s',
        rarity: 'uncommon',
        trigger: 'beforeScore',
        effect: () => gameVars.probabilitySkew = jokers.filter(j => j === allJokers.oopsAllSixes).length
    },
    'theIdol': {
        name: 'The Idol',
        rarity: 'uncommon',
        trigger: 'duringScore',
        condition: () => card.rank === gameVars.idolCard.rank && (card.suit === gameVars.idolCard.suit || card.enhancement === 'wild'),
        effect: () => currentScore.mult *= 2,
        modifyTrigger: 'roundStart',
        modifyEffect: () => {
            let randomCard = deck[Math.floor(Math.random() * deck.length)];
            gameVars.idolCard = {};
            gameVars.idolCard.rank = randomCard.rank;
            gameVars.idolCard.suit = randomCard.suit;
        }
    },
    'seeingDouble': {
        name: 'Seeing Double',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => playedHand.some(card => card.suit === 'clubs' && card.scoring) && playedHand.some(card => card.suit !== 'clubs' && card.scoring) || playedHand.some(card => card.suit === 'clubs' && card.scoring) && playedHand.some(card => card.enhancement === 'wild' && card.scoring) || playedHand.some(card => card.enhancement === 'wild' && card.scoring) && playedHand.some(card => card.suit !== 'clubs' && card.scoring),
        effect: () => currentScore.mult *= 2
    },
    'hitTheRoad': {
        name: 'hitTheRoad',
        rarity: 'rare',
        trigger: 'afterScore',
        effect: () => currentScore.mult *= gameVars.hitTheRoadMult,
        modifyTriggers: ['roundStart', 'onDiscard'],
        modifyConditions: [() => true, () => playedHand.filter(c => c.rank === 11).length > 0],
        modifyEffects: [() => gameVars.hitTheRoadMult = 1, () => gameVars.hitTheRoadMult += playedHand.filter(c => c.rank === 11).length * 0.5]
    },
    'theDuo': {
        name: 'The Duo',
        rarity: 'rare',
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
        rarity: 'rare',
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
        rarity: 'rare',
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
        rarity: 'rare',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'straight' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush',
        effect: () => currentScore.mult *= 3
    },
    'theTribe': {
        name: 'The Tribe',
        rarity: 'rare',
        trigger: 'afterScore',
        condition: () => getHandType(playedHand) === 'flush' || getHandType(playedHand) === 'straight flush' || getHandType(playedHand) === 'royal flush' || getHandType(playedHand) === 'flush five' || getHandType(playedHand) === 'flush house',
        effect: () => currentScore.mult *= 2
    },
    'stuntman': {
        name: 'Stuntman',
        rarity: 'rare',
        trigger: 'afterScore',
        effect: () => currentScore.chips += 250,
        modifyTriggers: ['roundStart', 'roundEnd'],
        modifyEffects: [() => gameVars.handSize -= 2, () => gameVars.handSize += 2]
    },
    'brainstorm': {
        name: 'Blueprint',
        rarity: 'rare',
        modifyTrigger: 'copyAbility',
        modifyEffect: function () {
            if ('retriggering' in jokers[0]) {
                this.retriggering = jokers[0].retriggering;
            }
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
    'shootTheMoon': {
        name: 'Shoot the Moon',
        rarity: 'common',
        trigger: 'heldInHand',
        condition: () => card.rank === 12,
        effect: () => currentScore.mult += 13
    },
    'driversLiscense': {
        name: 'Drivers Liscense',
        rarity: 'rare',
        trigger: 'afterScore',
        condition: () => deck.filter(c => c.enhancement).length >= 16,
        effect: () => currentScore.mult *= 3
    },
    'bootStraps': {
        name: 'Bootstraps',
        rarity: 'uncommon',
        trigger: 'afterScore',
        condition: () => gameVars.money >= 5,
        effect: () => currentScore.mult += Math.floor(gameVars.money / 5) * 2
    },
    'triboulet': {
        name: 'Triboulet',
        rarity: 'legendary',
        trigger: 'duringScore',
        condition: () => card.rank === 12 || card.rank === 13,
        effect: () => currentScore.mult *= 2
    },
    'yorick': {
        name: 'Yorick',
        rarity: 'legendary',
        trigger: 'afterScore',
        condition: () => 'yorickMult' in gameVars && gameVars.yorickMult > 1,
        effect: () => currentScore.mult *= gameVars.yorickMult,
        countDown: 23,
        modifyTrigger: 'onDiscard',
        modifyEffect: function () {
            if (!('yorickMult' in gameVars)) {
                gameVars.yorickMult = 1;
            }

            this.countDown -= playedHand.length;
            if (this.countDown <= 0) {
                gameVars.yorickMult++;
                this.countDown += 23;
            }
        }
    }
}

// see how many jokers are in there
// console.log(`${Object.keys(allJokers).length} jokers added!\n${Number((Object.keys(allJokers).length / 150).toFixed(3)) * 100}% complete!`)

var cardsSpawned = 0;
var allSuits = ['spades', 'hearts', 'clubs', 'diamonds'];
let allEnhancements = ['bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky'];
let allSeals = ['red', 'blue', 'gold', 'purple'];
let allEditions = ['foil', 'holographic', 'polychrome'];
// card constructor function
function Card(rank, suit, enhancement, seal, edition) {
    if (rank === 'rand') {
        this.rank = Math.floor(Math.random() * 13) + 2;
    } else if (rank === 'ace') {
        this.rank = 14;
    } else if (rank === 'face') {
        this.rank = Math.floor(Math.random() * 3) + 11;
    } else if (rank === 'num') {
        this.rank = Math.floor(Math.random() * 9) + 2;
    } else {
        this.rank = rank;
    }

    if (suit === 'rand') {
        this.suit = allSuits[Math.floor(Math.random() * allSuits.length)];
    } else {
        this.suit = suit;
    }

    if (enhancement !== 'none' && enhancement !== undefined) {
        if (enhancement === 'rand' && (rank === 'face' || rank === 'ace')) {
            this.enhancement = allEnhancements.filter(e => e !== 'stone')[Math.floor(Math.random() * allEnhancements.filter(e => e !== 'stone').length)];
        } else if (enhancement === 'rand') {
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
    new Card(14, 'diamonds')
]