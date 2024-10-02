import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, styled, TextField, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Header from "../../components/Header";
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme"; // To maintain theme consistency

// Styled table cells, matching the PayeeList styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const HighlightedTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.secondary,
  fontWeight: 'bold',
}));

const TimeEntryPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [email, setEmail] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalOnlineTime, setTotalOnlineTime] = useState("0h : 0min : 0sec");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Fetch users for the dropdown
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/getUser');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // When date range changes, filter the entries
    if (startDate && endDate) {
      filterEntriesByDateRange();
    }
  }, [startDate, endDate]);

  const handleUserChange = (e) => {
    const selectedUser = users.find(user => user.name === e.target.value);
    if (selectedUser) {
      setSelectedUser(selectedUser.name);
      setEmail(selectedUser.email);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/timeEntries', {
        params: { email }
      });
      setTimeEntries(response.data);
      setFilteredEntries(response.data);
      calculateTotalOnlineTime(response.data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      alert('Error fetching time entries');
    }
  };

  const filterEntriesByDateRange = () => {
    if (!startDate || !endDate) {
      setFilteredEntries(timeEntries);
      calculateTotalOnlineTime(timeEntries);
      return;
    }

    const filtered = timeEntries.filter(entry => {
      const entryDate = new Date(entry.checkIn);
      return entryDate >= startDate && entryDate <= endDate;
    });

    setFilteredEntries(filtered);
    calculateTotalOnlineTime(filtered);
  };

  const calculateTotalOnlineTime = (entries) => {
    const totalSeconds = entries.reduce((acc, entry) => {
      const duration = (new Date(entry.checkOut) - new Date(entry.checkIn)) / 1000;
      return acc + duration;
    }, 0);
    setTotalOnlineTime(formatTime(totalSeconds));
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header title="Time Entries" subtitle="View and Filter Employee Time Entries" />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 3 }}>
        <Box sx={{ width: '100%', marginBottom: 4 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Select Employee and Date Range</Typography>
          <TextField
            select
            label="Select Employee"
            value={selectedUser}
            onChange={handleUserChange}
            fullWidth
            required
            margin="normal"
          >
            {users.length === 0 ? (
              <MenuItem disabled>No Users Available</MenuItem> 
            ) : (
              users.map(user => (
                <MenuItem key={user.email} value={user.name}>
                  {user.name}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            label="Email"
            value={email}
            fullWidth
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          <Box sx={{ display: 'flex', marginTop: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={fetchTimeEntries}
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
          >
            Fetch Time Entries
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{
          boxShadow: 3,
          borderRadius: '4px',
          overflowX: 'auto',
          '& .MuiTable-root': {
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            border: 'none',
            color: colors.grey[100],
          },
          '& .MuiTableCell-root': {
            padding: '8px',
            fontSize: '12px',
            color: colors.grey[100],
            alignItems: 'center',
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiTableHead-root': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            borderBottom: 'none',
          },
          '& .MuiTableFooter-root': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            borderTop: 'none',
          },
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Check In</StyledTableCell>
                <StyledTableCell>Check Out</StyledTableCell>
                <StyledTableCell>Total Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{new Date(entry.checkIn).toLocaleTimeString()}</TableCell>
                  <TableCell>{new Date(entry.checkOut).toLocaleTimeString()}</TableCell>
                  <TableCell>{entry.totalTime}</TableCell>
                </TableRow>
              ))}
              {startDate && endDate && (
                <HighlightedTableRow>
                  <TableCell colSpan={3} align="right" style={{ fontWeight: 'bold' }}>Total Work Time:</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>{totalOnlineTime}</TableCell>
                </HighlightedTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TimeEntryPage;
