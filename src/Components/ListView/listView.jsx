import { Progress } from "@material-tailwind/react";
import { FaPen } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { t } from "i18next";

const ListView = ({
  Tagname,
  NameOfTask,
  ProgressValue,
  taskPriority,
  status,
  avatars = [],
  MsgLength,
  filesLength,
  sDate,
  eDate,
}) => {
  return (
    <div className="box bg-white rounded-lg shadow-sm py-1 px-3 flex items-center justify-between gap-2 ">
      <div className="files flex items-center gap-3 cursor-pointer">
        <div className="pen">
          <span>
            <FaPen className="text-gray w-3 h-3 md:w-4 md:h-4 cursor-pointer" />
          </span>
        </div>
        <div className="files flex items-center gap-1">
          <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
            {filesLength}
          </span>
          <FaFileLines className="text-purple-dark w-3 h-3 md:w-4 md:h-4" />
        </div>
        <div className="msg flex items-center gap-1">
          <span className="text-red font-inter font-extrabold text-sm leading-4">
            {MsgLength}
          </span>
          <MdMessage className="text-yellow w-4 h-4" />
        </div>
      </div>
      <div className="name flex justify-between items-center mx-2 my-3">
        <p className="font-inter font-medium text-xs leading-5">{NameOfTask}</p>
      </div>
      <div className="chips flex items-center justify-start gap-2">
        <span
          className={`${taskPriority} font-inter font-semibold text-xs text-center py-1 px-1 md:px-2 rounded-3xl`}
        >
          {taskPriority}
        </span>
        <span
          className={`${status} font-inter font-semibold text-xs text-center py-1 px-2 rounded-3xl`}
        >
          {status}
        </span>
      </div>
      <div className="members flex -space-x-2 mx-1">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt="avatar"
            className="w-7 h-7 border-2 border-white rounded-full m-1 "
          />
        ))}
      </div>

      <div className="progress max-w-2xl w-full mx-1 my-3">
        <div className="mb-2 flex items-center justify-between gap-2">
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
      <div className="tagName flex justify-center">
        <span className="Tag px-14 py-2 rounded-3xl font-inter font-semibold text-sm mt-2">
          {Tagname}
        </span>
      </div>
    </div>
  );
};

export default ListView;
