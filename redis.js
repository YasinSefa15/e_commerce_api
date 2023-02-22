const {createClient} = require('redis')

const client = createClient()

client.on('error', err => console.log('Redis Client Error', err))
client.on('connect', function () {
    console.log('Redis Client Successful!');
});

const connect = async () => {
    await client.connect()
}


const disconnect = async () => {
    await client.disconnect()
}

module.exports = {
    client,
    connect,
    disconnect
}