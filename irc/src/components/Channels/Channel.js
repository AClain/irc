import React from 'react';
import './css/Channel.css'

import ChatBox from './Chatbox/ChatBox'

const Channel = (props) => {
    return (
        <div className='row'>
            <div className='col-12' id='channel-header'>
                <h1>{props.channelName.charAt(0).toUpperCase() + props.channelName.slice(1)}</h1>
            </div>
            <ChatBox messages={props.messages} setChannel={props.setChannel} />
        </div>
    )
}

export default Channel;