import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    CarName: {
      type: String,
      required: true,
    },
    Make: {
      type: String,
      required: true
    },
    Model: {
      type: String,
      required: true,
    },
    Variant: {
      type: String,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },
    imported: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const carModel = mongoose.model('Car', carSchema);
export default carModel;
