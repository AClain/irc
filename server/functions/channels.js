const { channels, users } = require('../config.json');

const channelFunctions = {
    getChannels: () => {
        return channels;
    },
    createChannel: (params, ownerName) => {
        let findChannel = channels.find(channel =>
            channel.name === params[1]
        );

        if (params[1] === 'bienvenue') {
            return false;
        }

        if (typeof findChannel === 'undefined') {
            let channel = {
                name: params[1],
                owner: ownerName,
                users: []
            };
            channels.push(channel);

            return true;
        }

        return false;
    },
    joinChannel: (params) => {
        let findChannel = channels.find(channel =>
            channel.name === params[1]
        );

        if (typeof findChannel !== 'undefined') {
            return findChannel.name;
        };

        return false;
    },
    renameChannel: (params, ownerName) => {
        let findChannel = channels.findIndex(channel =>
            channel.name === params[1]
        )

        if (findChannel === -1) {
            return false;
        } else if (channels[findChannel].owner === ownerName) {
            channels[findChannel].name = params[2];
            return true;
        }

        return false;
    },
    deleteChannel: (params, ownerName) => {
        let findChannel = channels.findIndex(channel =>
            channel.name === params[1]
        );

        if (findChannel === -1) {
            return false;
        } else if (channels[findChannel].owner === ownerName) {
            let deletedChannel = channels[findChannel].name;
            channels.splice(findChannel, 1);

            return deletedChannel;
        }

        return false;
    },
    getChannelData: (channel) => {
        let channelData = [];

        users.forEach(user => {
            if (user.channel === channel) {
                channelData.push(user.name);
            };
        })

        return channelData.sort();

    },
    channelsToString: (params) => {
        let channelList = 'Channel(s) disponible(s): </br>';

        if (typeof params[1] !== 'undefined') {
            channels.forEach((channel) => {
                if (channel.name.match(`${params[1]}`) !== null) {
                    channelList += channel.name + ", ";
                }
            });
        } else {
            channels.forEach((channel) => {
                channelList += channel.name + ", ";
            });
        }

        channelList = channelList.slice(0, -2);
        channelList += '.';

        return channelList;
    }
}

module.exports = { channelFunctions };