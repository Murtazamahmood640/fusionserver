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
        const index = formData.education.findIndex(
          (edu) => edu.institution === selectedItem.institution
        );
        updatedData.education[index] = selectedItem;
      }
    } else if (editType === "experience") {
      if (isNewRecord) {
        updatedData.experience.push(selectedItem);
      } else {
        const index = formData.experience.findIndex(
          (exp) => exp.company === selectedItem.company
        );
        updatedData.experience[index] = selectedItem;
      }
    } else if (editType === "personal") {
      updatedData = { ...updatedData, ...selectedItem };
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

  return (
    <Box className="dashboard-container">
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
                  <Typography variant="body1" ml={2}>Birthday: {formData.birthday}</Typography>
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
                  <Typography>No education details available.</Typography>
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
                      <Typography variant="body1" ml={2}>{exp.role} at {exp.company} ({exp.years})</Typography>
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
                  <Typography>No experience details available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Social Links Card */}
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
                <Typography variant="h5" mb={2}>Social Links</Typography>
                <Box className="profile-info">
                  <LinkedInIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>LinkedIn: {formData.linkedinId}</Typography>
                </Box>
                <Box className="profile-info">
                  <TwitterIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Twitter: {formData.twitter}</Typography>
                </Box>
                <Box className="profile-info">
                  <FacebookIcon color={isDarkTheme ? "secondary" : "primary"} />
                  <Typography variant="body1" ml={2}>Facebook: {formData.facebook}</Typography>
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
        </Grid>
      </Box>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isNewRecord ? `Add New ${editType.charAt(0).toUpperCase() + editType.slice(1)}` : `Edit ${editType.charAt(0).toUpperCase() + editType.slice(1)}`}</DialogTitle>
        <DialogContent>
          {editType === "education" || editType === "experience" ? (
            <>
              <TextField
                label="Institution/Company"
                name="institution"
                fullWidth
                margin="dense"
                value={selectedItem?.institution || selectedItem?.company || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Degree/Role"
                name="degree"
                fullWidth
                margin="dense"
                value={selectedItem?.degree || selectedItem?.role || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Year/Years"
                name="year"
                fullWidth
                margin="dense"
                value={selectedItem?.year || selectedItem?.years || ""}
                onChange={handleFormChange}
              />
            </>
          ) : (
            <>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="dense"
                value={selectedItem?.name || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="dense"
                value={selectedItem?.email || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                margin="dense"
                value={selectedItem?.phoneNumber || ""}
                onChange={handleFormChange}
              />
              <TextField
                label="Birthday"
                name="birthday"
                type="date"
                fullWidth
                margin="dense"
                value={selectedItem?.birthday || ""}
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <ToastContainer />
    </Box>
  );
};

export default Dashboard;
