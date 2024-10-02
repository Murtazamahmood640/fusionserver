import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FolderIcon from '@mui/icons-material/Folder';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const ProjectOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Responsive breakpoint
  const currentUser = JSON.parse(localStorage.getItem('name'));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/tasks-assigned', {
          params: { assignedTo: currentUser.name },
        });
        const allTasks = response.data;
        const completedTasks = allTasks.filter(task => task.taskStatus === 'Complete');
        const PendingTasks = allTasks.filter(task => task.taskStatus === 'Pending');
        
        setCompletedTaskCount(completedTasks.length);
        setPendingTasksCount(PendingTasks.length);
        setTotalTasksCount(allTasks.length);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentUser.name]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/project-overview');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return <div><CircularProgress /> Loading...</div>;
  }

  const { totalProjects, recentProjects } = dashboardData;

  const taskDistribution = [
    { name: 'Completed Tasks', value: completedTaskCount || 0 },
    { name: 'Pending Tasks', value: pendingTasksCount || 0 },
  ];

  const gridStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: isMobile ? '10px' : '20px', // Adjust padding for mobile
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: colors.primary[400],
    height: '100%',
  };

  const iconStyles = {
    fontSize: isMobile ? '30px' : '40px', // Adjust icon size for mobile
    marginBottom: isMobile ? '5px' : '10px',
    color: colors.greenAccent[600],
  };

  const textColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const centeredTableCell = {
    color: textColor,
    textAlign: 'center',
  };

  const headingStyles = {
    paddingBottom: isMobile ? '10px' : '20px', // Adjust padding for mobile
    color: textColor,
    textAlign: 'center',
  };

  return (
    <Paper style={{ padding: isMobile ? 10 : 20, backgroundColor: theme.palette.background.paper }}>
      <Header title="Project Overview" subtitle="Overview of your projects and tasks" />

      {/* Top Section: 4 Grids */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box style={gridStyles}>
            <FolderIcon style={iconStyles} />
            <Typography variant={isMobile ? 'body1' : 'h6'} style={{ color: textColor }}>Total Projects</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} style={{ color: textColor }}>{totalProjects || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box style={gridStyles}>
            <AssignmentIcon style={iconStyles} />
            <Typography variant={isMobile ? 'body1' : 'h6'} style={{ color: textColor }}>Total Tasks</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} style={{ color: textColor }}>{totalTasksCount || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box style={gridStyles}>
            <DoneAllIcon style={iconStyles} />
            <Typography variant={isMobile ? 'body1' : 'h6'} style={{ color: textColor }}>Completed Tasks</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} style={{ color: textColor }}>{completedTaskCount || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box style={gridStyles}>
            <PendingActionsIcon style={iconStyles} />
            <Typography variant={isMobile ? 'body1' : 'h6'} style={{ color: textColor }}>Pending Tasks</Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} style={{ color: textColor }}>{pendingTasksCount || 0}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Section: 2 Grids */}
      <Grid container spacing={2} style={{ marginTop: isMobile ? 10 : 20 }}>
        <Grid item xs={12} md={6}>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom style={headingStyles}>
            Recent Projects
          </Typography>
          <Box style={{ ...gridStyles, paddingTop: 0 }}>
            {recentProjects && recentProjects.length > 0 ? (
              <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: colors.primary[400] }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={centeredTableCell}>Project Name</TableCell>
                      <TableCell style={centeredTableCell}>Start Date</TableCell>
                      <TableCell style={centeredTableCell}>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentProjects.map(project => (
                      <TableRow key={project._id}>
                        <TableCell style={centeredTableCell}>{project.projectName || "N/A"}</TableCell>
                        <TableCell style={centeredTableCell}>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                        <TableCell style={centeredTableCell}>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No recent projects available.</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom style={headingStyles}>
            Task Distribution
          </Typography>
          <Box style={gridStyles}>
            {taskDistribution && taskDistribution.length > 0 ? (
              <PieChart width={isMobile ? 250 : 400} height={isMobile ? 250 : 400}>
                <Pie
                  data={taskDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 100 : 150}
                  fill={theme.palette.primary.main}
                  label
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? theme.palette.secondary.main : theme.palette.success.main} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <Typography style={{ color: textColor, textAlign: 'center' }}>No task data available.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProjectOverview;
