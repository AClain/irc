import React from 'react';
import './css/MessageBar.css'

const MessageBar = (props) => {
    return (
        <div className='row' id='message-bar'>
            <input type='text' className='form-control'
                id='message-input'
                onChange={(e) => props.handleMessage(e.target.value, this)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        props.sendMessage(e);
                        e.target.value = '';
                    };
                }}
                placeholder={props.channelName === 'accueil' ? (`Message #${props.channelName}, commandes seulement`) : (`Message #${props.channelName}`)}
                list={props.list}
            />
            <datalist id="commands">
                <option value="/nick" />
                <option value="/list" />
                <option value="/create" />
                <option value="/delete" />
                <option value="/join" />
                <option value="/part" />
                <option value="/users" />
                <option value="/msg" />
            </datalist>
            <datalist id="users">
                {props.users.map((user, i) =>
                    <option key={i} value={`@${user}`} />
                )}
            </datalist>
            <datalist id="channels">
                {props.channels.map((channel, i) =>
                    <option key={i} value={`#${channel.name}`} />
                )}
            </datalist>
        </div>
    )
};

export default MessageBar;