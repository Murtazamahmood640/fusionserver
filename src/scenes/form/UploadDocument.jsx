import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doc = () => {
  const [filename, setFileName] = useState('');

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
  
      let formData = new FormData();
      formData.append('file', values.file); // The file to upload
      formData.append('upload_preset', 'fusionfiles'); // Use your preset name here
      formData.append('folder', 'documents'); // Specify the folder if needed
      formData.append('context', `documentName=${values.documentName}|sentBy=${values.sentby}|dated=${values.dated}|reason=${values.reason}`); // Contextual information
  
      const cloudName = 'dawlennc5'; // Replace this with your actual cloud name

      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Prepare data to send to your backend
      const documentData = {
        filename: res.data.original_filename, // Cloudinary will return the file name
        path: res.data.secure_url, // URL of the uploaded file
        sentBy: values.sentby,
        dated: values.dated,
        reason: values.reason,
      };

      // Send the document data to your backend API
      await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/documents', documentData); // Adjust your endpoint as necessary

      toast.success("File Uploaded Successfully!");
  
      resetForm();
      setFileName('');
    } catch (error) {
      const errorMessage = error.response 
        ? error.response.data 
        : error.message || "An unknown error occurred.";
      toast.error(`Failed to upload file: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box m="20px">
      <Header title="DOCUMENT INFORMATION" subtitle="Upload a new document" />
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                label="Document Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.documentName}
                name="documentName"
                error={touched.documentName && !!errors.documentName}
                helperText={touched.documentName && errors.documentName}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Sent By"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sentby}
                name="sentby"
                error={touched.sentby && !!errors.sentby}
                helperText={touched.sentby && errors.sentby}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Reason / Label"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reason}
                name="reason"
                error={touched.reason && !!errors.reason}
                helperText={touched.reason && errors.reason}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Dated"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dated}
                name="dated"
                error={touched.dated && !!errors.dated}
                helperText={touched.dated && errors.dated}
                sx={{ gridColumn: "span 6" }}
              />
              <input
                accept=".pdf,.png,.jpg,.jpeg"  // Allow both PDF and image uploads
                id="fileupload"
                type="file"
                style={{ display: 'none' }}
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("file", file);
                  setFileName(file ? file.name : '');
                }}
              />
              <label htmlFor="fileupload" className='custom-file-upload' style={{ gridColumn: "span 6" }}>
                <Button variant="contained" color="primary" component="span">
                  Upload File
                </Button>
              </label>
              <Box sx={{ gridColumn: "span 6" }}>
                {filename ? filename : "No file selected"}
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button 
                type="submit" 
                color="primary" 
                variant="contained" 
                disabled={isSubmitting || !values.file}
              >
                {isSubmitting ? "Uploading..." : "Upload File"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  documentName: yup.string().required("Document name is required"),
  sentby: yup.string().required("Sender's name is required"),
  reason: yup.string().required("Reason is required"),
  dated: yup.string().required("Date is required"),
  file: yup.mixed()
    .required("File is required")
    .test("fileType", "Unsupported File Format", value => {
      return value && (value.type === 'application/pdf' || 
                       value.type === 'image/jpeg' || 
                       value.type === 'image/png');
    }),
});

const initialValues = {
  documentName: "",
  sentby: "",
  reason: "",
  dated: "",
  file: null,
};

export default Doc;
