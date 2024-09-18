import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Input from "../../../Components/UI/Input/Input";
import { MdCalendarToday } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoPrint } from "react-icons/io5";
import { FaCommentMedical } from "react-icons/fa6";
import { CircularProgress } from "@mui/joy";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import Loader from "../../../Components/Loader/Loader";
import { getTaskDetails } from "../../../Services/api";

const TaskDetails = () => {
  const [loading, setLoading] = useState(false);
  const [Task, setTask] = useState({});
  const location = useLocation();
  const { taskId } = location.state || {};

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await getTaskDetails(taskId);
        setTask(response.results);
        console.log(response);
      } catch (error) {
        console.error("Error fetching Task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

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

  if (loading) {
    return (
      <div className="loader flex items-center justify-center m-auto">
        <Loader />
      </div>
    );
  }

  const assignee = Task.assignees && Task.assignees[0]; 

  return (
    <div className="TaskDetails mx-1">
      <h1 className="title font-inter font-bold text-3xl text-black m-2">
        {t("TaskDetails")}
      </h1>

      <div className="wrapper bg-white grid grid-cols-2 rounded-3xl m-2 ">
        <div className="box relative flex justify-center items-center">
          <span className="index text-gray font-inter font-bold text-2xl absolute left-12 top-12">
            # 132
          </span>
          <div className="analytics_box rounded-md shadow-sm p-8 flex flex-col gap-3 items-center">
            <div className="progress_wrapper rounded-2xl shadow-md p-8 relative">
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
                  "--CircularProgress-trackShadowColor": "rgba(0, 0, 0, 0.12)",
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
            <div className="status_wrapper flex flex-col">
              <span
                className="Tag px-14 py-2 rounded-3xl font-inter font-semibold text-sm mt-2"
                style={{
                  background: "#FFDD9533",
                  color: "#CA8A04",
                }}
              >
                {Task.taskStatus}
              </span>
              <span
                className="Tag px-14 py-2 rounded-3xl font-inter font-semibold text-sm mt-2 text-center"
                style={{
                  background: "#DEEBFFAD",
                  color: "#0086D5",
                }}
              >
                {Task.taskPriority}
              </span>
            </div>
          </div>
        </div>
        <div className="form m-3 mr-24">
          <Input
            type={"name"}
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("PName")}
            placeholder={Task.title}
            disabled
          />
          <Input
            disabled
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("sDate")}
            placeholder={formatDate(Task.startDate)}
            inputIcons={{
              element: <MdCalendarToday />,
              type: "calendar",
            }}
            iconClass={"text-yellow"}
          />
          <Input
            disabled
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("dDate")}
            placeholder={formatDate(Task.dueDate)}
            inputIcons={{
              element: <MdCalendarToday />,
              type: "calendar",
            }}
            iconClass={"text-yellow"}
          />
          {assignee && (
            <div className="Tasksetter my-2">
              <p className="font-inter font-bold text-sm leading-4 my-2">
                {t("Tasksetter")}
              </p>
              <div className="flex justify-between items-center gap-1">
                <div className="flex items-center gap-5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={assignee.profilePic}
                    alt="Tasksetter"
                  />

                  <span className="font-inter font-medium text-base">
                    {assignee.name}
                  </span>
                </div>

                <span className="font-inter font-medium text-base">
                  {assignee.role.name}
                </span>
              </div>
            </div>
          )}

          <div className="Tag_wrapper my-2">
            <p className="font-inter font-bold text-sm leading-4 my-2">{t("Tag")}</p>
            <span
              className="font-inter font-semibold text-base text-center py-1 px-6 rounded-2xl m-2"
              style={{
                background: "#81D4C236",
                color: "#34C759",
              }}
            >
              Electricity
            </span>
          </div>
          <div className="flex right-0 my-2 items-center justify-end">
            <button className="files flex items-center gap-1 mx-1">
              <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
                2
              </span>
              <FaFileLines className="text-purple-dark h-7 w-7" />
            </button>

            <button className="addNote mx-1">
              <span>
                <FaCommentMedical
                  className="h-7 w-7"
                  style={{ color: "#81D4C2" }}
                />
              </span>
            </button>
            <button className="print mx-1">
              <IoPrint className="h-7 w-7 text-gray" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;