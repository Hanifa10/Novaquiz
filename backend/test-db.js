require('dotenv').config();
const sequelize = require('./config/database');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // await sequelize.sync({ force: true });
        // console.log('Database synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}
test();
