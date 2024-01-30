const mongoose = require('mongoose');
const {Schema}=mongoose;
const foodSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
      regular: {
        type: String,
        required: true,
      },
      medium: {
        type: String,
        required: true,
      },
      large: {
        type: String,
        required: true,
      },
  description: {
    type: String,
    required: true,
  },
});



module.exports=mongoose.model('Food', foodSchema)
