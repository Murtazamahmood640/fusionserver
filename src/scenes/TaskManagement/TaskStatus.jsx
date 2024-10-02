import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const TaskStatus = () => {
  const [tasks, setTasks] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('name'));
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // To handle responsiveness

  useEffect(() => {
    // Fetch tasks assigned by the current user (assigner)
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/tasks-assigned', {
          params: { assignedBy: currentUser.name },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentUser.name]);

  const columns = [
    { field: 'taskName', headerName: 'Task Name', flex: 1, minWidth: isMobile ? 120 : 150 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1, minWidth: isMobile ? 100 : 150 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      minWidth: isMobile ? 100 : 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      minWidth: isMobile ? 100 : 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: 'taskStatus', headerName: 'Status', flex: 1, minWidth: isMobile ? 100 : 150 },
  ];

  return (
    <Box m="20px">
      <Header title="Task Status" subtitle="Tasks assigned by you" />
      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            border: 'none',
            color: colors.grey[100],
          },
          '& .MuiDataGrid-cell': {
            padding: isMobile ? '4px' : '8px', // Adjust cell padding for mobile
            fontSize: isMobile ? '10px' : '12px', // Adjust font size for mobile
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: isMobile ? '12px' : '14px', // Adjust header font size for mobile
            borderBottom: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            borderTop: 'none',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSize={isMobile ? 5 : 10} // Adjust page size for mobile
          checkboxSelection
          getRowId={(row) => row._id} // Ensure it uses the actual `_id` field
        />
      </Box>
    </Box>
  );
};

export default TaskStatus;
