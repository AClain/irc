const commandList = [
    {
        name: 'nickname',
        command: '/nick',
        function: 'changeNickname'
    },
    {
        name: 'list',
        command: '/list'
    },
    {
        name: 'create',
        command: '/create',
        function: 'createChannel'
    },
    {
        name: 'rename',
        command: '/rename',
        function: 'renameChannel'
    },
    {
        name: 'delete',
        command: '/delete',
        function: 'deleteChannel'
    },
    {
        name: 'join',
        command: '/join',
        function: 'joinChannel'
    },
    {
        name: 'part',
        command: '/part',
    },
    {
        name: 'users',
        command: '/users'
    },
    {
        name: 'message',
        command: '/msg',
        function: 'messageTo'
    }
]

// Commands
const hasCommand = (message) => {
    let messageArray = message.split(' ')

    let findCommand = commandList.find(command => command.command === messageArray[0]);

    if (typeof findCommand !== 'undefined') {
        return { function: findCommand.function, params: messageArray, name: findCommand.name };
    };

    return false;
}

const autolink = (message) => {
    let user = message.match(/(@){1}(\w*)/);

    while (user !== null) {
        message = message.replace(user[0], `<span className='autolink-user' id='${user[2]}'>&#64;${user[2]}</span>`)
        user = message.match(/(@){1}(\w*)/);
    }

    let channel = message.match(/(#){1}(\w*)/);

    while (channel !== null) {
        message = message.replace(channel, `<span className='autolink-channel' id='${channel.substr(1)}'>&#35;${channel.substr(1)}</span>`)
        channel = message.match(/(#){1}(\w*)/);
    }

    return message;
}

module.exports = { hasCommand, autolink }