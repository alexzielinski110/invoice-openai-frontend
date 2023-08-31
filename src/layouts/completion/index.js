import { Card, CircularProgress, Grid, Modal } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
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

const Completion = () => {
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState("");

  const onKeyPressEvent = (event) => {
    if (event.charCode == 13) {
      getModeration(event.target.value);
    }
  };

  const getModeration = async (prompt) => {
    setLoading(true);

    const resp = await axios.post(`http://localhost:3001/api/completion`, {
      prompt: prompt,
    });
    setCompletion(resp.data[0].text.trim());

    setLoading(false);
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
                  Completion
                </MDTypography>
              </MDBox>
              <MDBox mx={2} mt={2} py={3} px={2}>
                <MDInput
                  label="Type the prompt..."
                  style={{ width: "100%" }}
                  onKeyPress={onKeyPressEvent}
                />
                {completion.length == 0 ? (
                  <MDTypography variant="h4" textAlign="center" color="text" mt={2}>
                    No Completion
                  </MDTypography>
                ) : (
                  <MDTypography variant="h6" color="text" mt={2}>
                    { completion }
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

export default Completion;
