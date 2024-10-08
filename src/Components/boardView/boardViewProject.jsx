import { Progress } from "@material-tailwind/react";
import "./style.scss";
import { FaPen } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { t } from "i18next";

const BoardViewProject = ({
  NameOfTask,
  ProgressValue,
  Submit,
  Status,
  avatars = [],
  MsgLength,
  filesLength,
  sDate,
  eDate,
  onApprove,
  onCancel,
}) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case "waiting":
        return "Waiting for Review";
      case "working":
        return "Working on It";
      default:
        return status;
    }
  };
  return (
    <div className="box h-full bg-white rounded-md shadow-sm p-2 flex flex-col col-span-1">
      <div className="tagName flex justify-center">
        <span
          className={`${Status} w-full text-center py-2 rounded-3xl font-inter font-semibold text-sm mt-2`}
        >
          {getStatusDisplay(Status)}
        </span>
      </div>
      <div className="name flex justify-between items-center mx-2 my-3">
        <p className="font-inter font-medium text-xs leading-5">{NameOfTask}</p>
        <span>
          <FaPen className="text-gray w-4 h-4 cursor-pointer" />
        </span>
      </div>
      <div className="progress w-full mx-2 my-3">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="font-inter font-normal text-xs text-gray-dark">
            Progress
          </p>
          <span className="font-inter font-normal text-xs text-gray-dark px-2">
            {ProgressValue} %
          </span>
        </div>
        <Progress
          value={ProgressValue}
          color="purple"
          trackColor="gray"
          barProps={{
            style: {
              height: "5px",
              backgroundColor: "purple",
            },
          }}
          size="sm"
        />
      </div>
      <div className="flex items-center justify-between mx-2 my-3">
        {avatars && (
          <div className="members flex -space-x-2">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="avatar"
                className="w-8 h-8 border-2 border-white rounded-full m-1"
              />
            ))}
          </div>
        )}
        <div className="files flex items-center gap-3 cursor-pointer">
          <div className="files flex items-center gap-1">
            <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
              {filesLength}
            </span>
            <FaFileLines className="text-purple-dark w-4 h-4" />
          </div>
          <div className="msg flex items-center gap-1">
            <span className="text-red font-inter font-extrabold text-sm leading-4">
              {MsgLength}
            </span>
            <MdMessage className="text-yellow w-4 h-4" />
          </div>
        </div>
      </div>
      <hr className="h-px bg-gray mx-3" />
      <div className="date flex justify-between items-center mx-2 my-3">
        <div className="sDate flex items-center gap-1">
          <p className="font-poppins font-bold text-xs">{t("sDate")}:</p>
          <span className="font-poppins font-normal text-xs text-gray">
            {sDate}
          </span>
        </div>
        <div className="eDate flex items-center gap-1">
          <p className="font-poppins font-bold text-xs">{t("dDate")}:</p>
          <span className="font-poppins font-normal text-xs text-gray">
            {eDate}
          </span>
        </div>
      </div>
      {Status === "waiting" && (
        <div className="buttons mx-2 my-3 flex justify-around gap-2 ">
          <button
            onClick={onCancel}
            className="bg-red text-white rounded-3xl w-full font-bold py-2 px-4 "
          >
            {t("Cancel")}
          </button>
          <button
            onClick={onApprove}
            className="bg-green text-white rounded-3xl  w-full  font-bold py-2 px-4 "
          >
            {t("Approve")}
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardViewProject;
