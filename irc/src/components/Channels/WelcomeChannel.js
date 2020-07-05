import React from 'react';
import './css/Channel.css'

import WelcomeBox from './Chatbox/WelcomeBox'

const WelcomeChannel = (props) => {
    return (
        <div className='row'>
            <div className='col-12' id='channel-header'>
                <h1>{props.channelName}</h1>
            </div>
            <WelcomeBox messages={props.messages} />
        </div>
    )
}

export default WelcomeChannel;