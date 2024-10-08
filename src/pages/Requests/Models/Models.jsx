import { Link } from "react-router-dom";
import logo from "../../../assets/images/Models.png";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Button from "../../../Components/UI/Button/Button";
import { useState } from "react";
const Models = () => {
    const [isReviewed, setIsReviewed] = useState(false);

  const links = [
    { label: "Approval of general documents", to: "/request/", approved: false },
    { label: "Approval of schemes", to: "/request/", approved: true },
    { label: "Table of quantities", to: "/request/", approved: false },
    { label: "Request for Receipt of Works", to: "/request/", approved: true },
    { label: "Work request", to: "/request/", approved: false },
    { label: "Material Inspection Form", to: "/request/", approved: false },
  ];
  return (
    <div className="Models">
      <div className="wrapper flex justify-center items-center mt-32 relative">
        <div className="logo absolute -top-12  z-10 ">
          <img src={logo} alt="logo" className="w-20 h-20 md:w-28 md:h-28 " />
        </div>
        <div className="content bg-white rounded-3xl relative w-full ">
          <p className="text-center text-purple mt-14 font-medium md:font-semibold  text-lg md:text-2xl ">
            Complete the following forms to complete <br />
            your application for the project
          </p>

          <div className="links grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {links.map((link, index) => (
              <div
                key={index}
                className="link flex justify-between items-center  bg-white shadow-lg rounded-xl px-2 py-3 my-1 mx-3"
              >
                <div className=" flex item-center gap-1">
                  <input
                    type="checkbox"
                    name={link.label}
                    id={index}
                    disabled
                    checked={link.approved}
                    className="appearance-none w-3 h-3 mt-2 mr-1 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
                  />
                  <Link
                    to={link.to}
                    className={`  font-medium text-base text-left`}
                  >
                    {link.label}
                  </Link>
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
          <div className="review flex items-center gap-2 my-2 mx-3">
            <input
              type="checkbox"
              name="review"
              id="review"
              onChange={() => setIsReviewed(!isReviewed)}
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
            />
            <label
              htmlFor="review"
              className="text-purple font-medium text-base underline"
            >
              Please review the following item(s) and return a copy with your
              Action code
            </label>
          </div>
          <div className="send text-end my-5 mx-3">
            <Button  disabled={!isReviewed} type="submit">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
