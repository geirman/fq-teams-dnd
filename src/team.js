import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Ticker from 'react-flip-ticker'

import Player from './player'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgray;
    border-radius: 2px;
    width: 200px;

    display: flex;
    flex-direction: column;
`
const Title = styled.h3`
    padding: 8px;
`

const Subtitle = styled.p`
    padding: 3px 8px;
    color: ${props => (props.isFull ? 'DarkGreen' : 'white')};
    margin-top: 0px;
    background-color: ${props => (props.isFull ? 'LightGreen' : 'MediumPurple')};

    display: flex;
    align-content: center;

`
const TeamMembers = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`

class PlayerList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.players === this.props.players) {
            return false;
        }
        return true;
    }

    render() {
        return this.props.players.map((player, index) => <Player key={player.id} player={player} index={index} />)

    }
}

class Team extends Component {

    render() {
        const isUnassigned = this.props.team.id === 'unassigned';
        const playerCount = this.props.team.playerIds.length;
        return (
            <Container>
                <Title>{this.props.team.name}</Title>
                <Subtitle isFull={this.props.team.isFull}>

                    {
                        !isUnassigned
                            ? (6 - playerCount) !== 0
                                ? <Fragment><Ticker text={`${6 - playerCount}`} /> &nbsp; spots available</Fragment>
                                : "Team is full!"
                            : <Fragment><Ticker text={`${playerCount}`} />&nbsp; players need a team</Fragment>
                        // : (playerCount !== 0)
                        //     ? <Fragment><Ticker text={`${playerCount}`} />&nbsp; players need a team</Fragment>
                        //     : "Done (for now)"

                    }
                </Subtitle>
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
                            <PlayerList players={this.props.players} />
                            {provided.placeholder}
                        </TeamMembers>
                    )}
                </Droppable>
            </Container>
        )
    }
}

export default Team