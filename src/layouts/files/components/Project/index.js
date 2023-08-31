import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import iconFile from "assets/images/small-logos/logo-atlassian.svg";

const Project = ({ name }) => {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={iconFile} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );
};

export default Project;
