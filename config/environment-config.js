const dotenv = require("dotenv");
const path = require("path");

const loadEnvironmentVariables = () => {
    const envFilePath = path.resolve(__dirname, `../deployment/.env`);
    dotenv.config({ path: envFilePath });
};

// Export the function for use in other modules
module.exports = { loadEnvironmentVariables };
