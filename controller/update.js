const bcrypt = require('bcrypt');
const lc = require('lower-case');
const { UserGames, UserGameBiodata } = require('../models');

const encrypt = (password) => bcrypt.hashSync(password, 10);

const lowerCU = (username) => lc.lowerCase(username);

const getUpdate = async (req, res) => {
  try {
    UserGames.findOne({
      where: { id: req.user.id },
      include: {
        model: UserGameBiodata,
        as: 'UserGameBiodata',
      },
    }).then((update) => {
      res.render({ update });
    });
  } catch (err) {
    return res.json(err);
  }
  return res.status(500).json('Internal Server Error');
};

const postUpdate = async (req, res) => {
  const {
    username, password, nama, email, umur,
  } = req.body;
  const encryptedPassword = encrypt(password);
  const lowerCUS = lowerCU(username);

  try {
    if (req.body.username === '' || req.body.password === '' || req.body.nama === '' || req.body.email === '') {
      return res.status(406).json('Di Isi Terlebih Dahulu');
    }

    const user = await UserGames.findOne({
      where: { username: lowerCUS },
    });

    if (user) {
      return res.status(406).json('Username Telah Terdaftar');
    }
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    UserGames.update({
      username,
      password: encryptedPassword,
    }, { where: { id: req.user.id } })
      .then(() => {
        UserGameBiodata.update({
          nama,
          email,
          umur,
        }, { where: { user_id: req.user.id } });
      });
    const result = {
      status: 'success',
    };
    return res.status(202).json(result);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  getUpdate,
  postUpdate,
};
