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

    &:focus {
        outline: none;
        border: 1px dashed indigo;
    }
`

const primaryButton = 0
const keyCodes = {
    enter: 13,
    escape: 27,
    arrowDown: 40,
    arrowUp: 38,
    tab: 9,
};

class Player extends Component {
    onKeyDown = (
        event,
        provided,
        snapshot,
    ) => {
        if (provided.dragHandleProps) {
            provided.dragHandleProps.onKeyDown(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (snapshot.isDragging) {
            return;
        }

        if (event.keyCode !== keyCodes.enter) {
            return;
        }

        // we are using the event for selection
        event.preventDefault();

        const wasMetaKeyUsed = event.metaKey;
        const wasShiftKeyUsed = event.shiftKey;

        this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
    };

    // Using onClick as it will be correctly
    // preventing if there was a drag
    onClick = (event) => {
        if (event.defaultPrevented) {
            return;
        }

        if (event.button !== primaryButton) {
            return;
        }

        // marking the event as used
        event.preventDefault();

        const wasMetaKeyUsed = event.metaKey;
        const wasShiftKeyUsed = event.shiftKey;

        this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
    };

    performAction = (wasMetaKeyUsed, wasShiftKeyUsed) => {
        const {
            player,
            toggleSelection,
            toggleSelectionInGroup,
            multiSelectTo,
        } = this.props;
        console.log('[performAction]', { wasMetaKeyUsed, wasShiftKeyUsed })
        if (wasMetaKeyUsed) {
            toggleSelectionInGroup(player.id);
            return;
        }

        if (wasShiftKeyUsed) {
            multiSelectTo(player.id);
            return;
        }

        toggleSelection(player.id);
    };
    render() {
        return (
            <Draggable
                draggableId={this.props.player.id}
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        onClick={this.onClick}
                        onKeyDown={event => this.onKeyDown(event, provided, snapshot)}
                    >
                        {this.props.player.fullName}
                    </Container>
                )}

            </Draggable>
        )
    }
}

export default Player