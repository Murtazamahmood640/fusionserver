import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, Grid, FormControl, InputLabel, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import "./Expenses.css"; // Import the CSS file

const ViewExpenses = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsiveness
    const [expenses, setExpenses] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [reFetch, setReFetch] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [reFetch]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/expenses');
            const expensesWithIds = response.data.map((expense, index) => ({
                ...expense,
                id: expense._id || index,  // Fallback to index if `_id` is missing
            }));
            setExpenses(expensesWithIds);
        } catch (error) {
            toast.error("Failed to fetch expenses");
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setPopupOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/expenses/${id}`);
            setReFetch(!reFetch);
            toast.success("Expense deleted successfully");
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
        setEditingExpense(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            amount: parseFloat(e.target.amount.value),
            category: e.target.category.value,
            date: new Date(e.target.date.value),
            description: e.target.description.value,
            vendor: e.target.vendor.value,
            paymentMethod: e.target.paymentMethod.value,
            status: e.target.status.value,
        };

        try {
            if (editingExpense) {
                await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/expenses/${editingExpense._id}`, formData);
                toast.success("Expense updated successfully");
            } else {
                await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/expenses', formData);
                toast.success("Expense created successfully");
            }
            fetchExpenses();
            handlePopupClose();
        } catch (error) {
            toast.error("Failed to save the expense");
        }
    };

    const columns = [
        { field: "title", headerName: "Title", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "amount", headerName: "Amount", flex: isMobile ? 0 : 1, minWidth: 100 },
        { field: "category", headerName: "Category", flex: isMobile ? 0 : 1, minWidth: 120 },
        { field: "date", headerName: "Date", flex: isMobile ? 0 : 1, minWidth: 120, type: 'date', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
        { field: "vendor", headerName: "Vendor", flex: isMobile ? 0 : 1, minWidth: 150 },
        { field: "paymentMethod", headerName: "Payment Method", flex: isMobile ? 0 : 1, minWidth: 120 },
        { field: "status", headerName: "Status", flex: isMobile ? 0 : 1, minWidth: 120 },
        {
            field: "actions",
            headerName: "Actions",
            flex: isMobile ? 0 : 1,
            minWidth: 150,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)} sx={{ marginRight: 1, fontSize: isMobile ? '10px' : '12px' }}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)} sx={{ fontSize: isMobile ? '10px' : '12px' }}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="EXPENSE LIST" subtitle="Manage Expenses" />
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
                    overflowX: 'auto', // For mobile scrolling
                }}
            >
                <DataGrid
                    rows={expenses}
                    columns={columns}
                    pageSize={isMobile ? 5 : 10}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    getRowId={(row) => row.id}
                />
            </Box>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="text"
                                        id="title"
                                        name="title"
                                        label="Title"
                                        required
                                        defaultValue={editingExpense ? editingExpense.title : ''}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        label="Amount"
                                        required
                                        defaultValue={editingExpense ? editingExpense.amount : ''}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            id="category"
                                            name="category"
                                            label="Category"
                                            required
                                            defaultValue={editingExpense ? editingExpense.category : 'Travel'}
                                        >
                                            <MenuItem value="Travel">Travel</MenuItem>
                                            <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                                            <MenuItem value="Marketing">Marketing</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="date"
                                        id="date"
                                        name="date"
                                        label="Date"
                                        required
                                        defaultValue={editingExpense ? new Date(editingExpense.date).toISOString().split('T')[0] : ''}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="text"
                                        id="vendor"
                                        name="vendor"
                                        label="Vendor"
                                        defaultValue={editingExpense ? editingExpense.vendor : ''}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Payment Method</InputLabel>
                                        <Select
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            label="Payment Method"
                                            required
                                            defaultValue={editingExpense ? editingExpense.paymentMethod : 'Credit Card'}
                                        >
                                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                                            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                            <MenuItem value="Cash">Cash</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            id="status"
                                            name="status"
                                            label="Status"
                                            required
                                            defaultValue={editingExpense ? editingExpense.status : 'Pending'}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Approved">Approved</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <Button type="submit" variant="contained" color="primary">
                                    {editingExpense ? 'Save Changes' : 'Submit'}
                                </Button>
                                <Button onClick={handlePopupClose} variant="contained" color="secondary" sx={{ ml: 2 }}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </Box>
    );
};

export default ViewExpenses;
