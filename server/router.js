const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    app.get('/getChars', mid.requiresLogin, controllers.Character.getChars);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Character.makerPage);
    app.get('/upgrade', mid.requiresLogin, controllers.Character.upgradedPage);
    app.post('/maker', mid.requiresLogin, controllers.Character.makeCharacter);
    app.post('/delete', mid.requiresLogin, controllers.Character.deleteCharacter);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    app.get('*', controllers.Account.notFoundPage);
};

module.exports = router;