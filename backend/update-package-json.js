const fs = require('fs');


const config = require('./config/config');


const packageJson = require('./package.json');

console.log(config.development);
packageJson.env = config;


fs.writeFileSync('package.json', JSON.stringify(packageJson,null,1));