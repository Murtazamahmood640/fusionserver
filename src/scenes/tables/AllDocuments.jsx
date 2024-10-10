import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SearchIcon from "@mui/icons-material/Search";

const AllDoc = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    setFilteredDocuments(
      documents.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("https://hrserver1-8yj51ajr.b4a.run/api/documents");
      if (response && response.data) {
        setDocuments(response.data);
      } else {
        throw new Error("No data found");
      }
    } catch (error) {
      toast.error("Failed to fetch documents: " + error.message);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const response = await axios.delete(
        `https://hrserver1-8yj51ajr.b4a.run/api/documents/${id}`
      );
      if (response.status === 204) {
        setDocuments(documents.filter((doc) => doc._id !== id));
        toast.success("Document deleted successfully!");
      }
    } catch (error) {
      toast.error(
        "Failed to delete document: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <Box m="20px">
      <Header title="View Documents" subtitle="All documents" />

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          label="Search Documents"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Documents Grid */}
      <Grid container spacing={3}>
        {filteredDocuments.map((doc) => (
          <Grid item xs={12} sm={6} md={3} key={doc._id}>
            <Card
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.main // Keep the current color for dark mode
                    : colors.grey[900], // Light greyish color for light mode
                color: colors.grey[100],
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <InsertDriveFileIcon
                  sx={{ fontSize: "64px", color: colors.grey[200] }}
                />
                <Typography variant="h6" mt={2} mb={1} fontWeight="bold">
                  {doc.filename}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                  Sent By: {doc.sentBy}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                  Date: {new Date(doc.dated).toLocaleDateString()}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="space-between" padding={2}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => window.open(doc.path, "_blank")}
                  sx={{
                    backgroundColor: theme.palette.secondary.main, // Set the background color
                    color: theme.palette.secondary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main, // Remove hover color change by setting it to the same background color
                    },
                  }}
                >
                  Download
                </Button>

                <Tooltip title="Delete Document" arrow>
                  <IconButton
                    color="error"
                    onClick={() => deleteDocument(doc._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default AllDoc;
