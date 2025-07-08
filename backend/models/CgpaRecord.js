import mongoose from 'mongoose';

const cgpaRecordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const CgpaRecord = mongoose.model('CgpaRecord', cgpaRecordSchema);

export default CgpaRecord;  // ✅ Use export default for ESM
