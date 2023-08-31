import { Card, CircularProgress, Grid, Icon, Modal } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
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

const FineTune = () => {
  const columns = [
    { Header: "no", accessor: "id", align: "center" },
    { Header: "fine tune", accessor: "fine_tune", width: "70%", align: "left" },
    { Header: "created at", accessor: "created_at", align: "left" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const loadFineTunes = async () => {
    setLoading(true);

    const resp = await axios.get(`http://localhost:3001/api/fine-tunes`);
    const { data } = resp;

    let pRows = [];

    for (let i = 0; i < data.length; i++) {
      const dt = new Date(data[i].created_at * 1000);
      pRows.push({
        id: i + 1,
        fine_tune: <Project name={data[i].fine_tuned_model} />,
        created_at: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString(),
        action: (
          <MDTypography component="a" color="text" onClick={() => onDeleteFineTune(data[i].id)}>
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      });
    }

    setRows(pRows);
    setLoading(false);
  };

  const onDeleteFineTune = async (id) => {
    setLoading(true);

    const resp = await axios.delete(`http://localhost:3001/api/fine-tunes/${id}`);
    if (resp.status == 200 && resp.data.success) {
      setLoading(false);
      loadFineTunes();
    }
  };

  const onModeration = async () => {
    await axios.post(`http://localhost:3001/api/fine-tunes/moderations`);
  }

  useEffect(() => {
    loadFineTunes();
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
                  Fine-tunes Table
                  <MDButton
                    variant="gradient"
                    color="primary"
                    size="small"
                    style={{ float: "right", textTransform: "capitalize" }}
                    onClick={onModeration}
                  >
                    <Icon>create</Icon>&nbsp; Moderation
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
                    No Fine-tunes
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      <Modal open={loading}>
        <MDBox sx={{ ...style, width: 400 }}>
          <CircularProgress />
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
};

export default FineTune;
