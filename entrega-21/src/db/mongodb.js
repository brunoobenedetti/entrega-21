import mongoose from 'mongoose'

export const URI = 'mongodb+srv://Brunobenedetti:gqR5QK9cZyLi81Pa@cluster0.ieacksr.mongodb.net/ecommerce';

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('DB connected')
  } catch (error) {
    console.log('DB conection error:', error.message)
  }
}