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
*/
var allJokers = {
    'test': {
        name: 'test',
        trigger: 'afterScore',
        needs: ['score'],
        effect: () => currentScore.mult += 4
    },
    'testPair': {
        name: 'testPair',
        trigger: 'afterScore',
        needs: ['score', 'hand'],
        condition: () => {
            for (i=0;i<playedHand.length;i++) {
                for (j=i+1;j<playedHand.length;j++) {
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
    'bloodStone': {
        name: 'Bloodstone',
        trigger: 'duringScore',
        needs: ['card'],
        condition: () => card.suit === 'hearts' && Math.floor(Math.random() * 2) === 0,
        effect: () => currentScore.mult *= 1.5
    },
    'midasMask': {
        name: 'Midas Mask',
        trigger: 'beforeScore',
        needs: ['hand'],
        // the condition is a face card
        condition: () => playedHand.map((card) => card.rank <= 13 && card.rank >= 11).includes(true),
        effect: () => {
            for (card of playedHand) {
                card.enhancement = 'gold';
            }
        }
    }
}

// card constructor function
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;
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