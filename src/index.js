import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components'
import { multiDragAwareReorder, multiSelectTo as multiSelect } from './utils'

import initialData from './initial-data';
import Team from './team';

const Container = styled.div`
    display: flex;
`


class App extends React.Component {
    state = initialData;

    componentDidMount() {
        window.addEventListener('click', this.onWindowClick);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('touchend', this.onWindowTouchEnd);
    }

    componentWillUpdate() {
        window.removeEventListener('click', this.onWindowClick);
        window.removeEventListener('keydown', this.onWindowKeyDown);
        window.removeEventListener('touchend', this.onWindowTouchEnd);
    }

    onWindowClick = event => {
        if (event.defaultPrevented) {
            return;
        }
        this.unselectAll();
    }

    onWindowKeyDown = event => {
        if (event.defaultPrevented) {
            return;
        }
        if (event.key === 'Escape') {
            this.unselectAll()
        }
    }

    onWindowTouchEnd = event => {
        if (event.defaultPrevented) {
            return;
        }
        this.unselectAll();
    }

    unselectAll = () => {
        this.setState({ selectedPlayerIds: [] })
    }

    toggleSelection = playerId => {
        console.log('[toggle:selection]', playerId)
        const selectedPlayerIds = this.state.selectedPlayerIds
        const wasSelected = selectedPlayerIds.includes(playerId)

        const newPlayerIds = (() => {
            // player was not previously selected,
            // so select only this player
            if (!wasSelected) {
                return [playerId]
            }

            // player was part of a selected group
            // but will now be the only selected player
            if (selectedPlayerIds.length > 1) {
                return [playerId]
            }

            // player was previously selected but not in a group,
            // so clear selection
            return []
        })();

        this.setState({
            selectedPlayerIds: newPlayerIds,
        })
    }

    toggleSelectionInGroup = playerId => {
        console.log('[toggle:selectionInGroup]', playerId)
        const selectedPlayerIds = this.state.selectedPlayerIds
        const index = selectedPlayerIds.indexOf(playerId)

        // if not selected, add it to the selected items
        if (index === -1) {
            const newPlayerIds = [...selectedPlayerIds, playerId];
            this.setState({
                selectedPlayerIds: newPlayerIds,
            })
            return;
        }

        // if was previously selected, then remove from the group
        const shallow = [...selectedPlayerIds]
        shallow.splice(index, 1)
        this.setState({
            selectedPlayerIds: shallow,
        })
    }

    // this behavior matches MacOSX finder selection
    multiSelectTo = newPlayerId => {
        console.log('[toggle:multiSelectTo]', newPlayerId)
        const updated = multiSelect(
            this.state.entities,
            this.state.selectedPlayerIds,
            newPlayerId,
        );

        if (updated == null) {
            return;
        }

        this.setState({
            selectedPlayerIds: updated,
        });
    }

    onDragEnd = result => {
        console.log('[drag:end]', result)
        const { destination, source, draggableId } = result;
        if (!destination || result.reason === 'CANCEL') {
            this.setState({
                draggingPlayerId: null,
            })
            return
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const processed = multiDragAwareReorder({
            entities: this.state.entities,
            selectedPlayerIds: this.state.selectedPlayerIds,
            source,
            destination,
        })

        this.setState({
            ...processed,
            draggingPlayerId: null,
        })

        // const start = this.state.entities.teams[source.droppableId]
        // const finish = this.state.entities.teams[destination.droppableId]

        // reorder in the same column
        // if (start === finish) {
        //     const newPlayerIds = [...start.playerIds]
        //     newPlayerIds.splice(source.index, 1);
        //     newPlayerIds.splice(destination.index, 0, draggableId)

        //     const newTeam = {
        //         ...start,
        //         playerIds: newPlayerIds,
        //     }

        //     const newState = {
        //         ...this.state.entities,
        //         teams: {
        //             ...this.state.entities.teams,
        //             [newTeam.id]: newTeam,
        //         },
        //     }

        //     this.setState(newState)
        //     return;
        // }


        // const startPlayerIds = [...start.playerIds]
        // startPlayerIds.splice(source.index, 1)
        // const newStart = {
        //     ...start,
        //     playerIds: startPlayerIds,
        //     isFull: start.id !== 'unassigned' && startPlayerIds.length >= 6,
        // };

        // const finishPlayerIds = [...finish.playerIds]
        // finishPlayerIds.splice(destination.index, 0, draggableId)
        // const newFinish = {
        //     ...finish,
        //     playerIds: finishPlayerIds,
        //     isFull: finish.id !== 'unassigned' && finishPlayerIds.length >= 6,
        // };

        // const newState = {
        //     ...this.state.entities,
        //     teams: {
        //         ...this.state.entities.teams,
        //         [newStart.id]: newStart,
        //         [newFinish.id]: newFinish,
        //     },
        // };
        // this.setState(newState)

    }
    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            >
                <Container>
                    {
                        this.state.entities.teamOrder.map(teamId => {
                            const team = this.state.entities.teams[teamId];
                            const players = team.playerIds.map(playerId => this.state.entities.players[playerId]);
                            const isDropDisabled = team.id !== 'unassigned' && this.state.entities.teams[team.id].isFull;

                            return <Team key={team.id}
                                team={team}
                                players={players}
                                isDropDisabled={isDropDisabled}
                                toggleSelection={this.toggleSelection}
                                toggleSelectionInGroup={this.toggleSelectionInGroup}
                                multiSelectTo={this.multiSelectTo}
                            />;
                        })
                    }
                </Container>
            </DragDropContext>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
