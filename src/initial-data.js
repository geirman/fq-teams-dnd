const data = {
    players: {
        'player-01': { id: 'player-01', fullName: 'Player 1' },
        'player-02': { id: 'player-02', fullName: 'Player 2' },
        'player-03': { id: 'player-03', fullName: 'Player 3' },
        'player-04': { id: 'player-04', fullName: 'Player 4' },
        'player-05': { id: 'player-05', fullName: 'Player 5' },
        'player-06': { id: 'player-06', fullName: 'Player 6' },
        'player-07': { id: 'player-07', fullName: 'Player 7' },
        'player-08': { id: 'player-08', fullName: 'Player 8' },
        'player-09': { id: 'player-09', fullName: 'Player 9' },
        'player-10': { id: 'player-10', fullName: 'Player 10' },
        'player-11': { id: 'player-11', fullName: 'Player 11' },
        'player-12': { id: 'player-12', fullName: 'Player 12' },
        'player-13': { id: 'player-13', fullName: 'Player 13' },
    },
    teams: {
        'unassigned': {
            id: 'unassigned',
            name: 'Unassigned',
            // playerIds: ['player-01', 'player-02'],
            playerIds: ['player-01', 'player-02', 'player-03', 'player-04', 'player-05', 'player-06', 'player-07', 'player-08', 'player-09', 'player-10', 'player-11', 'player-12', 'player-13'],
            isFull: false,
        },
        'team-a': {
            id: 'team-a',
            name: 'Team A',
            playerIds: [],
            isFull: false,
        },
        'team-b': {
            id: 'team-b',
            name: 'Team B',
            playerIds: [],
            isFull: false,
        },
        'team-c': {
            id: 'team-c',
            name: 'Team C',
            playerIds: [],
            isFull: false,
        },
    },
    teamOrder: ['unassigned', 'team-a', 'team-b', 'team-c'],
}

export default data;