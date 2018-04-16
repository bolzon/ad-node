
const AD = require('./ad');
const config = require('./config.json');

let ad = new AD(config.user, config.pwd, config.host, config.dc);

ad.getUserData()
  .then(users => {
    console.log(users);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit();
  });