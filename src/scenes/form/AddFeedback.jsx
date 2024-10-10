import React from 'react';
import axios from 'axios';
import { Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";

const initialValues = {
  subject: '',
  feedback: '',
};

const feedbackSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  feedback: yup.string().min(10, 'Feedback must be at least 10 characters long').required('Required'),
});

const AddFeedback = () => {

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post('https://hrserver1-8yj51ajr.b4a.run/api/feedback', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert('Feedback submitted successfully, thanks for your suggestion.');
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px" sx={{ pb: "40px" }}>
      <Header title="SUBMIT FEEDBACK" subtitle="Please provide your feedback" />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={feedbackSchema}
      >
        {({ errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px">
              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                type="text"
                label="Subject"
                onBlur={handleBlur}
                onChange={handleChange}
                name="subject"
                error={!!touched.subject && !!errors.subject}
                helperText={touched.subject && errors.subject}
              />
              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                type="text"
                label="Feedback"
                onBlur={handleBlur}
                onChange={handleChange}
                name="feedback"
                error={!!touched.feedback && !!errors.feedback}
                helperText={touched.feedback && errors.feedback}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                Submit Feedback
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddFeedback;
