const { UserGameBiodata } = require('../models');
const rps = require('../controller/rps');

const mockResponse = () => {
  const res = {};

  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);

  return res;
}

jest.mock('../models/index.js', () => ({
  // tulis semua fungsi yg hasil pemanggilannya ingin dipalsukan
  UserGameBiodata: {
      findOne: jest.fn(),
      update:jest.fn(),
  }
})
);


describe('rps function',()=>{
  test('success test win',async()=>{
    const req={
      body:{
        result:'win'
      },
      user:{
        id:'10',
        username:'test',
      }
    }
    const res=mockResponse()
    UserGameBiodata.findOne.mockResolvedValueOnce({score:0})
    UserGameBiodata.update.mockResolvedValueOnce({})

    await rps(req,res);

    expect(res.json).toBeCalledWith({
      status: 'success',
      username:'test',
      hasilSuit: 'win',
      score: 1,
    })
    expect(res.status).toBeCalledWith(200);
  });
  
  test('success test lose',async()=>{
    const req={
      body:{
        result:'lose'
      },
      user:{
        id:'10',
        username:'test',
      }
    }
    const res=mockResponse()
    UserGameBiodata.findOne.mockResolvedValueOnce({score:0})
    UserGameBiodata.update.mockResolvedValueOnce({})

    await rps(req,res);

    expect(res.json).toBeCalledWith({
      status: 'success',
      username:'test',
      hasilSuit: 'lose',
      score: -1,
    })
    expect(res.status).toBeCalledWith(200);
  });

  test('Fail test mispell result won',async()=>{
    const req={
      body:{
        result:'won'
      },
      user:{
        id:'10',
        username:'test',
      }
    }
    const res=mockResponse()
    UserGameBiodata.findOne.mockResolvedValueOnce({score:0})
    UserGameBiodata.update.mockResolvedValueOnce({})

    await rps(req,res);

    expect(res.json).toBeCalledWith('Invalid Input')
    expect(res.status).toBeCalledWith(406);
  });
  
  test('Fail test mispell result lose',async()=>{
    const req={
      body:{
        result:'lost'
      },
      user:{
        id:'10',
        username:'test',
      }
    }
    const res=mockResponse()
    UserGameBiodata.findOne.mockResolvedValueOnce({score:0})
    UserGameBiodata.update.mockResolvedValueOnce({})

    await rps(req,res);

    expect(res.json).toBeCalledWith('Invalid Input')
    expect(res.status).toBeCalledWith(406);
  });

  test('Fail test user not found',async()=>{
    const req={
      body:{
        result:'lose'
      },
      user:{
      }
    }
    const res=mockResponse()
    UserGameBiodata.findOne.mockRejectedValueOnce(new Error('Usernot found'))
    UserGameBiodata.update.mockRejectedValueOnce()

    await rps(req,res);

    expect(res.json).toBeCalledWith({ status: 'error', message: 'user not found' })
    expect(res.status).toBeCalledWith(406);
  });

});