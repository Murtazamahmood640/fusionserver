import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    category: '',
    price: '',
    stockQuantity: '',
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // For responsive adjustments

  useEffect(() => {
    // Fetch products data from the server
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://hrserver1-8yj51ajr.b4a.run/api/products');
        const productsData = response.data.map((product, index) => ({
          ...product,
          id: product._id || index,  // Fallback to index if _id is not available
        }));
        setProducts(productsData);
      } catch (error) {
        toast.error('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      productId: product.productId,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrserver1-8yj51ajr.b4a.run/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`https://hrserver1-8yj51ajr.b4a.run/api/products/${selectedProduct._id}`, formData);
      setProducts(products.map((product) => 
        product._id === selectedProduct._id ? { ...product, ...formData } : product
      ));
      handleCloseDialog();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: isMobile ? 0 : 1, minWidth: 150 },
    { field: 'productId', headerName: 'Product ID', flex: isMobile ? 0 : 1, minWidth: 120 },
    { field: 'category', headerName: 'Category', flex: isMobile ? 0 : 1, minWidth: 150 },
    { field: 'price', headerName: 'Price', flex: isMobile ? 0 : 1, minWidth: 100 },
    { field: 'stockQuantity', headerName: 'Stock Quantity', flex: isMobile ? 0 : 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: isMobile ? 0 : 1,
      minWidth: 150,
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
      <Header title="Product List" subtitle="Manage your product inventory" />
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
          overflowX: 'auto', // Enable horizontal scroll for mobile
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={isMobile ? 5 : 10} 
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Update Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Product ID"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
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

      <ToastContainer />
    </Box>
  );
};

export default ProductList;
