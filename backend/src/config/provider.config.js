

const providerConfig = {
    networks: [
        {
            name: process.env.LOCAL_NETWORK_NAME, 
            rpcUrl: process.env.LOCAL_NETWORK_RPC
        }
    ]
}

module.exports = {
    providerConfig
}