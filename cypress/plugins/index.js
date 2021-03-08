const path = require('path');
const fs = require('fs-extra');

function getConfigurationByFile(file) {
    const pathToConfigFile = path.resolve('.', 'cypress', 'config', `${file}.json`);
    return fs.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
    const file = config.env.configFile || 'local';
    return getConfigurationByFile(file);
};
