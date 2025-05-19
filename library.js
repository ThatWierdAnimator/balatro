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

var allJokers = {
    'test': {
        name: 'test',
        trigger: 'afterCards',
        effect: (currentScore) => {currentScore.mult += 4}
    },
    'testPair': {
        name: 'testPair',
        trigger: 'afterCards',
        needs: ['hand'],
        effect: (currentScore, hand) => {
            if (getHandType(hand) === 'pair') {
                currentScore.mult += 8
            }
        }
    }
}