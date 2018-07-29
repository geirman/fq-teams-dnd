import React, { Component } from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'

import Player from './player'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgray;
    border-radius: 2px;
    width: 200px;

    display: flex:
    flex-direction: column;
`
const Title = styled.h3`
    padding: 8px;
`
const TeamMembers = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`

class Team extends Component {

    render() {
        return (
            <Container>
                <Title>{this.props.team.name}</Title>
                <Droppable
                    droppableId={this.props.team.id}
                    isDropDisabled={this.props.isDropDisabled}
                >
                    {(provided, snapshot) => (
                        <TeamMembers
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.players.map((player, index) => <Player key={player.id} player={player} index={index} />)}
                            {provided.placeholder}
                        </TeamMembers>
                    )}
                </Droppable>
            </Container>
        )
    }
}

export default Team