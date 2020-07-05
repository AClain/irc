import React from 'react';

const ChannelHeader = (props) => {
    return (
        <div className='col-12'>
            <nav class="navbar navbar-light bg-light">
                <span class="navbar-brand">{props.roomName}</span>
            </nav>
        </div>
    )
}

export default ChannelHeader;