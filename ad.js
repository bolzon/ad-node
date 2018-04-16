
const ActiveDirectory = require('activedirectory');

class AD {

  constructor(user, pass, hostad, dc) {

    if (!user)
      throw new Error('Missing user');
    if (!pass)
      throw new Error('Missing password');
    if (!hostad)
      throw new Error('Missing host');

    this.config = {
      url: hostad,
      baseDN: dc || '',
      username: user,
      password: pass
    }

    this.options = {
      attributes: [
        'cn',
        'mail',
        'mobile',
        'telephoneNumber',
        'title',
        'sAMAccountName'
      ],
      filter: '(sAMAccountName=' + user.replace(/.*\\(.+)$/, '$1') + ')'
    };

    this.ad = new ActiveDirectory(this.config);
  }

  getUserData() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (!self.ad) {
        throw new Error('Disconnected');
      }
      self.ad.findUsers(self.options, function(err, users) {
        if (err) {
          reject(err);
          return;
        }
        else if (!users || users.length == 0) {
          reject('User does not exist');
          return;
        }
        if (users.length == 1) {
          resolve(AD._parseUser(users[0]));
        }
        else {
          var usersArr = [];
          for (var u in users)
            usersArr.push(AD._parseUser(users[u]));
          resolve(usersArr);
        }
      });
    });
  }

  static _parseUser(users) {
    return {
      name: users.cn || '',
      title: users.title,
      mobile: users.mobile,
      phone: users.telephoneNumber,
      email: users.mail
        ? users.mail.toLowerCase()
        : users.mail || '',
      user: users.sAMAccountName
        ? users.sAMAccountName.toLowerCase()
        : users.sAMAccountName || ''
    };
  }
}

module.exports = AD;