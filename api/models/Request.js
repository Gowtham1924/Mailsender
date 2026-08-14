import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  serviceName: { type: String, required: true },
  resourceName: { type: String, required: true },
  region: { type: String, required: true },
  cicd: { type: String, required: true },
  specification: { type: String, required: true },
  developer: { type: String, required: true },
  owner: { type: String, required: true },
  approveName: { type: String, required: true },
  approvalStatus: { type: String, required: true },
  currentStatus: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  costEstimation: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Request || mongoose.model('Request', requestSchema);
