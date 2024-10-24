import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Input from "../../../Components/UI/Input/Input";
import { MdCalendarToday } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoAddOutline, IoPrint } from "react-icons/io5";
import { FaCommentMedical } from "react-icons/fa6";
import { CircularProgress } from "@mui/joy";
import { CircularProgress as CircularProgressbar } from "@mui/material";

import { getProjectDetails } from "../../../Services/api";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { BiTask } from "react-icons/bi";
import { Box } from "@mui/material";
import avatar from "../../../assets/images/Avatar.jpg";
import Loader from "../../../Components/Loader/Loader";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(false);
  const [Project, setProject] = useState({});
  const [Owner, setOwner] = useState({});
  const [Contractor, setContractor] = useState([]);
  const location = useLocation();
  const { projectId } = location.state || {};

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const Project = await getProjectDetails(projectId);
        setProject(Project.results);
        setOwner(Project.results.owner);
        setContractor(Project.results.contractor[0]);
        console.log(Project);
        console.log(Project.results.owner);
        console.log(Project.results.contractor[0]);
      } catch (error) {
        console.error("Error fetching Project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const formatDate = (date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date");
      }
      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="ProjectDetails mx-1">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h1 className="title font-inter font-bold text-3xl text-black m-2">
              {t("ProjectDetails")}
            </h1>
            <Link
              to={`/Project/Tasks/${projectId}`}
              state={{ members: Project.members }}
            >
              <button
                className="bg-white  flex items-center gap-2"
                style={{
                  borderRadius: "18px",
                  padding: "9px 8px 9px 8px",
                  color: "#515151",
                }}
              >
                <span>
                  <BiTask className="w-8 h-8  text-red" />
                </span>
                <span className="underline underline-offset-2 font-jost text-base font-normal leading-6 ">
                  view all tasks
                </span>
              </button>
            </Link>
          </div>
          <div className="boxes grid grid-cols-3 gap-2 m-2 p-2">
            <div className="desc col-span-1 ">
              {/* <p className="font-inter font-bold text-base leading-5  m-2">
            Description
          </p> */}
              <div className="desc_content bg-purple text-white py-9 px-6 rounded-3xl  h-[140px] text-center">
                <p className="font-inter font-normal text-sm leading-6  ">
                  {Project.description}
                </p>
              </div>
            </div>
            <div className="fullBudget  col-span-1  h-[140px]  relative w-full  bg-white  p-6 rounded-3xl">
              <p
                className="font-inter font-bold text-2xl absolute top-4 ltr:left-4  rtl:right-4 col-span-1"
                style={{ color: "#81D4C2" }}
              >
                {t("fullBudget")}
              </p>
              <span className="font-inter font-bold text-xl absolute bottom-4 ltr:right-4  rtl:left-4 col-span-1">
                {Project.budget}
              </span>
            </div>
            <div className="Remaining col-span-1 h-[140px]  bg-white relative w-full   p-6 rounded-3xl">
              <p className="font-inter font-bold text-2xl text-purple absolute top-4 ltr:left-4  rtl:right-4 ">
                {t("Remaining")}
              </p>
              <span className="font-inter font-bold text-xl absolute bottom-4 ltr:right-4  rtl:left-4">
                {Project.remaining}
              </span>
            </div>
          </div>

          <div className="team flex items-center justify-between my-2 mx-3">
            <h5 className="Team font-bold text-2xl  ">Team</h5>
            <div className="avatars flex items-center  -space-x-1">
              {Project.team && Project.team.members.length > 0 ? (
                Project.team.members.map((member, index) => (
                  <div
                    key={index}
                    className="avatar-container w-10 h-10 ring-2 ring-white inline-block rounded-full overflow-hidden"
                    title={member.name}
                  >
                    <img
                      src={member.profilePic || avatar}
                      alt={`${member.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="mx-2">No Team Members</p>
              )}
              <button
                className="w-10 h-10 rounded-full  flex justify-center items-center"
                style={{
                  background: "#444D61",
                }}
              >
                <span>
                  <IoAddOutline className="w-6 h-6 text-white" />
                </span>
              </button>
            </div>
          </div>
          <div className="wrapper bg-white grid grid-cols-2 rounded-3xl m-2 ">
            <div className="box relative flex flex-col ">
              <div className="head flex items-center  justify-between  my-3 mx-4">
                <h5 className="font-bold  text-2xl ">{Project.name}</h5>
                <p className="font-semibold  text-sm">{"Architecture"}</p>
              </div>
              <div className="analytics_box rounded-md shadow-md p-8 flex flex-col gap-3  mt-4 mb-4 mx-4 ">
                <div className="progress_wrapper  flex items-center justify-between rounded-2xl shadow-md p-8 relative">
                  <div className="Progress">
                    <span className="absolute top-1 font-inter font-extrabold text-xs leading-4 my-1 ">
                      Progress
                    </span>
                    <CircularProgress
                      className="!text-black font-poppins font-normal text-4xl"
                      determinate
                      sx={{
                        "--CircularProgress-size": "180px",
                        "--CircularProgress-trackThickness": "30px",
                        "--CircularProgress-progressThickness": "30px",
                        "--CircularProgress-animationDuration": "1s",
                        "--CircularProgress-trackColor": "#F5F5F5",
                        "--CircularProgress-progressColor": "var(--purple)",
                        "--CircularProgress-trackShadowColor":
                          "rgba(0, 0, 0, 0.12)",
                        "--CircularProgress-progressShadowColor":
                          "rgba(0, 0, 0, 0.12)",
                        "--CircularProgress-trackBorderRadius": "50%",
                        "--CircularProgress-progressBorderRadius": "50%",
                        "--CircularProgress-trackShadowBlur": "10px",
                        "--CircularProgress-progressShadowBlur": "10px",
                        "--CircularProgress-progressShadowOffset": "0px 2px",
                      }}
                      value={70}
                      variant="solid"
                    >
                      70%
                    </CircularProgress>
                  </div>

                  <div className="tags relative">
                    <span className="absolute -top-5 font-inter font-extrabold text-xs leading-4 my-1 ">
                      tags
                    </span>
                    <Box position="relative" display="inline-flex">
                      {/* Green Progress Circle */}
                      <CircularProgressbar
                        variant="determinate"
                        value={100}
                        sx={{
                          color: "var(--green)",
                          "--CircularProgress-size": "180px",
                          "--CircularProgress-trackThickness": "30px",
                          "--CircularProgress-progressThickness": "30px",
                        }}
                        size={180}
                        thickness={6}
                      />
                      <Box
                        position="absolute"
                        top="30%"
                        left="4%"
                        transform="translate(-50%, -50%)"
                        color="white"
                        fontSize="14px"
                      >
                        50
                      </Box>

                      {/* Purple Progress Circle */}
                      <CircularProgressbar
                        variant="determinate"
                        value={70}
                        sx={{
                          color: "var(--purple)",
                          position: "absolute",
                          left: 0,
                          "--CircularProgress-size": "180px",
                          "--CircularProgress-trackThickness": "30px",
                          "--CircularProgress-progressThickness": "30px",
                        }}
                        size={180}
                        thickness={6}
                      />
                      <Box
                        position="absolute"
                        bottom="5%"
                        left="30%"
                        transform="translate(-50%, -50%)"
                        color="white"
                        fontSize="14px"
                      >
                        70
                      </Box>

                      {/* Red Progress Circle */}
                      <CircularProgressbar
                        variant="determinate"
                        value={40}
                        sx={{
                          color: "var(--red)",
                          position: "absolute",
                          left: 0,
                          "--CircularProgress-size": "180px",
                          "--CircularProgress-trackThickness": "30px",
                          "--CircularProgress-progressThickness": "30px",
                        }}
                        size={180}
                        thickness={6}
                      />
                      <Box
                        position="absolute"
                        top="50%"
                        right="3px"
                        transform="translate(-50%, -50%)"
                        color="white"
                        fontSize="14px"
                      >
                        40
                      </Box>

                      {/* Yellow Progress Circle */}
                      <CircularProgressbar
                        variant="determinate"
                        value={20}
                        sx={{
                          color: "var(--yellow)",
                          position: "absolute",
                          left: 0,
                          "--CircularProgress-size": "180px",
                          "--CircularProgress-trackThickness": "30px",
                          "--CircularProgress-progressThickness": "30px",
                        }}
                        size={180}
                        thickness={6}
                      />
                      <Box
                        position="absolute"
                        top="10%"
                        right="20%"
                        transform="translate(-50%, -50%)"
                        color="white"
                        fontSize="14px"
                      >
                        20
                      </Box>
                    </Box>
                  </div>
                </div>
                <div className="Badges flex items-center  justify-around gap-2">
                  <span
                    className={`working w-full text-center py-2 rounded-3xl font-inter font-semibold text-sm mt-2`}
                  >
                    Work on it
                  </span>
                  <span
                    className={`high w-full text-center py-2 rounded-3xl font-inter font-semibold text-sm mt-2`}
                  >
                    High
                  </span>
                </div>
                {Project.tags && Project.tags.length > 0 && (
                  <div className="Tags flex flex-wrap gap-2">
                    {Project.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="tag-item flex items-center gap-1 px-3 py-1 rounded-full"
                      >
                        <span
                          className="w-4  h-4  rounded-sm"
                          style={{
                            backgroundColor: tag.colorCode || "#D3D3D3",
                          }}
                        />
                        <span className="text-black font-semibold text-xs">
                          {tag.name || "Unknown Tag"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form m-3 mr-24 ">
              <Input
                disabled
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("sDate")}
                placeholder={formatDate(Project.sDate)}
                inputIcons={{
                  element: <MdCalendarToday />,
                  type: "calendar",
                }}
                iconClass={"text-yellow"}
              />
              <Input
                disabled
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("dDate")}
                placeholder={formatDate(Project.dueDate)}
                inputIcons={{
                  element: <MdCalendarToday />,
                  type: "calendar",
                }}
                iconClass={"text-yellow"}
              />
              {Project.owner && (
                <Input
                  disabled
                  type={"name"}
                  required={true}
                  className="bg-white border border-purple border-solid "
                  label={t("owner")}
                  placeholder={Project.owner.name}
                />
              )}
              {Project.contractor && (
                <Input
                  disabled
                  type={"name"}
                  required={true}
                  className="bg-white border border-purple border-solid "
                  label={t("contractor")}
                  placeholder={Project.contractor.name || "belal"}
                />
              )}
              <Input
                disabled
                type={"name"}
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("location")}
                placeholder={"location"}
              />
              <div className="flex right-0 my-2 items-center justify-end">
                <button className="files flex items-center gap-1 mx-1">
                  <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
                    2
                  </span>
                  <FaFileLines className="text-purple-dark h-7 w-7 " />
                </button>

                <button className="addNote mx-1">
                  <span>
                    <FaCommentMedical
                      className="h-7 w-7 "
                      style={{ color: "#81D4C2" }}
                    />
                  </span>
                </button>
                <button className="print mx-1">
                  <span>
                    <IoPrint className="h-7 w-7 text-yellow" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
