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

    // onDragStart = start => {
    //     document.body.style.color = 'orange'
    // }

    // onDragUpdate = update => {
    //     const { destination } = update;
    //     const opacity = destination
    //         ? destination.index / Object.keys(this.state.teams).length
    //         : 0;

    //     document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
    // }

    onDragEnd = result => {
        document.body.style.color = 'inherit'
        const { destination, source, draggableId } = result;

        if(!destination) { return; }

        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = this.state.teams[source.droppableId]
        const finish = this.state.teams[destination.droppableId]

        if(start === finish) {
            const newPlayerIds = Array.from(start.playerIds) // TODO: [...team.playerIds]
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

    }
    render () {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
                // onDragStart={this.onDragStart}
                // onDragUpdate={this.onDragUpdate}
            >
            <Container>
            {
                this.state.teamOrder.map( teamId => {
                    const team = this.state.teams[teamId];
                    const players = team.playerIds.map(playerId => this.state.players[playerId]);

                    return <Team key={team.id} team={team} players={players} />;
                })
            }
            </Container>
            </DragDropContext>)
        }
}

ReactDOM.render(<App />, document.getElementById('root'));
