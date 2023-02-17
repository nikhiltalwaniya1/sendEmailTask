const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoosePaginate = require('mongoose-paginate');

const contactdetails = new Schema(
  {
    email: {
      type: String,
      default: ''
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      default: ''
    }
  },
  {
    timestamps: true,
    typecast: true,
  }
)

contactdetails.plugin(mongoosePaginate);
var contactModel = mongoose.model('contactdetails', contactdetails);
module.exports = contactModel