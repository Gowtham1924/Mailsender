import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios';
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
    const db = await mongoose.connect(process.env.MONGODB_URI, { 
      dbName: 'ProjectDetailsGWC' 
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB: ProjectDetailsGWC');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
  }
});

async function sendEmailViaGraph(projectName, emailBody) {
  // 1. Get Access Token
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', process.env.CLIENT_ID);
  tokenParams.append('client_secret', process.env.CLIENT_SECRET);
  tokenParams.append('scope', 'https://graph.microsoft.com/.default');
  tokenParams.append('grant_type', 'client_credentials');

  const tokenResponse = await axios.post(tokenEndpoint, tokenParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const accessToken = tokenResponse.data.access_token;

  // 2. Send Email
  const graphEndpoint = `https://graph.microsoft.com/v1.0/users/${process.env.SENDER_EMAIL}/sendMail`;
  
  const mailBody = {
    message: {
      subject: `New Project Request: ${projectName || 'Unknown'}`,
      body: {
        contentType: "HTML",
        content: emailBody
      },
      toRecipients: [
        {
          emailAddress: {
            address: process.env.RECEIVER_EMAIL
          }
        }
      ]
    },
    saveToSentItems: "true"
  };

  await axios.post(graphEndpoint, mailBody, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

// API endpoint to submit a new request
app.post('/api/requests', async (req, res) => {
  await connectDB();
  try {
    const { 
      projectName, serviceName, resourceName, region, cicd, 
      specification, developer, owner, approveName, 
      approvalStatus, currentStatus, startDate, endDate, costEstimation 
    } = req.body;

    const requestData = { 
      projectName, serviceName, resourceName, region, cicd, 
      specification, developer, owner, approveName, 
      approvalStatus, currentStatus, startDate, endDate, costEstimation 
    };

    // Remove empty strings for Date and Number fields to prevent Mongoose CastErrors
    if (requestData.startDate === "") delete requestData.startDate;
    if (requestData.endDate === "") delete requestData.endDate;
    if (requestData.costEstimation === "") delete requestData.costEstimation;

    // Save to database
    const newRequest = new Request(requestData);
    await newRequest.save();

    // Send email notification
    try {
      const htmlBody = `
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
      `;

      const isGraphAuth = !!(process.env.CLIENT_ID && process.env.TENANT_ID && process.env.SENDER_EMAIL);

      if (isGraphAuth) {
        console.log('Sending email via Microsoft Graph API...');
        await sendEmailViaGraph(projectName, htmlBody);
      } else {
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.SENDER_EMAIL;
        if (smtpUser && smtpUser !== 'your_email@gmail.com') {
          console.log('Sending email via Nodemailer...');
          const mailOptions = {
            from: smtpUser,
            to: process.env.RECEIVER_EMAIL || smtpUser,
            subject: `New Project Request: ${projectName}`,
            html: htmlBody
          };
          await transporter.sendMail(mailOptions);
        }
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

// Get all requests
app.get('/api/requests', async (req, res) => {
  await connectDB();
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
  }
});

// Get a single request by ID
app.get('/api/requests/:id', async (req, res) => {
  await connectDB();
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request', details: error.message });
  }
});

// Update a request
app.put('/api/requests/:id', async (req, res) => {
  await connectDB();
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json({ message: 'Request updated successfully!', request: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request', details: error.message });
  }
});

// Delete a request
app.delete('/api/requests/:id', async (req, res) => {
  await connectDB();
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });
    res.status(200).json({ message: 'Request deleted successfully!' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request', details: error.message });
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
