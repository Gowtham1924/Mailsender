import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import Request from './models/Request.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Use a singleton connection for Serverless environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API endpoint to submit a new request
app.post('/api/requests', async (req, res) => {
  await connectDB();
  try {
    const { 
      projectName, serviceName, resourceName, region, cicd, 
      specification, developer, owner, approveName, 
      approvalStatus, currentStatus, startDate, endDate, costEstimation 
    } = req.body;

    // Save to database
    const newRequest = new Request({ 
      projectName, serviceName, resourceName, region, cicd, 
      specification, developer, owner, approveName, 
      approvalStatus, currentStatus, startDate, endDate, costEstimation 
    });
    await newRequest.save();

    // Send email notification
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
          subject: `New Project Request: ${projectName}`,
          html: `
            <h3>New Project Request</h3>
            <p><strong>Project Name:</strong> ${projectName}</p>
            <p><strong>Service Name:</strong> ${serviceName}</p>
            <p><strong>Resource Name:</strong> ${resourceName}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>CI/CD:</strong> ${cicd}</p>
            <p><strong>Specification:</strong> ${specification}</p>
            <p><strong>Developer:</strong> ${developer}</p>
            <p><strong>Owner:</strong> ${owner}</p>
            <p><strong>Approve Name:</strong> ${approveName}</p>
            <p><strong>Approval Status:</strong> ${approvalStatus}</p>
            <p><strong>Current Status:</strong> ${currentStatus}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Cost Estimation:</strong> $${costEstimation}</p>
          `
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.status(201).json({ message: 'Request submitted successfully!', request: newRequest });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ error: 'Failed to submit request', details: error.message, stack: error.stack });
  }
});

// Export for Vercel Serverless
export default app;

import { fileURLToPath } from 'url';
// Allow app to be run locally (for dev outside vercel)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    connectDB();
    console.log(`Backend server running on port ${PORT}`);
  });
}
