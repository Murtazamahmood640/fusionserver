import React from 'react';
import {
  Box,
  Button,
  TextField,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';

const AddStakeholder = () => {
  const validationSchema = yup.object().shape({
    clientName: yup.string().required('Client Name is required').matches(/^[a-zA-Z\s]+$/, 'Client Name must be alphabetic'),
    contactPerson: yup.string().required('Contact Person is required').matches(/^[a-zA-Z\s]+$/, 'Contact Person must be alphabetic'),
    contactInfo: yup.string().required('Contact Information is required'),
    company: yup.string().matches(/^[a-zA-Z\s]*$/, 'Company Name must be alphabetic').optional(),
    notes: yup.string().optional(),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log('Submitting form with values:', values);

    try {
      console.log('Form submission started');
      const response = await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/stakeholders', values);
      console.log('Form submitted successfully:', response.data);
      toast.success('Stakeholder added successfully');
      resetForm();
    } catch (error) {
      console.error('Error adding stakeholder:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Error adding stakeholder');
    }
  };
  
  const initialValues = {
    clientName: '',
    contactPerson: '',
    contactInfo: '',
    company: '',
    notes: '',
  };

  return (
    <Box m="20px" sx={{ pb: "40px" }}>
      <Header title="ADD STAKEHOLDER" subtitle="Add a New Stakeholder" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                label="Client Name"
                name="clientName"
                value={values.clientName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.clientName && !!errors.clientName}
                helperText={touched.clientName && errors.clientName}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Contact Person"
                name="contactPerson"
                value={values.contactPerson}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contactPerson && !!errors.contactPerson}
                helperText={touched.contactPerson && errors.contactPerson}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Contact Information"
                name="contactInfo"
                value={values.contactInfo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contactInfo && !!errors.contactInfo}
                helperText={touched.contactInfo && errors.contactInfo}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Company Name"
                name="company"
                value={values.company}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.company && !!errors.company}
                helperText={touched.company && errors.company}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                label="Notes/Comments"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.notes && !!errors.notes}
                helperText={touched.notes && errors.notes}
                sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ gridColumn: 'span 12' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Stakeholder'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default AddStakeholder;
