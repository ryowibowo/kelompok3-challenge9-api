const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { UserGames, UserGameBiodata } = require('../models');

const encrypt = (password) => bcrypt.hashSync(password, 10);

const JWT_SECRET = 'ini rahasia';

const getFrogotP = async (req, res) => {
  res.render('forgot-password');
};

const forgotP = async (req, res) => {
  const { email } = req.body;

  try {
    const data = await UserGameBiodata.findOne({
      where: { email },
    });
    if (data) {
      const secret = JWT_SECRET;
      const payload = {
        email,
      };

      const token = jwt.sign(payload, secret, { expiresIn: '15m' });
      const link = `http://nextjs-kel3.herokuapp.com//reset-password/${data.id}/${token}`;

      const smtpConfig = {
        host: 'smtp.Gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'renaris97@gmail.com',
          pass: 'babehlo123',
        },
      };
      const transporter = nodemailer.createTransport(smtpConfig);

      const mailOptions = {
        from: 'renaris97@gmail.com',
        to: email,
        subject: 'Link Reset Password',
        text: `Berikut ini adalah link untuk merubah password kamu:  ${link}`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.json(err);
        }
        return res.status(500).json('Internal Server Error');
      });

      return res.status(202).json('Link reset password sudah di kirim');
    }
    if (!data) {
      return res.status(406).json('E-mail not found');
    }
  } catch (err) {
    return res.status(400).json(err);
  }
  return res.status(500).json('Internal Server Error');
};

const getResetP = async (req, res) => {
  UserGames.findOne({
    where: { id: req.params.id },
  })
    .then((data) => {
      res.render({ data });
    });
};

const resetP = async (req, res) => {
  const { token } = req.params;

  try {
    const data = await UserGames.findOne({
      where: { id: req.params.id },
    });

    if (!data) {
      return res.status(406).json('Id tidak ada');
    }

    const secret = JWT_SECRET;
    jwt.verify(token, secret);
    const { password, confirmP } = req.body;
    const encryptedPassword = encrypt(password);
    if (password !== confirmP) {
      return res.status(406).json('password tidak sama');
    }
    const update = await UserGames.update({
      password: encryptedPassword,
    }, { where: { id: req.params.id } });
    if (update) {
      return res.status(202).json('berhasil ganti password');
    }
    return res.status(500).json('Internal Server Error');
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  getFrogotP,
  forgotP,
  getResetP,
  resetP,
};
