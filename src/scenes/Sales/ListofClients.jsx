import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ClientsList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsiveness
    const [clients, setClients] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '',
        clientId: '',
        companyName: '',
        email: '',
        contactNumber: '',
        billingAddress: '',
    });
    const [reFetch, setReFetch] = useState(false);

    useEffect(() => {
        fetchClients();
    }, [reFetch]);

    const fetchClients = async () => {
        try {
            const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/clients');
            const clientsWithId = response.data.map((client, index) => ({
                ...client,
                id: client._id || index,  // Fallback to index if _id is missing
            }));
            setClients(clientsWithId);
        } catch (error) {
            toast.error("Failed to fetch clients");
        }
    };

    const handleEditClick = (client) => {
        setSelectedClient(client);
        setFormData({
            clientName: client.clientName,
            clientId: client.clientId,
            companyName: client.companyName,
            email: client.email,
            contactNumber: client.contactNumber,
            billingAddress: client.billingAddress,
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/clients/${id}`);
            setReFetch(!reFetch);
            toast.success("Client deleted successfully");
        } catch (error) {
            toast.error("Failed to delete client");
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedClient(null);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async () => {
        try {
            if (selectedClient) {
                await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/clients/${selectedClient._id}`, formData);
                toast.success("Client updated successfully");
            } else {
                await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/clients', formData);
                toast.success("Client added successfully");
            }
            fetchClients();
            handleCloseDialog();
        } catch (error) {
            toast.error("Failed to save the client");
        }
    };

    const columns = [
        { field: "clientName", headerName: "Client Name", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "clientId", headerName: "Client ID", flex: isMobile ? 0 : 1, minWidth: 120 },
        { field: "companyName", headerName: "Company Name", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "email", headerName: "Email", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "contactNumber", headerName: "Contact Number", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "billingAddress", headerName: "Billing Address", flex: isMobile ? 0 : 1, minWidth: 150 },
        {
            field: "actions",
            headerName: "Actions",
            flex: isMobile ? 0 : 1,
            minWidth: 170,
            renderCell: (params) => (
                <Box>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleEditClick(params.row)}
                        sx={{ marginRight: 1, fontSize: isMobile ? '10px' : '12px' }} // Responsive font size
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleDeleteClick(params.row._id)}
                        sx={{ fontSize: isMobile ? '10px' : '12px' }} // Responsive font size
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="Clients List" subtitle="Manage list of clients" />
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
                        padding: isMobile ? '4px' : '8px', // Adjust padding for mobile
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
                    overflowX: 'auto', // Enable horizontal scrolling for mobile
                }}
            >
                <DataGrid
                    rows={clients}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSize={isMobile ? 5 : 10} // Adjust page size for mobile
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedClient ? 'Edit Client' : 'Add Client'}</DialogTitle>
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
                        label="Client ID"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Billing Address"
                        name="billingAddress"
                        value={formData.billingAddress}
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

            <ToastContainer />
        </Box>
    );
};

export default ClientsList;
