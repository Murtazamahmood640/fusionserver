import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  useTheme,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const MilestonesList = () => {
  const [milestones, setMilestones] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [formData, setFormData] = useState({
    milestoneName: '',
    dueDate: '',
    status: '',
    description: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsiveness

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/milestones');
        const milestonesData = response.data.map((milestone, index) => ({
          ...milestone,
          id: milestone._id || index, // Ensure every row has a unique `id`
        }));
        setMilestones(milestonesData);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    fetchMilestones();
  }, []);

  const handleEdit = (milestone) => {
    if (!milestone._id) {
      console.error('No valid milestone ID found');
      return;
    }
    setSelectedMilestone(milestone);
    setFormData({
      milestoneName: milestone.milestoneName,
      dueDate: milestone.dueDate,
      status: milestone.status,
      description: milestone.description,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/milestones/${id}`);
      setMilestones(milestones.filter((milestone) => milestone._id !== id));
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    if (!selectedMilestone?._id) {
      console.error('No valid milestone ID found for update');
      return;
    }

    try {
      await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/milestones/${selectedMilestone._id}`, formData);
      setMilestones(milestones.map((milestone) =>
        milestone._id === selectedMilestone._id ? { ...formData, _id: selectedMilestone._id } : milestone
      ));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMilestone(null);
  };

  const columns = [
    { field: 'milestoneName', headerName: 'Milestone Name', flex: 1, minWidth: isMobile ? 120 : 150 },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 1,
      minWidth: isMobile ? 100 : 150,
      type: 'date',
      valueFormatter: (params) => {
        // Format the date to display only the date part
        return new Date(params.value).toLocaleDateString(); }
      },   
       { field: 'status', headerName: 'Status', flex: 1, minWidth: isMobile ? 100 : 150 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: isMobile ? 150 : 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: isMobile ? 150 : 170,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1, fontSize: isMobile ? '10px' : '12px' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
            sx={{ fontSize: isMobile ? '10px' : '12px' }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="View Milestones" subtitle="Manage list of all milestones" />

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
            padding: isMobile ? '4px' : '8px',
            fontSize: isMobile ? '10px' : '12px',
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: isMobile ? '12px' : '14px',
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
          overflowX: 'auto', // Allows horizontal scrolling for mobile views
        }}
      >
        <DataGrid
          rows={milestones}
          columns={columns}
          pageSize={isMobile ? 5 : 10} // Different page sizes for mobile vs desktop
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Box>

      {/* Edit Milestone Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Milestone</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Milestone Name"
            name="milestoneName"
            value={formData.milestoneName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            disabled // Make name uneditable
          />
          <TextField
            margin="dense"
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <Select
            margin="dense"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MilestonesList;
