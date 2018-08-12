// @flow
import reorder from './reorder';


const withNewPlayerIds = (team, playerIds) => ({
    ...team,
    playerIds,
});

const reorderSingleDrag = ({
    entities,
    selectedPlayerIds,
    source,
    destination,
}) => {
    // moving in the same list
    if (source.droppableId === destination.droppableId) {
        const team = entities.teams[source.droppableId];
        const reordered = reorder(
            team.playerIds,
            source.index,
            destination.index,
        );

        const updated = {
            ...entities,
            teams: {
                ...entities.teams,
                [team.id]: withNewPlayerIds(team, reordered),
            },
        };

        return {
            entities: updated,
            selectedPlayerIds,
        };
    }

    // moving to a new list
    const home = entities.teams[source.droppableId];
    const foreign = entities.teams[destination.droppableId];

    // the id of the task to be moved
    const playerId = home.playerIds[source.index];

    // remove from home column
    const newHomePlayerIds = [...home.playerIds];
    newHomePlayerIds.splice(source.index, 1);

    // add to foreign column
    const newForeignPlayerIds = [...foreign.playerIds];
    newForeignPlayerIds.splice(destination.index, 0, playerId);

    const updated = {
        ...entities,
        teams: {
            ...entities.teams,
            [home.id]: withNewPlayerIds(home, newHomePlayerIds),
            [foreign.id]: withNewPlayerIds(foreign, newForeignPlayerIds),
        },
    };

    return {
        entities: updated,
        selectedPlayerIds,
    };
};

export const getHomeTeam = (entities, playerId) => {
    const teamId = entities.teamOrder.find((id) => {
        const team = entities.teams[id];
        return team.playerIds.includes(playerId);
    });

    if (!teamId) {
        console.error('Count not find team for player', playerId, entities);
        throw new Error('boom');
    }

    return entities.teams[teamId];
};

const reorderMultiDrag = ({
    entities,
    selectedPlayerIds,
    source,
    destination,
}) => {
    const start = entities.teams[source.droppableId];
    const dragged: teamId = start.playerIds[source.index];

    const insertAtIndex = (() => {
        const destinationIndexOffset = selectedPlayerIds.reduce(
            (previous, current) => {
                if (current === dragged) {
                    return previous;
                }

                const final = entities.teams[destination.droppableId];
                const team = getHomeTeam(entities, current);

                if (team !== final) {
                    return previous;
                }

                const index = team.playerIds.indexOf(current);

                if (index >= destination.index) {
                    return previous;
                }

                // the selected item is before the destination index
                // we need to account for this when inserting into the new location
                return previous + 1;
            },
            0,
        );

        const result = destination.index - destinationIndexOffset;
        return result;
    })();

    // doing the ordering now as we are required to look up columns
    // and know original ordering
    const orderedSelectedPlayerIds = [...selectedPlayerIds];
    orderedSelectedPlayerIds.sort(
        (a, b): number => {
            // moving the dragged item to the top of the list
            if (a === dragged) {
                return -1;
            }
            if (b === dragged) {
                return 1;
            }

            // sorting by their natural indexes
            const columnForA = getHomeTeam(entities, a);
            const indexOfA = columnForA.playerIds.indexOf(a);
            const columnForB = getHomeTeam(entities, b);
            const indexOfB = columnForB.playerIds.indexOf(b);

            if (indexOfA !== indexOfB) {
                return indexOfA - indexOfB;
            }

            // sorting by their order in the selectedPlayerIds list
            return -1;
        },
    );

    // we need to remove all of the selected tasks from their columns
    const withRemovedPlayers = entities.teamOrder.reduce(
        (previous, playerId) => {
            const team = entities.teams[playerId];

            // remove the id's of the items that are selected
            const remainingPlayerIds = team.playerIds.filter(
                (id) => !selectedPlayerIds.includes(id),
            );

            previous[team.id] = withNewPlayerIds(team, remainingPlayerIds);
            return previous;
        },
        entities.teams,
    );

    const final = withRemovedPlayers[destination.droppableId];
    const withInserted = (() => {
        const base = [...final.playerIds];
        base.splice(insertAtIndex, 0, ...orderedSelectedPlayerIds);
        return base;
    })();

    // insert all selected tasks into final column
    const withAddedPlayers = {
        ...withRemovedPlayers,
        [final.id]: withNewPlayerIds(final, withInserted),
    };

    const updated = {
        ...entities,
        teams: withAddedPlayers,
    };

    return {
        entities: updated,
        selectedPlayerIds: orderedSelectedPlayerIds,
    };
};

export const multiDragAwareReorder = (args) => {
    if (args.selectedPlayerIds.length > 1) {
        return reorderMultiDrag(args);
    }
    return reorderSingleDrag(args);
};

export const multiSelectTo = (
    entities,
    selectedPlayerIds,
    newPlayerId,
) => {
    // Nothing already selected
    if (!selectedPlayerIds.length) {
        return [newPlayerId];
    }

    const teamOfNew = getHomeTeam(entities, newPlayerId);
    const indexOfNew = teamOfNew.playerIds.indexOf(newPlayerId);

    const lastSelected = selectedPlayerIds[selectedPlayerIds.length - 1];
    const teamOfLast = getHomeTeam(entities, lastSelected);
    const indexOfLast = teamOfLast.playerIds.indexOf(lastSelected);

    // multi selecting to another column
    // select everything up to the index of the current item
    if (teamOfNew !== teamOfLast) {
        return teamOfNew.playerIds.slice(0, indexOfNew + 1);
    }

    // multi selecting in the same column
    // need to select everything between the last index and the current index inclusive

    // nothing to do here
    if (indexOfNew === indexOfLast) {
        return null;
    }

    const isSelectingForwards = indexOfNew > indexOfLast;
    const start = isSelectingForwards ? indexOfLast : indexOfNew;
    const end = isSelectingForwards ? indexOfNew : indexOfLast;

    const inBetween = teamOfNew.playerIds.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween.filter(
        (taskId: Id): boolean => {
            // if already selected: then no need to select it again
            if (selectedPlayerIds.includes(taskId)) {
                return false;
            }
            return true;
        },
    );

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    const combined = [...selectedPlayerIds, ...sorted];

    return combined;
};
