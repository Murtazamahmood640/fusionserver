import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const ManageStakeholder = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    contactPerson: '',
    contactInfo: '',
    company: '',
    notes: '',
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // To handle responsiveness

  useEffect(() => {
    // Fetch stakeholders data from the server
    const fetchStakeholders = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/stakeholders');
        const stakeholdersData = response.data.map((stakeholder, index) => ({
          ...stakeholder,
          id: stakeholder._id || index, // Ensure every row has a unique `id`
        }));
        setStakeholders(stakeholdersData);
      } catch (error) {
        console.error('Error fetching stakeholders:', error);
      }
    };

    fetchStakeholders();
  }, []);

  const handleEdit = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setFormData(stakeholder);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/stakeholders/${id}`);
      setStakeholders(stakeholders.filter((stakeholder) => stakeholder._id !== id));
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStakeholder(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/stakeholders/${selectedStakeholder._id}`, formData);
      setStakeholders(stakeholders.map((stakeholder) => (stakeholder._id === selectedStakeholder._id ? formData : stakeholder)));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating stakeholder:', error);
    }
  };

  const columns = [
    { field: 'clientName', headerName: 'Client Name', flex: 1, minWidth: isMobile ? 120 : 150},
    { field: 'contactPerson', headerName: 'Contact Person', flex: 1,minWidth: isMobile ? 120 : 150 },
    { field: 'contactInfo', headerName: 'Contact Info', flex: 1,minWidth: isMobile ? 120 : 150 },
    { field: 'company', headerName: 'Company', flex: 1,minWidth: isMobile ? 120 : 150 },
    { field: 'notes', headerName: 'Notes', flex: 1,minWidth: isMobile ? 120 : 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: isMobile ? 170 : 220,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px" sx={{ pb: "40px" }}>
      <Header title="View Stakeholders" subtitle="Manage list of all Stakeholders" />

      <Box
        height="600px"
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: colors.primary[400],
            borderRadius: '4px',
            border: 'none',
            color: colors.grey[100],
          },
          '& .MuiDataGrid-cell': {
            padding: '8px',
            fontSize: '12px',
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.primary[200]}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
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
          rows={stakeholders}
          columns={columns}
          pageSize={10}
          checkboxSelection
          getRowId={(row) => row.id} // Updated to use `id` for each row
        />
      </Box>

      {/* Update Stakeholder Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Stakeholder</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageStakeholder;
