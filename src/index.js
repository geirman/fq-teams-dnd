import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components'

import initialData from './initial-data';
import Team from './team';

const Container = styled.div`
    display: flex;
`


class App extends React.Component {
    state = initialData;

    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        console.log('[drag:end]', result)
        if (!destination) { return; }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = this.state.teams[source.droppableId]
        const finish = this.state.teams[destination.droppableId]

        if (start === finish) {
            const newPlayerIds = [...start.playerIds]
            newPlayerIds.splice(source.index, 1);
            newPlayerIds.splice(destination.index, 0, draggableId)

            const newTeam = {
                ...start,
                playerIds: newPlayerIds,
            }

            const newState = {
                ...this.state,
                teams: {
                    ...this.state.teams,
                    [newTeam.id]: newTeam,
                },
            }

            this.setState(newState)
            return;
        }

        const startPlayerIds = [...start.playerIds]
        startPlayerIds.splice(source.index, 1)
        const newStart = {
            ...start,
            playerIds: startPlayerIds,
            isFull: startPlayerIds.length >= 6,
        };

        const finishPlayerIds = [...finish.playerIds]
        finishPlayerIds.splice(destination.index, 0, draggableId)
        const newFinish = {
            ...finish,
            playerIds: finishPlayerIds,
            isFull: finishPlayerIds.length >= 6,
        };

        const newState = {
            ...this.state,
            teams: {
                ...this.state.teams,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };
        this.setState(newState)

    }
    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            >
                <Container>
                    {
                        this.state.teamOrder.map(teamId => {
                            const team = this.state.teams[teamId];
                            const players = team.playerIds.map(playerId => this.state.players[playerId]);
                            const isDropDisabled = team.id !== 'unassigned' && this.state.teams[team.id].isFull;

                            return <Team key={team.id}
                                team={team}
                                players={players}
                                isDropDisabled={isDropDisabled} />;
                        })
                    }
                </Container>
            </DragDropContext>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
