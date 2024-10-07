import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Select,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const AddInvoice = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [formValues, setFormValues] = useState({
    client: "",
    invoiceNumber: "",
    invoiceDate: new Date(),
    dueDate: new Date(),
    products: [],
    totalAmount: 0,
  });

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("https://hrserver1-8yj51ajr.b4a.run/api/clients");
      if (Array.isArray(response.data)) {
        const clientNames = response.data.map((client) => ({
          name: client.clientName,
          id: client._id,
        }));
        setClients(clientNames);
      } else {
        toast.error("Unexpected data format for clients");
      }
    } catch (error) {
      toast.error("Error fetching clients");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://hrserver1-8yj51ajr.b4a.run/api/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        console.log("Fetched products:", response.data); // Debugging: Log fetched products
      } else {
        toast.error("Unexpected data format for products");
      }
    } catch (error) {
      toast.error("Error fetching products");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const addProduct = () => {
    setFormValues((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: "",
          quantity: 1,
          tax: 0,
          discount: 0,
        },
      ],
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = [...formValues.products];
    updatedProducts.splice(index, 1);
    setFormValues({ ...formValues, products: updatedProducts });
  };

  const handleProductChange = (index, name, value) => {
    const updatedProducts = [...formValues.products];

    if (name === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          product: value,
          unitPrice: selectedProduct.price, // Set unit price from the selected product's price
        };
        console.log("Selected product with price:", selectedProduct); // Debugging: Check selected product
      }
    } else {
      updatedProducts[index] = { ...updatedProducts[index], [name]: value };
    }

    setFormValues({ ...formValues, products: updatedProducts });
    console.log("Updated products with unitPrice:", updatedProducts); // Check if unitPrice is correctly set
  };

  const submitInvoice = async () => {
    const totalAmount = calculateTotal(formValues.products);
    const dataToSubmit = { ...formValues, totalAmount };

    console.log("Submitting invoice with values:", dataToSubmit);

    try {
      const response = await axios.post(
        "https://hrserver1-8yj51ajr.b4a.run/api/invoices",
        dataToSubmit
      );
      console.log("API Response:", response.data);
      toast.success("Invoice created successfully");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error creating invoice");
    }
  };

  const calculateProductPrice = (product) => {
    const unitPrice = product.unitPrice || 0; // Fallback to 0 if unitPrice is not set
    const basePrice = product.quantity * unitPrice;
    const taxAmount = (product.tax / 100) * basePrice || 0;
    const discountAmount = (product.discount / 100) * basePrice || 0;

    const finalPrice = basePrice + taxAmount - discountAmount;
    console.log("Base Price:", basePrice, "Final Price:", finalPrice); // Debugging final price
    return { basePrice, taxAmount, discountAmount, finalPrice };
  };

  const calculateTotal = (productList) => {
    return productList.reduce((total, product) => {
      const { finalPrice } = calculateProductPrice(product);
      return total + finalPrice;
    }, 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m="20px" sx={{ pb: "40px" }}>
        <Header title="CREATE INVOICE" subtitle="Create a New Invoice" />
        <Box>
          <FormControl
            fullWidth
            variant="filled"
            sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}
          >
            <InputLabel>Client</InputLabel>
            <Select
              name="client"
              value={formValues.client}
              onChange={handleInputChange}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a client for the invoice</FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            variant="filled"
            label="Invoice Number"
            name="invoiceNumber"
            value={formValues.invoiceNumber}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <DatePicker
              label="Invoice Date"
              value={formValues.invoiceDate}
              onChange={(newValue) =>
                handleDateChange("invoiceDate", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} variant="filled" fullWidth />
              )}
            />
            <DatePicker
              label="Due Date"
              value={formValues.dueDate}
              onChange={(newValue) => handleDateChange("dueDate", newValue)}
              renderInput={(params) => (
                <TextField {...params} variant="filled" fullWidth />
              )}
            />
          </Box>

          {formValues.products.map((product, index) => {
            const { basePrice, taxAmount, discountAmount, finalPrice } =
              calculateProductPrice(product);

            return (
              <Grid
                container
                key={index}
                spacing={2}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Grid item xs={2}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Product</InputLabel>
                    <Select
                      name={`product-${index}`}
                      value={product.product}
                      onChange={(e) =>
                        handleProductChange(index, "product", e.target.value)
                      }
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.productName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={1}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Quantity"
                    name={`quantity-${index}`}
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Tax (%)"
                    name={`tax-${index}`}
                    type="number"
                    value={product.tax}
                    onChange={(e) =>
                      handleProductChange(index, "tax", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Discount (%)"
                    name={`discount-${index}`}
                    type="number"
                    value={product.discount}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "discount",
                        e.target.value
                      )
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <Typography variant="body2">
                    Base Price: ${basePrice.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Tax: +${taxAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Discount: -${discountAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Final Price: ${finalPrice.toFixed(2)}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeProduct(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            );
          })}

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={addProduct}
            sx={{ mt: 2 }}
          >
            Add Product
          </Button>

          <TextField
            fullWidth
            variant="filled"
            label="Total Amount"
            value={calculateTotal(formValues.products).toFixed(2)}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="secondary" onClick={submitInvoice}>
              Save Invoice
            </Button>
          </Box>
        </Box>
        <ToastContainer />
      </Box>
    </LocalizationProvider>
  );
};

export default AddInvoice;
