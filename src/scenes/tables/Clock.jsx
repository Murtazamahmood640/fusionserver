import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, styled, useTheme, TextField, useMediaQuery, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Header from "../../components/Header";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const HighlightedTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#141b2d',
  fontWeight: 'bold',
}));

const LiveClock = ({ diameter }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const radius = diameter / 2;
  const cx = radius;
  const cy = radius;

  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourAngle = (360 / 12) * (hour % 12) + (minute / 60) * 30;
  const minuteAngle = (360 / 60) * minute;
  const secondAngle = (360 / 60) * second;

  return (
    <Box sx={{ position: 'relative', width: diameter, height: diameter, margin: '0 auto', marginTop: 4 }}>
      <svg width={diameter} height={diameter}>
        <circle cx={cx} cy={cy} r={radius} fill="black" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.5 * Math.cos(Math.PI / 2 - (Math.PI / 180) * hourAngle)} y2={cy - radius * 0.5 * Math.sin(Math.PI / 2 - (Math.PI / 180) * hourAngle)} stroke="white" strokeWidth="4" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.75 * Math.cos(Math.PI / 2 - (Math.PI / 180) * minuteAngle)} y2={cy - radius * 0.75 * Math.sin(Math.PI / 2 - (Math.PI / 180) * minuteAngle)} stroke="white" strokeWidth="3" />
        <line x1={cx} y1={cy} x2={cx + radius * 0.85 * Math.cos(Math.PI / 2 - (Math.PI / 180) * secondAngle)} y2={cy - radius * 0.85 * Math.sin(Math.PI / 2 - (Math.PI / 180) * secondAngle)} stroke="red" strokeWidth="2" />
      </svg>
    </Box>
  );
};

const Clock = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for mobile screens
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInButtonText, setCheckInButtonText] = useState("Check In");
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalOnlineTime, setTotalOnlineTime] = useState("0h : 0min : 0sec");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const storedCheckInTime = localStorage.getItem('checkInTime');
    const storedIsActive = JSON.parse(localStorage.getItem('isActive'));

    if (storedCheckInTime) {
      const checkInDate = new Date(storedCheckInTime);
      setCheckInTime(checkInDate);
      const timeElapsed = Math.floor((new Date() - checkInDate) / 1000);
      setElapsedTime(timeElapsed);
    }
    if (storedIsActive) {
      setIsActive(storedIsActive);
    }

    getEntries();
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && checkInTime) {
      interval = setInterval(() => {
        const timeElapsed = Math.floor((new Date() - checkInTime) / 1000);
        setElapsedTime(timeElapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, checkInTime]);

  useEffect(() => {
    filterEntriesByDateRange();
  }, [startDate, endDate]);

  const handleCheckin = async () => {
    const now = new Date();
    if (!isActive) {
      setCheckInTime(now);
      setIsActive(true);
      setCheckInButtonText("Clock Out");
      localStorage.setItem('checkInTime', now.toISOString());
      localStorage.setItem('isActive', JSON.stringify(true));
    } else {
      setIsActive(false);
      setCheckInButtonText("Check In");
      const checkOutTime = now;
      const totalTime = (checkOutTime - checkInTime) / 1000; // total time in seconds
      const newEntry = {
        date: checkInTime.toLocaleDateString(),
        day: checkInTime.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: checkInTime.toISOString(),
        checkOut: checkOutTime.toISOString(),
        totalTime: formatTime(totalTime),
        email: localStorage.getItem('email')
      };
      axios.post("https://hrserver1-8yj51ajr.b4a.run/api/timeEntries", newEntry)
        .then((res) => {
          getEntries();
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
      setElapsedTime(0);
      localStorage.removeItem('checkInTime');
      localStorage.removeItem('isActive');
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  const getEntries = async () => {
    try {
      const res = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/timeEntries', {
        params: {
          email: localStorage.getItem('email')
        }
      });
      setTimeEntries(res.data);
      filterEntriesByDateRange(res.data);
    } catch (e) {
      console.log(e);
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

  const clockDiameter = isMobile ? 200 : 240; // Adjust clock size for mobile

  return (
    <Box sx={{ pb: "40px" }}>
      <Header title="ATTENDANCE" subtitle="Mark & Manage Your Attendance" />

      {/* Mobile: Clock on top and table at bottom */}
      <Grid container spacing={4}>
        {isMobile && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>Mark Your Attendance Here</Typography>
              <Card sx={{ width: '100%', boxShadow: 3, borderRadius: '16px', border: '6px solid #2AEAE3', marginBottom: 4, textAlign: 'center' }}>
                <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
                  <Typography variant={isMobile ? "h3" : "h1"} sx={{ color: theme.palette.text.primary }}>{formatTime(elapsedTime)}</Typography>
                  <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                    Clocked In: {isActive ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                  </Typography>
                  <Button
                    variant="contained"
                    color={isActive ? 'secondary' : 'secondary'}
                    onClick={handleCheckin}
                    startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
                    sx={{ mt: 2 }}
                  >
                    {checkInButtonText}
                  </Button>

                  <LiveClock diameter={clockDiameter} />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}

        {/* Desktop: Table and Clock side by side */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>Your History</Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, maxHeight: '70vh', borderRadius: '16px', border: '6px solid #2AEAE3', overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell>Check In</StyledTableCell>
                  <StyledTableCell>Check Out</StyledTableCell>
                  <StyledTableCell>Total Time</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{new Date(entry.checkIn).toLocaleTimeString()}</TableCell>
                    <TableCell>{new Date(entry.checkOut).toLocaleTimeString()}</TableCell>
                    <TableCell>{entry.totalTime}</TableCell>
                  </TableRow>
                ))}
                {startDate && endDate && (
                  <HighlightedTableRow>
                    <TableCell colSpan={4} align="right" style={{ fontWeight: 'bold' }}>Total Online Time for Selected Period:</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalOnlineTime}</TableCell>
                  </HighlightedTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Date Range Picker */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
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
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={5}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>Mark Your Attendance Here</Typography>
              <Card sx={{ width: '100%', boxShadow: 3, borderRadius: '16px', border: '6px solid #2AEAE3', marginBottom: 4, textAlign: 'center' }}>
                <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
                  <Typography variant={isMobile ? "h3" : "h1"} sx={{ color: theme.palette.text.secondary }}>{formatTime(elapsedTime)}</Typography>
                  <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                    Clocked In: {isActive ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                  </Typography>
                  <Button
                    variant="contained"
                    color={isActive ? 'secondary' : 'secondary'}
                    onClick={handleCheckin}
                    startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
                    sx={{ mt: 2 }}
                  >
                    {checkInButtonText}
                  </Button>

                  <LiveClock diameter={clockDiameter} />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Clock;
