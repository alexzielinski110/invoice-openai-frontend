import { Alert, Card, CircularProgress, Grid, Icon, Modal, Snackbar } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import MDProgress from "components/MDProgress";
import Project from "./components/Project";

import { useEffect, useState } from "react";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  px: 4,
  pt: 3,
  pb: 3,
  background: "transparent",
  border: 0,
  textAlign: "center",
};

const Files = () => {
  const columns = [
    { Header: "no", accessor: "id", align: "center" },
    { Header: "files", accessor: "files", width: "90%", align: "left" },
    { Header: "created at", accessor: "created_at", align: "left" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(false);
  const [rows, setRows] = useState([]);
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    setLoading(true);

    const resp = await axios.get(`http://localhost:3001/api/files`);
    const { data } = resp;

    let pRows = [];

    for (let i = 0; i < data.length; i++) {
      const dt = new Date(data[i].created_at * 1000);
      pRows.push({
        id: i + 1,
        files: <Project name={data[i].id} />,
        created_at: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString(),
        action: (
          <MDTypography component="a" color="text" onClick={() => onDeleteFile(data[i].id)}>
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      });
    }

    setRows(pRows);
    setFiles(data);
    setLoading(false);
  };

  const onCreateFineTune = async () => {
    setInProgress(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const resp = await axios.post(`http://localhost:3001/api/fine-tunes`, {
        training_file: files[i].id
      });
      if (resp.status == 200 && resp.data.success) setProgress(Math.floor(((i + 1) / files.length) * 100));
    }

    setSnackbar(true);
    setInProgress(false);
  }

  const onDeleteFile = async (id) => {
    setLoading(true);

    const resp = await axios.delete(`http://localhost:3001/api/files/${id}`);
    if (resp.status == 200 && resp.data.success) {
      setLoading(false);
      loadFiles();
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Files Table
                  <MDButton
                    variant="gradient"
                    color="primary"
                    size="small"
                    style={{ float: "right", textTransform: "capitalize" }}
                    onClick={onCreateFineTune}
                  >
                    <Icon>create</Icon>&nbsp; Create Fine-tune
                  </MDButton>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {rows.length > 0 ? (
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted={false}
                    entriesPerPage={{
                      defaultValue: 5,
                      entries: [5, 10],
                    }}
                    showTotalEntries={false}
                    noEndBorder
                  />
                ) : (
                  <MDTypography variant="h6" textAlign="center" pb={3} color="text">
                    No Files
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      <Modal open={inProgress}>
        <MDBox sx={{ ...style, width: 400 }}>
          <MDProgress value={progress} variant="gradient" label />
        </MDBox>
      </Modal>

      <Modal open={loading}>
        <MDBox sx={{ ...style, width: 400 }}>
          <CircularProgress />
        </MDBox>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >
        <Alert onClose={() => setSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Successfully created!!!
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Files;
