// import bcrypt untuk menyimpan & mengecek password dengan cara yg aman
const bcrypt = require('bcrypt');

// import jwt untuk membuat token
const jwt = require('jsonwebtoken');

const { user_games, user_game_biodata } = require('../models');

const lc = require('lower-case')

// method untuk menyimpan password dalam bentuk hash
const encrypt = (password) => {
    return bcrypt.hashSync(password, 10);
}

const lowerCU = (username) => {
    return lc.lowerCase(username)
}

const lowerCE = (email) => {
    return lc.lowerCase(email)
}

// method untuk membandingkan password dalam bentuk hash & plain text
const checkPassword = (password, encryptedPassword, ) => {
    return bcrypt.compareSync(password, encryptedPassword);
}

// method untuk membuat token jwt
const generateToken = (user) => {
    // Jangan memasukkan password ke dalam payload
    const payload = {
        id: user.id,
        username: user.username,
    }

    // Rahasia ini nantinya kita pakai untuk memverifikasi apakah token ini benar-benar berasal dari aplikasi kita
    const rahasia = process.env.SECRET_KEY;

    // Membuat token dari data-data diatas
    return jwt.sign(payload, rahasia);
}

// method untuk membuat response setelah register
const format = (user) => {
    const { id, username, role } = user
    return {
        id,
        username,
        accessToken: generateToken(user)
    }
}

// controller register
const register = async(req, res) => {
    // ambil username, password, dan role dari request body
    const { username, password, nama, email, umur } = req.body;
    const lowerCUS = lowerCU(username)
    const lowerCEM = lowerCE(email)

    try {
        if(req.body.username == "" || req.body.password == "") {
            return res.status(406).json("Di Isi Terlebih Dahulu")
        }
    }
    catch (err) {
        return res.status(400).json(err)
    }
    try {
        // cek apakah user sudah ada
        const user = await user_games.findOne({
            where: { username: lowerCUS  }
        });

        // jika user ditemukan
        if (user) {       
            return res.status(406).json('Username Telah Terdaftar');
        }


    } catch (err) {
        return res.status(400).json(err)
    }

    try {
        const data = await user_game_biodata.findOne({
            where: { email: lowerCEM }
        })

        if (data) {
            return res.status(406).json('E-mail sudah terdaftar')
        }

        
    }
    catch(err) {
        return res.status(400).json(err)
    }


    try {
        // mengubah password menjadi hash
        const encryptedPassword = encrypt(password);

        // buat user di tabel
        const user = await user_games.create({
            username,
            password: encryptedPassword,
            user_game_biodata: {
                nama,
                email,
                umur,
                score: 0,
            },
        }, {
            include: {
                model: user_game_biodata,
                as: 'user_game_biodata',
            },
        });

        const result = {
            status: "success",
            message: "Register Berhasil",
            data: {
                username,
                nama,
                email,
                umur
            }
        };
        return res.status(201).json(result);

    } catch (err) {
        return res.status(400).json(err)

    }
}

// controller login
const login = async(req, res) => {
    // ambil username dan password dari request body
    const { username, password } = req.body;

    // siapkan variable penampung user
    let user = {};

    try {
        // cari user berdasar username
        user = await user_games.findOne({
            where: { username }
        })
    } catch (err) {
        return res.status(400).json(err)
    }

    // cek apakah user tidak ditemukan
    if (!user) {
        const result = {
            status: "Failed",
            message: "User Tidak Ditemukan"
        };
        return res.status(406).json(result);
    }

    // bandingkan password dari request body dengan dari database
    const isPasswordValid = checkPassword(password, user.password);

    // jika tidak sesuai
    if (!isPasswordValid) {
        const result = {
            status: "Failed",
            message: "Password Salah"
        };
        return res.status(406).json(result);
    }

    // jika sesuai
    const result = {
        status: "Success",
        message: "Login Berhasil",
        accessToken: generateToken(user)
    };
    return res.status(202).json(result);
}

module.exports = {
    register,
    login,
}