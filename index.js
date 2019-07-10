var parser = require('./parser').parser;

(async () => {

    await parser.init();
    await parser.login();
})();