import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import Button from "../../../Components/UI/Button/Button";
import "./style.scss";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import { getAllRoles } from "../../../Services/api";

const Role = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [Roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const handleRoleSelect = (roleId) => {
    if (selectedRoleId === roleId) {
      setSelectedRoleId(""); // Deselect if the same role is clicked
    } else {
      setSelectedRoleId(roleId); // Select the new role
      setError("");
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      setLoading(true);
      try {
        const data = await getAllRoles();
        setRoles(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getRoles();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRoleId) {
      setError("Please select a role.");
      return;
    }
    console.log(selectedRoleId);
    

    // Navigate to SignUp page with the selected role ID
    navigate("/SignUp", { state: { roleId: selectedRoleId } });
  };

  return (
    <div className="Role effect">
      {isLoading ? (
        <div className="loader flex justify-center items-center  m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <AuthHeader />
          <div className="Wrapper flex flex-col justify-center">
            <div className="flex items-start justify-center flex-col mt-16">
              <h3 className="font-inter font-bold text-5xl leading-[50px] max-w-[745px] text-purple-dark">
                {t("What kind of customer are you?")}
              </h3>
              <p className="font-inter font-light text-xl leading-8 max-w-[600px]">
                {t(
                  "Select from the following options to be directed to the appropriate page"
                )}
              </p>
            </div>
            <div className="Buttons flex justify-center items-center gap-32 my-10">
              {Roles.map((role) => (
                <button
                  key={role._id}
                  className={`RoleBtn ${role.name.toLowerCase()} ${
                    selectedRoleId === role._id ? "selected" : ""
                  }`}
                  onClick={() => handleRoleSelect(role._id)}
                  disabled={selectedRoleId && selectedRoleId !== role._id}
                >
                  {role.name}
                </button>
              ))}
            </div>
            {error && (
              <div className="text-center text-red">
                <p>{error}</p>
              </div>
            )}
            <div className="Next flex items-center justify-center mt-5">
              <Button onClick={handleSubmit} disabled={!selectedRoleId}>
                {t("Next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Role;
