import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Header from '../../components/Header';
import { tokens } from "../../theme";
import { useTheme } from '@mui/system';

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreFAQs, setShowMoreFAQs] = useState(false); // Track if more FAQs should be shown

  // Top 10 FAQs
  const topFAQs = [
    { question: "How can I create a comprehensive user profile?", answer: "Visit the 'Create User' section to create a user profile. Fill in the necessary information, such as name, contact details, and user role, and assign permissions based on user requirements." },
    { question: "Can employee details be adjusted after profile creation?", answer: "Yes, simply access the 'Employee Data' section and select the employee's profile. From there, you can edit and update any necessary information." },
    { question: "How do I securely upload important documents?", answer: "In the 'Document Information' area, click on 'Upload Document' and select the files you want to upload. All uploaded documents are securely stored and encrypted." },
    { question: "What’s the process for submitting a time-off request?", answer: "Use the 'Time Off Request' section to fill in the details for your time-off request. Once submitted, it will be reviewed by your manager for approval." },
    { question: "Is it possible to correct attendance mistakes?", answer: "Yes, managers or HR can rectify attendance records by accessing the 'Attendance Management' section and making the necessary adjustments." },
    { question: "How can I add a new payee?", answer: "In the 'Add Payee' section, fill in the required details, such as the payee's name and bank account information, then submit the form." },
    { question: "How can I log a mileage claim?", answer: "Go to the 'Add Mileage Claim' section and fill in your travel details, including start and end locations, mileage, and purpose. Submit the claim for approval." },
    { question: "How can I submit a new expense claim?", answer: "In the 'Add Claim' section, fill out the claim details including the expense type, amount, and attach any receipts. Submit it for approval." },
    { question: "What’s the process for managing expense claims?", answer: "In the 'Expense Claims' section, you can view, edit, and approve or reject expense claims submitted by employees." },
    { question: "How do I assign employees to a project?", answer: "After creating a project, go to the 'Assign Employees' section and select the team members you want to assign to the project. You can assign multiple employees at once." },
  ];

  // Remaining FAQs to show on "More FAQs" click
  const moreFAQs = [
    { question: "How do I keep track of task progress?", answer: "The 'Task Status' section allows you to monitor the progress of tasks and assign statuses such as 'in progress,' 'completed,' or 'pending'." },
    { question: "What’s the process for generating invoices?", answer: "In the 'Add Bills' section, you can generate invoices based on the services rendered or products sold. Fill in the billing details, and the system will generate an invoice for you." },
    { question: "How do I record a payment for an employee?", answer: "To log a payment, go to the 'Add Payment' section and input the details of the payment, including the amount and the employee's payment method." },
    { question: "How can I view all recorded expenses?", answer: "Use the 'View Expenses' section to see a list of all expenses recorded in the system. You can filter by date, department, or employee." },
    { question: "Can receipts be attached to expenses?", answer: "Yes, when adding an expense, you can upload any relevant receipts or documentation as attachments to the expense record." },
  ];

  // Combine FAQs
  const allFAQs = showMoreFAQs ? [...topFAQs, ...moreFAQs] : topFAQs;

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter FAQs based on search query
  const filteredFAQs = allFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box m="40px" p="20px" sx={{ pb: "40px" }}>
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          label="Search FAQs"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* FAQ Cards Grid */}
      <Grid container spacing={3}>
        {filteredFAQs.map((faq, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                minHeight: '150px', // Ensures cards are not too small
              }}
            >
              <CardContent>
                <Typography variant="h6" color={colors.greenAccent[500]} fontWeight="bold" gutterBottom>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color={colors.grey[100]}>
                  {faq.answer}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* "More FAQs" button */}
      {!showMoreFAQs && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained" color="primary" onClick={() => setShowMoreFAQs(true)}>
            Show More FAQs
          </Button>
        </Box>
      )}

      {/* "Show Less" button when FAQs are expanded */}
      {showMoreFAQs && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained" color="secondary" onClick={() => setShowMoreFAQs(false)}>
            Show Less FAQs
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FAQ;
