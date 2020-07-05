import React, { useEffect, useState } from 'react';

//images import
import onlineIcon from '../img/online.png';

import io from 'socket.io-client';

import Loader from 'react-loader-spinner';

import Channel from './Channels/Channel';
import MessageBar from './Channels/Chatbox/MessageBar';

const url = 'localhost:8000';
let socket = io.connect(url);

const IRC = (props) => {

    const [name, setName] = useState(props.name);

    const [channel, setChannel] = useState('accueil');
    const [channels, setChannels] = useState([]);
    const [channelData, setChannelData] = useState([]);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [verified, setVerified] = useState(false);

    const [loading, setLoading] = useState(false);

    const [list, setList] = useState('');

    // When user connects or disconnects
    useEffect(() => {

        setLoading(true);
        setMessages([]);

        socket.emit('userVerif', { name, verified }, (res) => {
            if (res) {
                let activePanel = document.querySelector('.tab-pane.active');
                let activeItem = document.querySelector('.list-group-item.active');

                if (activeItem !== null && activePanel !== null) {
                    activePanel.classList.remove('active');
                    activeItem.classList.remove('active');
                }

                socket.emit('join', { name, channel }, (data) => {
                    setChannels(data);
                    setVerified(true);
                    setLoading(false);
                    document.getElementById(channel).classList.add('active');
                    document.getElementById(channel + '-box').classList.add('active');
                });
                socket.emit('updateUserChannel', channel, name);
            } else {
                alert('Impossible de rejoindre le serveur avec ce nom.');
                window.location.href = '/';
            };
        });

        socket.on('renameChannel', data => {
            if (channel === data.oldChannel && typeof data.newActiveChannel !== 'undefined') {
                setChannels(data.channels);

                setTimeout(() => {
                    setChannel(data.newActiveChannel);
                }, 500);
            };
        });

        socket.on('deleteChannel', data => {
            if (channel === data.oldChannel && typeof data.newActiveChannel !== 'undefined') {
                setChannel(data.newActiveChannel);
            };
            setTimeout(() => {
                setChannels(data.channels);
            }, 500);
        });

        socket.on('updateChannelData', data => {
            setChannelData(data.channelData);
        });
    }, [channel, name, verified]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        })

        socket.on('updateChannels', data => {
            setChannels(data.channels);

        })
    }, [])

    const leave = () => {
        window.location.reload();
    }

    // User send a message
    const sendMessage = (e) => {
        e.preventDefault()

        if (message !== '') {
            socket.emit('userMessage', message, (data) => {
                setMessage('');
                if (typeof data !== 'undefined') {
                    switch (data.for) {
                        case 'newActiveChannel':
                            setChannel(data.data);
                            break;
                        case 'newName':
                            setName(data.data);
                            break;
                        default:
                            break;
                    }
                };
            });
        };
    }

    const handleMessage = (text) => {
        setMessage(text);
        if (text.charAt(0) === "/") {
            setList('commands');
        } else if (text.charAt(0) === "@") {
            setList('users');
        } else if (text.charAt(0) === "#") {
            setList('channels');
        } else if (text === '') {
            setList('');
        }
    }

    const goTo = (to) => {
        setChannel(to);
    }

    return (<div className='container-fluid' >
        <div className='row'>
            <div className='col-3'>
                <div className='row'>
                    <div className='col-12' id='channel-list-container'>
                        <div className='list-group' id='channel-list'>
                            <button onClick={leave} className='btn btn-outline-danger' id='leave-button'>
                                Quitter le serveur
                    </button>
                            {loading ? (
                                <Loader
                                    type='Puff'
                                    color='#00BFFF'
                                    height={100}
                                    width={100}
                                />
                            ) : (null)}
                            <div className={`list-group-item list-group-item-action 
                            ${channel === 'accueil' ? ('active') : ('notActive')} 
                            ${loading ? ('hidden') : ('notHidden')}`
                            }
                                id='accueil'
                                onClick={
                                    (e) => { goTo(e.target.id) }
                                }
                            >
                                #accueil
                            </div>
                            {channels.map((channel1, i) => {
                                if (channel1.name.toLowerCase() !== 'accueil') {
                                    return (
                                        <div className={`list-group-item list-group-item-action 
                                        ${loading ? ('hidden') : ('notHidden')}
                                        ${channel === channel1.name ? ('active') : ('notActive')} `
                                        }
                                            key={i}
                                            id={channel1.name.toLowerCase()}
                                            onClick={
                                                (e) => { goTo(e.target.id) }
                                            }> #{channel1.name.toLowerCase()}
                                        </div>
                                    )
                                }
                                return false
                            })}
                        </div>
                    </div>
                    <div className='col-12' id='user-list-container'>
                        <h4>Utilisateurs</h4>
                        <div id='user-list'>
                            <div className='user'>
                                <img src={onlineIcon} alt='online' />
                                <span>{`${name} (vous)`}</span>
                            </div>
                            {channelData.map((userName, i) =>
                                userName === name ? ('') : (
                                    <div className='user' key={i}>
                                        <img src={onlineIcon} alt='online' />
                                        <span>{userName}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-9' id='chat-box-container'>
                <div className='tab-content container' id='channel-container'>
                    {channels.map((channel, i) =>
                        <div key={i} className='tab-pane row' id={channel.name.toLowerCase() + '-box'}>
                            <Channel channelName={channel.name} messages={messages} setChannel={setChannel} />
                        </div>
                    )}
                    <MessageBar
                        channelName={channel}
                        channels={channels}
                        users={channelData}
                        list={list}
                        sendMessage={sendMessage}
                        handleMessage={handleMessage}
                    />
                </div>
            </div>
        </div>
    </div>
    )
}

export default IRC;