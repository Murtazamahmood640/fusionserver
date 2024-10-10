import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography, TextField, IconButton } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, PieController, BarController, Legend, Tooltip } from 'chart.js';

// Register the Chart.js components
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, PieController, BarController, Legend, Tooltip);

const ViewFeedback = () => {
  const theme = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/feedback/${id}`);
      fetchFeedbacks(); // Re-fetch feedbacks after deletion
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const downloadFeedbacks = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Subject', 'Feedback', 'Sentiment', 'Category']],
      body: feedbacks.map(f => [f.subject, f.feedback, f.sentiment, f.category]),
    });
    doc.save('feedbacks.pdf');
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredFeedbacks = feedbacks.filter((f) =>
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    f.feedback.toLowerCase().includes(search.toLowerCase())
  );

  // Charts for sentiment and category-wise data
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [
        feedbacks.filter(f => f.sentiment === 'Positive').length,
        feedbacks.filter(f => f.sentiment === 'Neutral').length,
        feedbacks.filter(f => f.sentiment === 'Negative').length,
      ],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'], // Changed yellow to orange
    }]
  };

  const categorizedData = {
    labels: ['UI', 'Functionality', 'Management', 'Employee Behavior'],
    datasets: [
      {
        label: 'Positive',
        data: [
          feedbacks.filter(f => f.sentiment === 'Positive' && f.category === 'UI').length,
          feedbacks.filter(f => f.sentiment === 'Positive' && f.category === 'Functionality').length,
          feedbacks.filter(f => f.sentiment === 'Positive' && f.category === 'Management').length,
          feedbacks.filter(f => f.sentiment === 'Positive' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#4caf50',
      },
      {
        label: 'Neutral',
        data: [
          feedbacks.filter(f => f.sentiment === 'Neutral' && f.category === 'UI').length,
          feedbacks.filter(f => f.sentiment === 'Neutral' && f.category === 'Functionality').length,
          feedbacks.filter(f => f.sentiment === 'Neutral' && f.category === 'Management').length,
          feedbacks.filter(f => f.sentiment === 'Neutral' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#ff9800', // Changed yellow to orange
      },
      {
        label: 'Negative',
        data: [
          feedbacks.filter(f => f.sentiment === 'Negative' && f.category === 'UI').length,
          feedbacks.filter(f => f.sentiment === 'Negative' && f.category === 'Functionality').length,
          feedbacks.filter(f => f.sentiment === 'Negative' && f.category === 'Management').length,
          feedbacks.filter(f => f.sentiment === 'Negative' && f.category === 'Employee Behavior').length,
        ],
        backgroundColor: '#f44336',
      }
    ]
  };

  // Restore proper chart size with padding for separation
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Chart proportion
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Chart proportion
  };

  // Style based on sentiment
  const getCardBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return '#4caf50'; // Green for positive
      case 'Neutral':
        return '#808080'; // Orange for neutral (changed from yellow)
      case 'Negative':
        return '#f44336'; // Red for negative
      default:
        return '#fff'; // Default white background
    }
  };

  return (
    <Box m="20px">
      <Header title="SUBMITTED FEEDBACK" subtitle="Feedback Overview and Analytics" />
      
      {/* Search and download */}
      <Box display="flex" justifyContent="space-between" mb={2}>
  <TextField
    label="Search Feedback"
    variant="outlined"
    fullWidth
    value={search}
    onChange={handleSearchChange}
    sx={{ 
      backgroundColor: theme.palette.background.paper, 
      borderRadius: 2, 
      '& .MuiOutlinedInput-root': {
        height: '40px',  // Increase height to fix the text issue
        display: 'flex',
        alignItems: 'center',  // Ensure text is vertically centered
        padding: '0 14px',  // Adjust padding inside the input
      },
      '& .MuiInputLabel-root': {
        top: '-4px',  // Adjust label position
      },
    }}
  />
  <Button
    onClick={downloadFeedbacks}
    variant="contained"
    color="secondary"
    sx={{ 
      ml: 2, 
      height: '40px',  // Ensure consistent height with the search bar
      minHeight: 'unset',
      display: 'flex',
      alignItems: 'center'  // Vertically center the text inside the button
    }}
  >
    Download
  </Button>
</Box>


      {/* Feedback Cards */}
      <Grid container spacing={2} mb={5}>
        {filteredFeedbacks.map((feedback) => (
          <Grid item xs={12} sm={6} md={4} key={feedback._id}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: getCardBackgroundColor(feedback.sentiment),
                color: '#fff', // White text for contrast
                boxShadow: 3,
                borderRadius: 2,
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feedback.subject}
                </Typography>
                <Typography variant="body2">
                  {feedback.feedback}
                </Typography>
                <Typography variant="subtitle2">
                  Sentiment: {feedback.sentiment}
                </Typography>
                <Typography variant="subtitle2">
                  Category: {feedback.category}
                </Typography>
                <IconButton
                  color="inherit"
                  onClick={() => deleteFeedback(feedback._id)}
                  sx={{ float: 'right' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts with proper size and spacing */}
      <Box mt={2} sx={{ height: '400px', paddingBottom: '20px' }}>
        <Typography variant="h4" color="textPrimary" mb={2}>
          Sentiment Distribution
        </Typography>
        <Pie data={sentimentData} options={pieOptions} />
      </Box>

      <Box mt={2} sx={{ height: '400px', paddingBottom: '20px' }}>
        <Typography variant="h4" color="textPrimary" mb={2}>
          Category-wise Sentiment Distribution
        </Typography>
        <Bar data={categorizedData} options={barOptions} />
      </Box>
    </Box>
  );
};

export default ViewFeedback;
