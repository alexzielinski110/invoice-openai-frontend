import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import iconJson from "assets/images/small-logos/icon-json.svg";

const Project = ({ name }) => {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <a
        href={`http://localhost:3001/jsonl/${name}`}
        target="_blank"
        style={{ display: "contents", cursor: "pointer" }}
      >
        <MDAvatar src={iconJson} size="sm" variant="rounded" />
        <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
          {name}
        </MDTypography>
      </a>
    </MDBox>
  );
};

export default Project;
