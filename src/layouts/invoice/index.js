import { useState } from "react";
import { Buffer } from "buffer";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Alert, Modal, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Customized Component
import Project from "./components/Project";

// Services
import GoogleDocAIService from "services/google-doc-ai.service";

const useStyles = makeStyles({
  uploadBtn: {
    float: "right",
    textTransform: "capitalize"
  },
  mdInputFile: {
    visibility: "hidden",
    height: 0,
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  px: 4,
  pb: 3,
  background: "transparent",
  border: 0,
  textAlign: "center",
};

function Invoice() {
  const classes = useStyles();

  const columns = [
    { Header: "no", accessor: "id", align: "center" },
    { Header: "invoice", accessor: "invoice", width: "60%", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "detail", accessor: "action", align: "center" },
  ];

  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [detail, setDetail] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [snackbar, setSnackbar] = useState(false);

  const onClickUpload = async () => {
    setRows([]);
    setProgress(0);
    setMetadata([]);
    setDetail(false);
    setSelectedIndex(-1);

    const out = [];
    const dirHandle = await window.showDirectoryPicker();
    await handleDirectoryEntry(dirHandle, out);

    setInProgress(true);

    let pRows = [];
    let pMetadata = [];

    for (let i = 1; i <= out.length; i++) {
      var formData = new FormData();
      formData.append("filename", out[i - 1].name);

      const arrayBuffer = await out[i - 1].arrayBuffer();
      const encodedPdf = Buffer.from(arrayBuffer).toString("base64");
      formData.append("invoice", encodedPdf);

      const result = await axios.post("http://localhost:3001/api/invoice/upload", formData);

      // const result = await GoogleDocAIService.getMetadata(out[i - 1]);

      pRows.push({
        id: i,
        invoice: <Project name={out[i - 1].name} />,
        status: (
          <MDTypography component="span" variant="caption" color="success" fontWeight="medium">
            Analyzed
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            onClick={() => onClickDetail(i - 1)}
            color="text"
            style={{ cursor: "pointer" }}
          >
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      });
      pMetadata.push(result.data);

      setRows(pRows);
      setProgress(Math.floor((i / out.length) * 100));
    }

    setMetadata(pMetadata);
    setInProgress(false);
  };

  const onClickCreateJsonl = async () => {
    setSnackbar(false);

    const resp = await axios.post("http://localhost:3001/api/invoice/create_jsonl", {
      metadata: metadata,
    });

    if (resp.status == 200 && resp.data.success) {
      setSnackbar(true);
    }
  };

  const handleDirectoryEntry = async (dirHandle, out) => {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();
        out.push(file);
      }
      /*
      if (entry.kind === "directory") {
        const newHandle = await dirHandle.getDirectoryHandle(entry.name, { create: false });
        const newOut = (out[entry.name] = {});
        await handleDirectoryEntry(newHandle, newOut);
      }
      */
    }
  };

  const onClickDetail = (index) => {
    setDetail(true);
    setSelectedIndex(index);
  };

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
                  Invoices Table
                  <MDButton
                    variant="gradient"
                    color="primary"
                    size="small"
                    className={classes.uploadBtn}
                    onClick={onClickUpload}
                  >
                    <Icon>upload</Icon>&nbsp; Upload
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="warning"
                    size="small"
                    className={classes.uploadBtn}
                    onClick={onClickCreateJsonl}
                    style={{ marginRight: 10 }}
                    disabled={metadata.length == 0 ? true : false}
                  >
                    <Icon>create</Icon>&nbsp; Create JSONL
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
                    No Invoices
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

      <Modal open={detail} onClose={() => setDetail(false)}>
        <MDBox sx={{ ...style, width: 600 }}>
          <MDTypography variant="h4" textAlign="center" pt={1} pb={1}>
            Detail Information
          </MDTypography>
          {selectedIndex == -1 ? (
            <></>
          ) : (
            Object.keys(metadata[selectedIndex]).map((key) => {
              return (
                <MDTypography variant="h6" textAlign="left" pt={1} pb={1} key={key}>
                  <label className="capitalize">{key.replace("_", " ")}</label> :{" "}
                  {metadata[selectedIndex][key]}
                </MDTypography>
              );
            })
          )}
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
}

export default Invoice;
