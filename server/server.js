const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const server = http.createServer(app);
const io = socketio(server);

const routes = require('./routes');
const { userFunctions } = require('./functions/users');
const { channelFunctions } = require('./functions/channels');
const { hasCommand } = require('./functions/commands');

app.use(routes);
app.use(cors());

// see current socket's rooms
// var rooms = Object.keys(io.sockets.adapter.sids[socket.id]);

io.on('connect', (socket) => {
    socket.on('userVerif', ({ name, verified }, callback) => {
        let user = userFunctions['getUserByName'](name);

        if (!user || verified) {
            callback(true);
        };

        callback(false);
    })

    socket.on('join', ({ name, channel }, callback) => {
        // if user exists, he wants to change channel ( => else )
        let user = userFunctions['getUserByName'](name);

        if (!user) {
            // else, he needs to be created
            user = userFunctions['createUser'](name, channel, socket.id);

            socket.join(channel);

            socket.emit('message', { user: '', message: `${user.name}, bienvenue dans le channel ${user.channel}.` });
            socket.broadcast.to(user.channel).emit('message', { user: '', message: `${user.name} vient d'arriver!` });
        } else {
            let oldChannel = user.channel

            socket.leave(oldChannel)
            socket.broadcast.to(oldChannel).emit('message', { user: '', message: `${name} est parti(e).` });

            socket.join(channel);
            userFunctions['updateChannel'](channel, name);
            socket.emit('message', { user: '', message: `${name}, bienvenue dans le channel ${channel}.` });
            socket.broadcast.to(channel).emit('message', { user: '', message: `${name} vient d'arriver!` });
            const oldChannelData = channelFunctions['getChannelData'](oldChannel);

            io.to(oldChannel).emit('updateChannelData', { channelData: oldChannelData });
        }

        const channels = channelFunctions['getChannels']();
        const channelData = channelFunctions['getChannelData'](channel);
        io.to(channel).emit('updateChannelData', { channelData: channelData });
        callback(channels);
    });

    socket.on('userMessage', (message, callback) => {
        const user = userFunctions['getUser'](socket.id);
        const oldChannel = user.channel;
        const oldName = user.name;

        let command = hasCommand(message);
        let data;

        if (!command) {
            io.to(user.channel).emit('message', { user: user.name, message: message });
        } else {
            switch (command.name) {
                case 'create':
                    if (typeof command.params[1] !== 'undefined' && command.params[1].trim() !== '') {
                        let result = channelFunctions[command.function](command.params, user.name);
                        if (!result) {
                            callback();
                        } else {
                            io.emit('updateChannels', { channels: channelFunctions['getChannels']() });
                            io.emit('message', { user: '', message: `${user.name} vient de créer le channel ${command.params[1]}!` });
                        }
                    }
                    break;
                case 'join':
                    if (typeof command.params[1] !== 'undefined' && command.params[1].trim() !== '') {
                        let newActiveChannel = channelFunctions[command.function](command.params);
                        if (!newActiveChannel) {
                            callback();
                        } else {
                            data = { for: 'newActiveChannel', data: newActiveChannel };
                            const channelData = channelFunctions['getChannelData'](oldChannel, oldName);

                            io.to(oldChannel).emit('updateChannelData', { for: oldChannel, channelData: channelData });
                            callback(data);
                        }
                    }
                    break;
                case 'nickname':
                    if (typeof command.params[1] !== 'undefined' && command.params[1].trim() !== '') {
                        let newName = userFunctions[command.function](command.params, user.name);
                        if (!newName) {
                            callback();
                        } else {
                            data = { for: 'newName', data: newName };
                            io.to(user.channel).emit('message', { user: '', message: `${oldName} vient de changer son nom en ${newName}!` });
                            callback(data);
                        }
                    }
                    break;
                case 'rename':
                    if (typeof command.params[2] !== 'undefined' && command.params[2].trim() !== '') {
                        let result = channelFunctions[command.function](command.params, user.name);
                        if (!result) {
                            callback();
                        } else {
                            data = {
                                channels: channelFunctions['getChannels'](),
                                newActiveChannel: command.params[2],
                                oldChannel: command.params[1]
                            };
                            io.emit('renameChannel', data);
                            io.emit('message', {
                                user: '',
                                message: `${user.name} vient de renommer le channel ${command.params[1]} en ${command.params[2]}!`
                            });
                        }
                    }
                    break;
                case 'delete':
                    if (typeof command.params[1] !== 'undefined' && command.params[1].trim() !== '') {
                        let deletedChannel = channelFunctions[command.function](command.params, user.name);
                        if (!deletedChannel) {
                            callback();
                        } else {
                            data = {
                                channels: channelFunctions['getChannels'](),
                                newActiveChannel: 'accueil',
                                oldChannel: deletedChannel
                            };
                            io.emit('deleteChannel', data);
                            io.emit('message', {
                                user: '',
                                message: `${user.name} vient de supprimer le channel ${command.params[1]}.`
                            });
                        }
                    }
                    break;
                case 'message':
                    if (typeof command.params[2] !== 'undefined' && command.params[2] !== '') {
                        let data = userFunctions[command.function](command.params, user.name);
                        if (!data) {
                            callback();
                        } else {
                            io.to(data.to.id).emit('message', {
                                user: '1',
                                message: `${user.name} vous chuchote > ${data.message}`
                            });
                            io.to(user.id).emit('message', {
                                user: '1',
                                message: `Vous chuchotez à ${data.to.name} > ${data.message}`
                            });
                        }
                    }
                    break;
                case 'part':
                    if (typeof command.params[1] !== 'undefined' && command.params[1].trim() !== '' && command.params[1].trim() === oldChannel) {
                        
                        data = { for: 'newActiveChannel', data: 'accueil' };
                        const channelData = channelFunctions['getChannelData'](oldChannel, oldName);

                        io.to(oldChannel).emit('updateChannelData', { for: oldChannel, channelData: channelData });
                        callback(data);
                    }
                    break;
                case 'users':
                    let users = userFunctions[command.function]();

                    let userList = userFunctions['usersToString'](users, oldChannel)

                    io.to(user.id).emit('message', {
                        user: '',
                        message: userList
                    });
                    break;
                case 'list':
                    let channelList = channelFunctions['channelsToString'](command.params)

                    io.to(user.id).emit('message', {
                        user: '',
                        message: channelList
                    })
                    break;
            }
        }
        callback();
    });

    socket.on('updateUserChannel', (newChannel, userName) => {
        userFunctions['updateChannel'](newChannel, userName);
    });

    socket.on('disconnect', () => {
        const user = userFunctions['deleteUser'](socket.id);

        if (typeof user === 'object') {
            socket.leave(user.channel);
            socket.broadcast.to(user.channel).emit('message', {
                user: '',
                message: `${user.name} s'est déconnecté(e).`
            });
        }
    })
});

server.listen(8000);