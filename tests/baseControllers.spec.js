const auth = require('../controller/auth');
const bcrypt = require('bcrypt')
const { UserGames, UserGameBiodata } = require('../models')

const mockRequest = (body = {},user={}) => {
    return { body,user }
};

const mockResponse = () => {
    const res = {};

    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
}

jest.mock('../models/index.js', () => ({
    // tulis semua fungsi yg hasil pemanggilannya ingin dipalsukan
    UserGames: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
    UserGameBiodata: {
        findOne: jest.fn(),
    }
  })
);

describe('auth.register function', () => {
    test('res.json called with { status: error, message: "blank username or password" }', async () => {
        const req = mockRequest({ username: '', password: '', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();

       await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'blank username or password'
        });
    });

    test('res.json called with { status: error, message: "Username Telah Terdaftar" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();
        UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0})

        await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'Username Telah Terdaftar'
        });
    });

    test('res.json called with { status: error, message: "Email Telah Terdaftar" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();
        UserGameBiodata.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0})

        await auth.register(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.json).toBeCalledWith({
            status:'error',
            message: 'Email Telah Terdaftar'
        });
    });

    test('res.json called with { status: success, message: "Register Berhasil" }', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd', email: 'asd', nama: 'asd', umur: 24, score: 0});
        const res = mockResponse();

        await auth.register(req, res);

        expect(res.status).toBeCalledWith(202);
        expect(res.json).toBeCalledWith({
            status:'success',
            message: 'Register Berhasil'
        });
    });
});

describe('auth.login function', () => {

    // test('res.json called with { status: Failed, message: "User Tidak Ditemukan" }', async () => {
    //     const req = mockRequest({ username: 'sad', password: 'asd'});
    //     const res = mockResponse();
    //     UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd'})

    //     await auth.login(req, res);

    //     expect(res.status).toBeCalledWith(409);
    //     expect(res.json).toBeCalledWith({
    //         status:'Failed',
    //         message: 'User Tidak Ditemukan'
    //     });
    // });

    // test('res.json called with { status: Failed, message: "Password Salah" }', async () => {
    //     const req = mockRequest({ username: 'asd', password: 'sad'});
    //     const res = mockResponse();
    //     UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd'})

    //     await auth.login(req, res);

    //     expect(res.status).toBeCalledWith(409);
    //     expect(res.json).toBeCalledWith({
    //         status:'Failed',
    //         message: 'Password Salah'
    //     });
    // });

    test('res.json called with { status: success, message: "Login Berhasil"}', async () => {
        const req = mockRequest({ username: 'asd', password: 'asd'});
        const res = mockResponse();
        UserGames.findOne.mockResolvedValueOnce({ username: 'asd', password: 'asd'});

        await auth.login(req, res);

        
        expect(res.json).toBeCalledWith({
            status:'success',
            message: 'Login Berhasil',
        });
        expect(res.status).toBeCalledWith(202);
    });
});

