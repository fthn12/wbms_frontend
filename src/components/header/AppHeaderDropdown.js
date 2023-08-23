import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { clearCredentials } from "../../slices/appSlice";
import { useSignoutMutation } from "../../slices/authApiSlice";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import { LinkContainer } from "react-router-bootstrap";
const AppHeaderDropdown = () => {
  const { userInfo } = useSelector((state) => state.app);
  const [signout] = useSignoutMutation();
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await signout().unwrap();
      Cookies.remove("accessToken", { expires: 60 });
      if (!res.status) {
        console.log(res.message);
        console.log(res.logs);

        toast.error(res.message);

        return;
      }

      dispatch(clearCredentials());
      toast.success(res.message);
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Avatar>
          <img
            src={`${path}${userInfo.profilePic}`}
            alt="Uploaded Preview"
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        </Avatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account
        </CDropdownHeader>

        <LinkContainer to="/profile">
          <CDropdownItem title={userInfo.name} id="username">
            <FaUserCircle className="me-2" />
            Profile
          </CDropdownItem>
        </LinkContainer>

        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleSignout}>
          <FaSignOutAlt className="me-2" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
