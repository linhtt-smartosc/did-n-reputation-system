const mongoose = require('mongoose');

const connectionStr = process.env.MONGODB_URI || '';

async function connect() {
    try {
        await mongoose.connect(connectionStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log('Error connecting to MongoDB Atlas: ', error);
    }
}

module.exports = connect;