const { users } = require('../config.json');

// User
const userFunctions = {
    createUser: (name, channel, id) => {
        let findUser = users.find(user =>
            user.name === name
        );

        if (typeof findUser !== 'undefined') {
            return false;
        };

        let user = {
            name,
            channel,
            id
        };
        users.push(user);

        return user;
    },
    getUser: (id) => {
        let findUser = users.findIndex(user =>
            user.id === id
        );

        if (findUser !== -1) {
            return users[findUser];
        };

        return false;
    },
    getUserByName: (name) => {
        let findUser = users.findIndex(user =>
            user.name === name
        );

        if (findUser !== -1) {
            return users[findUser];
        };

        return false;
    },
    changeNickname: (params, currentName) => {
        let findName = users.findIndex(user =>
            user.name === params[1]
        )
        let findUser = users.findIndex(user =>
            user.name === currentName
        )

        if (findName === -1) {
            users[findUser].name = params[1];
            return users[findUser].name;
        };

        return false;
    },
    deleteUser: (id) => {
        let findUser = users.findIndex(user =>
            user.id === id
        );

        if (findUser !== -1) {
            let oldData = {
                name: users[findUser].name,
                channel: users[findUser].channel
            }
            users.splice(findUser, 1);

            return oldData;
        };

        return false;
    },
    listUsers: () => {
        return users.sort();
    },
    updateChannel: (newChannel, name) => {
        let findUser = users.findIndex(user =>
            user.name === name
        );

        if (findUser !== -1) {
            users[findUser].channel = newChannel;
            return true;
        };

        return false;
    },
    messageTo: (params, from) => {
        let to = users.findIndex(user =>
            user.name.toLowerCase() === params[1].toLowerCase()
        );

        params[0] = params[1] = '';
        let message = params.join(' ').trim();

        if (to !== -1 && from !== params[1]) {
            return {
                to: {
                    id: users[to].id,
                    name: users[to].name
                },
                message: message
            };
        };

        return false;
    },
    usersToString: (users, currentChannel) => {
        let userList = 'Utilisateurs connectés au serveur: </br>';

        users.forEach((user) => {
            userList += user.name + ", ";
        });

        userList = userList.slice(0, -2);

        userList += '.</br></br>'
        userList += 'Utilisateurs connectés au channel: </br>';

        users.forEach((user) => {
            if (user.channel === currentChannel) {
                userList += user.name + ", ";
            }
        });

        userList = userList.slice(0, -2);
        userList += '.';

        return userList;
    }
}

module.exports = { userFunctions };