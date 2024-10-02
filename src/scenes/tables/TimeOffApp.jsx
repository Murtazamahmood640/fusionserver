import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Paper,
  Modal,
  Grid,
  TextField,
  Alert,
  Pagination,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const TimeoffApp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState(new Set());
  const [alertMessage, setAlertMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const requestsPerPage = 10; // Maximum requests per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/timeoff');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id, reason, off_date, end_date, email, name) => {
    try {
      const res = await axios.post("https://hrserver1-8yj51ajr.b4a.run/api/timeoff/approve", { id });

      alert(res.data.message);

      await axios.get("https://hrserver1-8yj51ajr.b4a.run/api/timeoff/mail", {
        params: {
          email,
          reason,
          off_date,
          end_date
        }
      });

      setApprovedRequests(prev => new Set(prev).add(id));

      // Add a small delay before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (e) {
      console.log(e);
    }
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      Type_of_Time_Off: e.target.Type_of_Time_Off.value,
      Reason_for_Time_Off: e.target.Reason_for_Time_Off.value,
      To: e.target.To.value,
      From: e.target.From.value,
    };

    try {
      if (editingIndex !== null) {
        const updatedProject = await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/timeoff/${projects[editingIndex]._id}`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = updatedProject.data;
        setProjects(updatedProjects);
      } else {
        const newProject = await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/timeoff', formData);
        setProjects([...projects, newProject.data]);
      }
      setPopupOpen(false);
      setEditingIndex(null);
      e.target.reset();
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentProjects = projects.slice(indexOfFirstRequest, indexOfLastRequest);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box m="20px">
      <Header title="TIME OFF APPROVAL" subtitle="Manage Time Off Requests" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiTableContainer-root": { border: "none" },
          "& .MuiTable-root": { borderBottom: "none" },
          "& .MuiTableHead-root": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiTableBody-root": {
            backgroundColor: colors.primary[400],
          },
        }}
      >
        {alertMessage && (
          <Alert severity="success" onClose={() => setAlertMessage(null)}>
            {alertMessage}
          </Alert>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type of Time-Off</TableCell>
                <TableCell>Reason for Time-Off</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentProjects.length > 0 ? currentProjects
                .filter((project) => !project.Approved) // Only show non-approved requests
                .map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{project.Type_of_Time_Off || 'N/A'}</TableCell>
                  <TableCell>{project.Reason_for_Time_Off || 'N/A'}</TableCell>

                  {/* Format the From and To dates to show only the date part */}
                  <TableCell>{new Date(project.From).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.To).toLocaleDateString()}</TableCell>

                  <TableCell>{project.Email || 'N/A'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {project.Approved ? 'Approved' : 'X'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={project.Approved || approvedRequests.has(project._id)}
                      onClick={() => handleApprove(project._id, project.Reason_for_Time_Off, project.From, project.To, project.Email, project.Name)}
                      sx={{ backgroundColor: project.Approved ? '#919191' : '#1dd1a1' }}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                    No Time-Off Requests Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(projects.length / requestsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>

      <Modal open={isPopupOpen} onClose={handlePopupClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">
              {editingIndex !== null ? 'Edit Time Off Request' : 'Add Time Off Request'}
            </Typography>
          </Box>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Type of Time Off"
                  id="Type_of_Time_Off"
                  name="Type_of_Time_Off"
                  required
                  defaultValue={editingIndex !== null ? projects[editingIndex].Type_of_Time_Off : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Time Off"
                  id="Reason_for_Time_Off"
                  name="Reason_for_Time_Off"
                  required
                  defaultValue={editingIndex !== null ? projects[editingIndex].Reason_for_Time_Off : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="From"
                  type="date"
                  id="From"
                  name="From"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? projects[editingIndex].From : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="To"
                  type="date"
                  id="To"
                  name="To"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? projects[editingIndex].To : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="String"
                  id="Email"
                  name="Email"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? projects[editingIndex].Email : ''}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? 'Save Changes' : 'Add Time Off Request'}
              </Button>
              <Button onClick={handlePopupClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default TimeoffApp;
