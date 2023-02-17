const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const Multiparty = require("multiparty");

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports.encryptPassword = async (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err)
      }
      bcrypt.hash(password, salt, function (err1, hash) {
        if (err1) {
          reject(err)
        }
        resolve(hash)
      });
    })
  })
}

module.exports.createToken = async (userData) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(userData, 'cbjwfuiefhcjzowquwrefhbdcdcdjco', { expiresIn: "24h" })
    resolve(token)
  })
}

module.exports.comparePassword = async (password, newPassword) => {
  try {
    return new Promise(async (resolve, reject) => {
      const result = await bcrypt.compare(newPassword, password)
      resolve(result)
    })
  } catch (error) {
    return error
  }
}

module.exports.encyptId = async (id) => {
  return new Promise((resolve, reject) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(id.toString());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedId = encrypted.toString('hex')
    resolve(encryptedId)
  })
}

module.exports.decryptId = async (id) => {
  return new Promise((resolve, reject) => {
    let iv = Buffer.from(id.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  })
}

module.exports.checkToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers.authorization;
    if (!token) {
      res.status(401).send({
        errors: {
          type: "Authentication Error",
          message: "Required authorization header not found.",
        },
      });
      return;
    }
    if (token.startsWith("Bearer")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, 'cbjwfuiefhcjzowquwrefhbdcdcdjco', (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: 0,
          message: err + "An error has occurred",
        });
      } else {
        req.decoded = decoded;
        return next();
      }
    })
  } catch (error) {
    return error
  }
}

module.exports.multipartyData = async (req) =>{
  return new Promise((resolve, reject) => {
    const form = new Multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve({
          fields: null,
          files: null,
        });
      }
      resolve(files);
    })
  })
}

module.exports.removeDuplicateValueInArray = async(array)=> {
  return [...new Set(array)];
}
