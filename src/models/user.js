const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate');

const user = new Schema(
  {
    email: {
      type: String,
      require: true,
      default: '',
      unique: true
    },
    password: {
      type: String,
      require: true,
      default: ''
    }
  },
  {
    timestamps: true,
    typecast: true,
  }
)

user.plugin(mongoosePaginate);
var userModel = mongoose.model('user', user);
module.exports = userModel