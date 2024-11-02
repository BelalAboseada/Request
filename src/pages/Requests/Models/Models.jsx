import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/images/Models.png";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import { getProjectDetails } from "../../../Services/api";
import Loader from "../../../Components/Loader/Loader";
import { t } from "i18next";

const Models = () => {
  const location = useLocation();
  const { projectId, taskType, members } = location.state || {};
  const [isReviewed, setIsReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProjectDetails(projectId);
        const project = data.results;

        setLinks([
          {
            label: "Approval of general documents",
            to: "/Requests/RequestForDocumentSubmittal",
            approved: project?.requestForDocumentSubmittalApproval,
          },
          {
            label: "Approval of schemes",
            to: "/request/",
            approved: project?.approvalOfSchemes,
          },
          {
            label: "Table of quantities",
            to: "/Requests/TableOfQuantities",
            approved: project?.tableOfQuantities,
          },
          {
            label: "Request for Approval Of Materials",
            to: "/Requests/RequestForMaterial",
            approved: project?.requestForApprovalOfMaterials,
          },
          {
            label: "Work request",
            to: "/Requests/WorkRequest",
            approved: project?.workRequest,
          },
          {
            label: "Material Inspection Form",
            to: "/Requests/RequestForInspection",
            approved: project?.requestForInspectionForm,
          },
        ]);

        console.log(links);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);
  const handleReviewChange = (e) => {
    setIsReviewed(e.target.checked);
  };
  if (loading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }
  return (
    <div className="Models z-50">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div className="wrapper flex justify-center items-center mt-32 relative">
          <div className="logo absolute -top-12 z-10">
            <img src={logo} alt="logo" className="w-20 h-20 md:w-28 md:h-28" />
          </div>
          <div className="content bg-white rounded-3xl relative w-full">
            <p className="text-center text-purple mt-14 font-medium md:font-semibold text-lg md:text-2xl">
              Complete the following forms to complete <br />
              your application for the project
            </p>

            <div className="links grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="link flex justify-between items-center bg-white shadow-lg rounded-xl px-2 py-3 my-1 mx-3"
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name={link.label}
                      id={index}
                      checked={link.approved}
                      onChange={() => handleReviewChange(index)}
                      className="appearance-none w-3 h-3 mt-2 mr-1 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
                    />
                    {link.approved ? (
                      <span className="font-medium text-base text-left text-gray-500">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        to={link.to}
                        state={
                          link.to === "/Requests/TableOfQuantities"
                            ? { projectId, members }
                            : { projectId }
                        }
                        className="font-medium text-base text-left"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                  <span>
                    <IoCheckmarkCircleOutline
                      className={`text-gray w-7 h-7 ${
                        link.approved ? "text-purple" : ""
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>
            <div className="review flex items-center gap-2 m-2">
              <input
                type="checkbox"
                name="review"
                id="review"
                onChange={handleReviewChange}
                className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
              />
              <label
                htmlFor="review"
                className="text-purple font-medium text-base underline select-none"
              >
                {t(
                  "Please review the following item(s) and return a copy with your Action code"
                )}
              </label>
            </div>
            <div className="send text-end my-5 mx-3">
              <Link to={`/ProjectDetails/${projectId}`} state={{ projectId }}>
                <Button type="submit" disabled={!isReviewed}>
                  {t("Send")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Models;
