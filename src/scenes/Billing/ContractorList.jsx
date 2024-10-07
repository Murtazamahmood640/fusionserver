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
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';
import { tokens } from '../../theme';

const ContractorList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsiveness

  const [contractors, setContractors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [reFetch, setReFetch] = useState(false);
  const [formData, setFormData] = useState({
    contractorName: '',
    serviceType: '',
    projectAssigned: '',
    hourlyRate: '',
    paymentSchedule: '',
    notes: '',
  });

  useEffect(() => {
    fetchContractors();
  }, [reFetch]);

  const fetchContractors = async () => {
    try {
      const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/contractors');
      const contractorsWithIds = response.data.map((contractor, index) => ({
        ...contractor,
        id: contractor._id || index,  // Fallback to index if `_id` is missing
      }));
      setContractors(contractorsWithIds);
    } catch (error) {
      toast.error('Failed to fetch contractors');
    }
  };

  const handleEdit = (contractor) => {
    setEditingContractor(contractor);
    setFormData(contractor);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/contractors/${id}`);
      setReFetch(!reFetch);
      toast.success('Contractor deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contractor');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContractor(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      if (editingContractor) {
        await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/contractors/${editingContractor._id}`, formData);
        setContractors(contractors.map((contractor) =>
          contractor._id === editingContractor._id ? { ...contractor, ...formData } : contractor
        ));
        toast.success('Contractor updated successfully');
      } else {
        await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/contractors', formData);
        toast.success('Contractor created successfully');
      }
      fetchContractors();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to save the contractor');
    }
  };

  const columns = [
    { field: 'contractorName', headerName: 'Contractor Name', flex: 1, minWidth: isMobile ? 120 : 150 },
    { field: 'serviceType', headerName: 'Service Type', flex: 1, minWidth: isMobile ? 120 : 150 },
    { field: 'projectAssigned', headerName: 'Project Assigned', flex: 1, minWidth: isMobile ? 120 : 150 },
    { field: 'hourlyRate', headerName: 'Rate/Salary', flex: 1, minWidth: isMobile ? 100 : 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: isMobile ? 150 : 170,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="secondary"
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
    <Box m="20px" sx={{ pb: "40px" }}>
      <Header title="Contractor List" subtitle="Manage Contractors" />

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
          overflowX: 'auto',  // Allows horizontal scrolling for mobile views
        }}
      >
        <DataGrid
          rows={contractors}
          columns={columns}
          pageSize={isMobile ? 5 : 10}  // Different page sizes for mobile vs desktop
          checkboxSelection
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Update Contractor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingContractor ? 'Update Contractor' : 'Add Contractor'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Contractor Name"
            name="contractorName"
            value={formData.contractorName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Service Type"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Project Assigned"
            name="projectAssigned"
            value={formData.projectAssigned}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Rate/Salary"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Payment Schedule"
            name="paymentSchedule"
            value={formData.paymentSchedule}
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
            {editingContractor ? 'Save Changes' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default ContractorList;
