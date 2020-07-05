import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import ReactEmoji from 'react-emoji'
import ReactDOMServer from "react-dom/server";
import parser from 'bbcode-to-react';

import './css/ChatBox.css'

import ScrollToBottom from 'react-scroll-to-bottom'

const ChatBox = (props) => {

    const handleClick = (event) => {
        event.persist()
        if (typeof event.target.attributes.class !== 'undefined' && event.target.attributes['class'].nodeValue === 'autolink-user') {
            let messageInput = document.getElementById('message-input')
            messageInput.value = `/msg ${event.target.attributes['id'].nodeValue}`
        } else if (typeof event.target.attributes.class !== 'undefined' && event.target.attributes['class'].nodeValue === 'autolink-channel') {
            props.setChannel(event.target.attributes['id'].nodeValue)
        } else {
            return;
        }
    }

    const autolink = (message) => {

        let channel = message.match(/(#){1}(\w*)/);


        while (channel !== null) {
            message = message.replace(channel[0], `<span class='autolink-channel' id='${channel[2]}'>&35;${channel[2]}</span>`)
            channel = message.match(/(#){1}([0-9]*)/);
        };

        message = message.replace('&35;', '&#35;')

        let user = message.match(/(@){1}(\w*)/);

        while (user !== null) {
            message = message.replace(user[0], `<span class='autolink-user' id='${user[2]}'>&#64;${user[2]}</span>`)
            user = message.match(/(@){1}(\w*)/);
        };

        return message;
    }

    const convertEmojiBbcode = (message) => {

        message = ReactDOMServer.renderToString(ReactEmoji.emojify(message));

        if (message.match(/&quot;/, message) !== null) {
            message = message.split('&quot;').join('"')
        };
        if (message.match(/&amp;/, message) !== null) {
            message = message.split('&amp;').join('&');
        };

        message = ReactDOMServer.renderToString(parser.toReact(message));

        if (message.match(/&lt;/, message) !== null) {
            message = message.split('&lt;').join('<')
        };
        if (message.match(/&gt;/, message) !== null) {
            message = message.split('&gt;').join('>')
        };
        if (message.match(/&quot;/, message) !== null) {
            message = message.split('&quot;').join('"')
        };
        if (message.match(/&amp;/, message) !== null) {
            message = message.split('&amp;').join('&');
        };

        message = autolink(message);

        return message;
    }

    return (
        <ScrollToBottom ScrollToBottom className='col-12 chat-box'>
            <hr />
            {
                props.messages.map((message, i) =>
                    message.user === '' ? (
                        <span key={i} className='admin-message message'>{ReactHtmlParser(message.message)}</span>
                    ) : message.user === '1' ? (
                        <div key={i} className='message whisper'>
                            <span>{message.message}</span>
                        </div>
                    ) : (
                                <div key={i} className='message'>
                                    <span onClick={handleClick}><b>{message.user}</b> > {ReactHtmlParser(convertEmojiBbcode(message.message))}</span>
                                </div>
                            )
                )
            }
        </ScrollToBottom>
    )
};

export default ChatBox;