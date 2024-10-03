import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles"; // To support dark/light theme
import './styles.css';  // Custom CSS file for styling

const Dashboard = () => {
  const theme = useTheme(); // Access the current theme (dark or light)
  const isDarkTheme = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    linkedinId: "",
    twitter: "",
    facebook: "",
    education: [],
    experience: [],
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editType, setEditType] = useState("");  // "education", "experience", "personal"
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // Fetch profile data
    fetchProfileData(userId);
  }, []);

  const fetchProfileData = (userId) => {
    axios
      .get(`https://hrserver1-8yj51ajr.b4a.run/api/users/user/${userId}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Error fetching profile", err));
  };

  const handleDialogOpen = (item, type, newRecord = false) => {
    setSelectedItem(item || {});
    setEditType(type);
    setIsNewRecord(newRecord);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setEditType("");
    setIsNewRecord(false);
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem({ ...selectedItem, [name]: value });
  };

  const handleUpdate = () => {
    let updatedData = { ...formData };

    if (editType === "education") {
        if (isNewRecord) {
            updatedData.education.push(selectedItem);
        } else {
            const index = updatedData.education.findIndex(
                (edu) => edu.institution === selectedItem.institution
            );
            updatedData.education[index] = selectedItem;
        }
    } else if (editType === "experience") {
        if (isNewRecord) {
            updatedData.experience.push(selectedItem);
        } else {
            const index = updatedData.experience.findIndex(
                (exp) => exp.company === selectedItem.company
            );
            updatedData.experience[index] = selectedItem;
        }
    } else if (editType === "personal") {
        updatedData = { ...updatedData, ...selectedItem };
    } else if (editType === "social") {
        // Update social links
        updatedData = {
            ...updatedData,
            linkedinId: selectedItem.linkedinId,
            twitter: selectedItem.twitter,
            facebook: selectedItem.facebook,
        };
    }

    // Send the updated profile data to the server
    updateProfileData(updatedData);
    setOpenDialog(false);
};


  const updateProfileData = (updatedData) => {
    const userId = localStorage.getItem("userId");

    axios
      .put(`https://hrserver1-8yj51ajr.b4a.run/api/users/user/${userId}`, updatedData)
      .then(() => {
        setFormData(updatedData); // Update the frontend state
        toast.success("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile", err);
        toast.error("Failed to update profile");
      });
  };

  const handleDelete = (item, type) => {
    let updatedData = { ...formData };

    if (type === "education") {
      updatedData.education = updatedData.education.filter(
        (edu) => edu.institution !== item.institution
      );
    } else if (type === "experience") {
      updatedData.experience = updatedData.experience.filter(
        (exp) => exp.company !== item.company
      );
    }

    // Send the updated profile data to the server
    updateProfileData(updatedData);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} record deleted successfully!`);
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0][0];
    return initials.toUpperCase();
  };
// Utility function to format the birthday
const formatDate = (dateString) => {
  // Check if the dateString is valid before creating a Date object
  if (!dateString) return "Date not available";

  const date = new Date(dateString);
  
  // If the date is invalid, return a default message
  if (isNaN(date)) return "Invalid Date";

  return date.toISOString().split('T')[0]; // Returns format as YYYY-MM-DD
};

  return (
    <Box className="dashboard-container">
      <ToastContainer />
      {/* Banner Section */}
      <Box className="profile-banner">
        <Box className="overlay"></Box> {/* Overlay for the banner */}
        <Box className="banner-content">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              backgroundColor: isDarkTheme ? "grey.800" : "primary.main",
              color: isDarkTheme ? "grey.100" : "common.white",
            }}
          >
            {getInitials(formData.name || "User Name")}
          </Avatar>
          <Typography variant="h3" className="welcome-text">
            Hello, {formData.name}!
          </Typography>
        </Box>
      </Box>

      {/* Profile Information Section */}
      <Box mt={4} p={2}>
        <Typography variant="h4" align="center" mb={3}>
          Profile Details
        </Typography>
        <Grid container spacing={4}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={6}>
            <Card
              className={`profile-card same-height ${isDarkTheme ? "dark-mode" : ""}`}
              elevation={3}
              sx={{
                backgroundColor: isDarkTheme ? theme.palette.primary.main : theme.palette.background.paper,
                color: isDarkTheme ? theme.palette.primary.contrastText : theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Typography variant="h5" mb={2}>Personal Information</Typography>
                <Box className="profile-info">
                  <EmailIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Email: {formData.email}</Typography>
                </Box>
                <Box className="profile-info">
                  <PhoneIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Phone: {formData.phoneNumber}</Typography>
                </Box>
                <Box className="profile-info">
                  <CakeIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1">Birthday: {formatDate(formData.birthday)}</Typography> {/* Display formatted birthday */}
                </Box>
                <IconButton
                  color={isDarkTheme ? "secondary" : "primary"}
                  onClick={() => handleDialogOpen(formData, "personal")}
                >
                  <EditIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>

          {/* Education Card */}
          <Grid item xs={12} md={6}>
            <Card
              className={`profile-card same-height ${isDarkTheme ? "dark-mode" : ""}`}
              elevation={3}
              sx={{
                backgroundColor: isDarkTheme ? theme.palette.primary.main : theme.palette.background.paper,
                color: isDarkTheme ? theme.palette.primary.contrastText : theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" mb={2}>Education</Typography>
                  <IconButton
                    color={isDarkTheme ? "secondary" : "primary"}
                    onClick={() => handleDialogOpen(null, "education", true)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {formData.education.length > 0 ? (
                  formData.education.map((edu, index) => (
                    <Box key={index} className="profile-info">
                      <SchoolIcon color={isDarkTheme ? "secondary" : "primary"} />
                      <Typography variant="body1" ml={2}>{edu.degree} from {edu.institution}, {edu.year}</Typography>
                      <IconButton
                        color={isDarkTheme ? "secondary" : "primary"}
                        onClick={() => handleDialogOpen(edu, "education")}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(edu, "education")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" ml={2}>No education records available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Experience Card */}
          <Grid item xs={12} md={6}>
            <Card
              className={`profile-card same-height ${isDarkTheme ? "dark-mode" : ""}`}
              elevation={3}
              sx={{
                backgroundColor: isDarkTheme ? theme.palette.primary.main : theme.palette.background.paper,
                color: isDarkTheme ? theme.palette.primary.contrastText : theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" mb={2}>Experience</Typography>
                  <IconButton
                    color={isDarkTheme ? "secondary" : "primary"}
                    onClick={() => handleDialogOpen(null, "experience", true)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {formData.experience.length > 0 ? (
                  formData.experience.map((exp, index) => (
                    <Box key={index} className="profile-info">
                      <BusinessIcon color={isDarkTheme ? "secondary" : "primary"} />
                      <Typography variant="body1" ml={2}>{exp.role} at {exp.company}, {exp.duration}</Typography>
                      <IconButton
                        color={isDarkTheme ? "secondary" : "primary"}
                        onClick={() => handleDialogOpen(exp, "experience")}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(exp, "experience")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" ml={2}>No experience records available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

         {/* Social Links Card with Edit Functionality */}
         <Grid item xs={12} md={6}>
            <Card
              className={`profile-card same-height ${isDarkTheme ? "dark-mode" : ""}`}
              elevation={3}
              sx={{
                backgroundColor: isDarkTheme ? theme.palette.primary.main : theme.palette.background.paper,
                color: isDarkTheme ? theme.palette.primary.contrastText : theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" mb={2}>Social Links</Typography>
                  <IconButton
                    color={isDarkTheme ? "secondary" : "primary"}
                    onClick={() => handleDialogOpen(formData, "social")}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Box className="profile-info">
                  <LinkedInIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>LinkedIn: {formData.linkedinId || "Not provided"}</Typography>
                </Box>
                <Box className="profile-info">
                  <TwitterIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Twitter: {formData.twitter || "Not provided"}</Typography>
                </Box>
                <Box className="profile-info">
                  <FacebookIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Facebook: {formData.facebook || "Not provided"}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* Dialog for editing or adding new records */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isNewRecord ? "Add New" : "Edit"} {editType.charAt(0).toUpperCase() + editType.slice(1)}</DialogTitle>
        <DialogContent>
          {editType === "education" && (
            <>
              <TextField
                margin="dense"
                label="Institution"
                name="institution"
                value={selectedItem?.institution || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Degree"
                name="degree"
                value={selectedItem?.degree || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Year"
                name="year"
                value={selectedItem?.year || ""}
                onChange={handleFormChange}
                fullWidth
              />
            </>
          )}
          {editType === "experience" && (
            <>
              <TextField
                margin="dense"
                label="Company"
                name="company"
                value={selectedItem?.company || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Role"
                name="role"
                value={selectedItem?.role || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Duration"
                name="duration"
                value={selectedItem?.duration || ""}
                onChange={handleFormChange}
                fullWidth
              />
            </>
          )}
          {editType === "personal" && (
            <>
              <TextField
                margin="dense"
                label="Name"
                name="name"
                value={selectedItem?.name || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Phone Number"
                name="phoneNumber"
                value={selectedItem?.phoneNumber || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Birthday"
                name="birthday"
                value={selectedItem?.birthday || ""}
                onChange={handleFormChange}
                fullWidth
              />
            </>
          )}
            {editType === "social" && (
            <>
              <TextField
                margin="dense"
                label="LinkedIn"
                name="linkedinId"
                value={selectedItem?.linkedinId || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Twitter"
                name="twitter"
                value={selectedItem?.twitter || ""}
                onChange={handleFormChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Facebook"
                name="facebook"
                value={selectedItem?.facebook || ""}
                onChange={handleFormChange}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
