import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, default: 1, required: true }
  }]
})

export default mongoose.model('cart', cartSchema);