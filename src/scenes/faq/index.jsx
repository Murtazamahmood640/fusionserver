import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Header from '../../components/Header';
import { tokens } from "../../theme";
import { useTheme } from '@mui/system';

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);

  // Top 10 FAQs
  const topFAQs = [
    { question: "How can I create a comprehensive user profile?", answer: "Visit the 'Create User' section..." },
    { question: "Can employee details be adjusted after profile creation?", answer: "Yes, simply access the 'Employee Data'..." },
    { question: "How do I securely upload important documents?", answer: "In the 'Document Information' area..." },
    { question: "What’s the process for submitting a time-off request?", answer: "Use the 'Time Off Request' section..." },
    { question: "Is it possible to correct attendance mistakes?", answer: "Yes, managers or HR can rectify attendance..." },
    { question: "How can I add a new payee?", answer: "In the 'Add Payee' section, fill in the details..." },
    { question: "How can I log a mileage claim?", answer: "Go to the 'Add Mileage Claim' section..." },
    { question: "How can I submit a new expense claim?", answer: "In the 'Add Claim' section, fill out the claim..." },
    { question: "What’s the process for managing expense claims?", answer: "In the 'Expense Claims' section..." },
    { question: "How do I assign employees to a project?", answer: "After creating a project, assign team members..." },
  ];

  // Remaining FAQs to show on "More FAQs" click
  const moreFAQs = [
    { question: "How do I keep track of task progress?", answer: "The 'Task Status' section allows you..." },
    { question: "What’s the process for generating invoices?", answer: "In the 'Add Bills' section..." },
    { question: "How do I record a payment for an employee?", answer: "To log a payment, go to the 'Add Payment'..." },
    { question: "How can I view all recorded expenses?", answer: "Use the 'View Expenses' section..." },
    { question: "Can receipts be attached to expenses?", answer: "Yes, when adding an expense, you can upload..." },
  ];

  const allFAQs = [...topFAQs, ...moreFAQs];

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
            <Card elevation={3} sx={{
              backgroundColor: colors.primary[400],
              borderRadius: '8px',
            }}>
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
    </Box>
  );
};

export default FAQ;
