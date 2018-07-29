import React, { Component } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px solid lightgray;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'indigo' : 'white')}
    color: ${props => (props.isDragging ? 'white' : 'indigo')}
    // transition: background-color 2s ease, color 2s ease;
`

class Player extends Component {
    render () {
        return (
            <Draggable
                draggableId={this.props.player.id}
                index={this.props.index}
            >
            { (provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    {this.props.player.fullName}
                </Container>
            )}

            </Draggable>
        )
    }
}

export default Player