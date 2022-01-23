// import bcrypt untuk menyimpan & mengecek password dengan cara yg aman
const bcrypt = require('bcrypt');
// import jwt untuk membuat token
const jwt = require('jsonwebtoken');
const lc = require('lower-case');
const { checkPW } = require('../lib/checkPW');

const { UserGames, UserGameBiodata } = require('../models');
// method untuk menyimpan password dalam bentuk hash
// const encrypt = (password) => {
//     return bcrypt.hashSync(password, 10);
// }
const encrypt = (password) => bcrypt.hashSync(password, 10);

const lowerCU = (username) => lc.lowerCase(username);

const lowerCE = (email) => lc.lowerCase(email);

// method untuk membandingkan password dalam bentuk hash & plain text
// const checkPassword = (
//   password,
//   encryptedPassword,
// ) => bcrypt.compareSync(password, encryptedPassword);

// method untuk membuat token jwt
const generateToken = (user) => {
// Jangan memasukkan password ke dalam payload
  const payload = {
    id: user.id,
    username: user.username,
  };

  const rahasia = 'Ini rahasia ga boleh disebar-sebar';
  // Membuat token dari data-data diatas
  return jwt.sign(payload, rahasia);
};

// method untuk membuat response setelah register
const format = (user) => {
  const { id, username } = user;
  return {
    id,
    username,
    accessToken: generateToken(user),
  };
};

// controller register
const register = async (req, res) => {
  // ambil username, password, dan role dari request body
  const {
    username, password, nama, email, umur,
  } = req.body;

  const lowerCUS = lowerCU(username);
  const lowerCEM = lowerCE(email);

  try {
    if (req.body.username === '' || req.body.password === '') {
      const result = {
        status: 'error',
        message: 'blank username or password',
      };
      return res.status(409).json(result);
    }
  } catch (err) {
    return res.status(409).json(err);
  }
  try {
    // cek apakah user sudah ada
    const user = await UserGames.findOne({
      where: { username: lowerCUS },
    });

    // jika user ditemukan
    if (user) {
      const result = {
        status: 'error',
        message: 'Username Telah Terdaftar',
      };
      return res.status(409).json(result);
    }
  } catch (err) {
    return res.status(409).json(err);
  }

  try {
    const data = await UserGameBiodata.findOne({
      where: { email: lowerCEM },
    });

    if (data) {
      const result = {
        status: 'error',
        message: 'Email Telah Terdaftar',
      };
      return res.status(409).json(result);
    }
  } catch (err) {
    return res.status(409).json(err);
  }

  try {
    // mengubah password menjadi hash
    const encryptedPassword = encrypt(password);

    // buat user di tabel
    const user = await UserGames.create({
      username,
      password: encryptedPassword,
      UserGameBiodata: {
        nama,
        email,
        umur,
        score: 0,
      },
    }, {
      include: {
        model: UserGameBiodata,
        as: 'UserGameBiodata',
      },
    });

    const result = {
      status: 'success',
      message: 'Register Berhasil',
      data: user,
    };
    return res.status(202).json(result);
  } catch (err) {
    return res.status(409).json(err);
  }
};

// controller login
const login = async (req, res) => {
  // ambil username dan password dari request body
  const { username, password } = req.body;

  // siapkan variable penampung user
  let user = {};

  try {
    // cari user berdasar username
    user = await UserGames.findOne({
      where: { username },
    });
  } catch (err) {
    return res.status(409).json(err);
  }

  // cek apakah user tidak ditemukan
  if (!user) {
    const result = {
      status: 'Failed',
      message: 'User Tidak Ditemukan',
    };
    return res.status(409).json(result);
  }

  // bandingkan password dari request body dengan dari database
  const isPasswordValid = checkPW(password, user.password);

  // jika tidak sesuai
  if (!isPasswordValid) {
    const result = {
      status: 'Failed',
      message: 'Password Salah',
    };
    return res.status(409).json({ result });
  }

  // jika sesuai
  const result = {
    status: 'Success',
    message: 'Login Berhasil',
    accessToken: generateToken(user),
    usernameLogin: username,
  };
  return res.status(202).json(result);
};

module.exports = {
  format,
  register,
  login,
};
