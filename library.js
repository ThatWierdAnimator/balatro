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
        mult: 40
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
*/
var allJokers = {
    'test': {
        name: 'test',
        trigger: 'afterScore',
        effect: (currentScore) => currentScore.mult += 4
    },
    'testPair': {
        name: 'testPair',
        trigger: 'afterScore',
        needs: ['hand'],
        effect: (currentScore, hand) => {
            for (i=0;i<hand.length;i++) {
                for (j=i+1;j<hand.length;j++) {
                    if (hand[i].rank === hand[j].rank) {
                        currentScore.mult += 8;
                        break;
                    }
                }
            }
        }
    },
    'bloodStone': {
        name: 'Bloodstone',
        trigger: 'duringScore',
        needs: ['card'],
        condition: (card) => card.suit === 'hearts' && Math.floor(Math.random() * 2) === 0,
        effect: (currentScore) => currentScore.mult *= 1.5
    },
    'midasMask': {
        name: 'Midas Mask',
        trigger: 'beforeScore',
        needs: ['hand'],
        // the condition is a face card
        condition: (hand) => hand.map((card) => card.rank <= 13 && card.rank >= 11).includes(true),
        effect: (currentScore, hand) => {
            for (card of hand) {
                card.enhancement = 'gold';
                console.log(card);
            }
        }
    }
}