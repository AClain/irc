let autolinkUsers = document.getElementsByClassName('autolink-user')

console.log(autolinkUsers)

if (autolinkUsers.length > 0) {
    for (let i = 0; i < autolinkUsers.length; i++) {
        console.log(autolinkUsers[i])
        autolinkUsers[i].onclick((e) => { console.log(e) })
    }
}