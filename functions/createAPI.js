const axios = require('axios');
const https = require('https');
// Create API
function createApi(port, password) {
    const agent = new https.Agent({  
        rejectUnauthorized: false,
    });

    return axios.create({
        baseURL: `https://127.0.0.1:${port}`,
        headers: {
            Authorization: `Basic ${Buffer.from(`riot:${password}`).toString("base64")}`,
        },
        httpsAgent: agent,
    });
}

module.exports = createApi;