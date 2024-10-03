import { Box, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import Header from "../../components/Header";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { styled } from "@mui/system";
import { useState } from "react";

// Custom Accordion with rounded corners and shadows
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  transition: '0.3s ease',
}));

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for showing more FAQs
  const [showMore, setShowMore] = useState(false);

  // Top 10 FAQs
  const topFAQs = [
    { question: "How can I create a comprehensive user profile?", answer: "Visit the 'Create User' section where you can enter essential details like the user's name, designation, contact information, email addresses, and password. Ensure all required fields are filled and then click 'Submit.'" },
    { question: "Can employee details be adjusted after profile creation?", answer: "Yes, simply access the 'Employee Data' section, select the relevant profile, and use the 'Edit' button to update the employee's information." },
    { question: "How do I securely upload important documents?", answer: "In the 'Document Information' area, provide the document name, sender, purpose, and date. Attach the file and click 'Submit' to securely upload it." },
    { question: "What’s the process for submitting a time-off request?", answer: "Use the 'Time Off Request' section, select the leave type, provide the reason, and specify the dates. Submit the request for approval with a single click." },
    { question: "Is it possible to correct attendance mistakes?", answer: "Yes, managers or HR can rectify attendance errors through the admin panel located in the 'Time and Attendance' section." },
    { question: "How can I add a new payee?", answer: "In the 'Add Payee' section, fill in the details such as name, employee ID, department, bank account, and tax-related information. Once completed, click 'Submit.'" },
    { question: "How can I log a mileage claim?", answer: "Go to the 'Add Mileage Claim' section, provide the necessary information such as claim name, service type, and project fees. Click 'Submit' to record the claim." },
    { question: "How can I submit a new expense claim?", answer: "In the 'Add Claim' section, fill out the claim name, amount, and description, then click 'Submit' to finalize the claim." },
    { question: "What’s the process for managing expense claims?", answer: "In the 'Expense Claims' section, review each claim by checking the claim name, amount, type, and date. Use the 'Actions' button to approve, reject, or modify the claim." },
    { question: "How do I assign employees to a project?", answer: "After creating a project, you can assign team members by editing the project and selecting employees from the available list." },
  ];

  // Remaining FAQs to show on "More FAQs" click
  const moreFAQs = [
    { question: "How do I keep track of task progress?", answer: "The 'Task Status' section allows you to monitor tasks by viewing the project name, assigned employee, and deadlines. Use the 'Actions' button to update the status of each task." },
    { question: "What’s the process for generating invoices?", answer: "In the 'Add Bills' section, select a client or project, enter the necessary billing details such as the amount and due date, and click 'Submit' to generate the invoice." },
    { question: "How do I record a payment for an employee?", answer: "To log a payment, go to the 'Add Payment' section, select the payee, enter the amount, payment date, and any relevant bonuses or deductions. Finalize the entry by hitting 'Submit.'" },
    { question: "How can I view all recorded expenses?", answer: "Use the 'View Expenses' section to see a list of all expenses categorized by type, date, or project for easy access." },
    { question: "Can receipts be attached to expenses?", answer: "Yes, when adding an expense, you can easily upload and attach scanned copies of receipts for proper documentation." },
  ];

  return (
    <Box m="40px" p="20px" bgcolor={theme.palette.background.default}>
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      {/* Add a gradient background to the header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[600]})`,
          borderRadius: '12px',
          padding: '20px',
          mb: '20px',
        }}
      >
        <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color={colors.grey[300]}>
          Find the answers to common queries below.
        </Typography>
      </Box>

      {/* Render top 10 FAQs */}
      {topFAQs.map((faq, index) => (
        <StyledAccordion key={index} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: colors.greenAccent[500] }} />}>
            <Typography color={colors.greenAccent[500]} variant="h6" fontWeight="bold">
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color={colors.grey[100]}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </StyledAccordion>
      ))}

      {/* Button to show more FAQs */}
      {!showMore && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowMore(true)}
          sx={{ marginTop: '20px' }}
        >
          More FAQs
        </Button>
      )}

      {/* Render remaining FAQs when "More FAQs" is clicked */}
      {showMore && (
        moreFAQs.map((faq, index) => (
          <StyledAccordion key={index + topFAQs.length} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: colors.greenAccent[500] }} />}>
              <Typography color={colors.greenAccent[500]} variant="h6" fontWeight="bold">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color={colors.grey[600]}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </StyledAccordion>
        ))
      )}
    </Box>
  );
};

export default FAQ;
