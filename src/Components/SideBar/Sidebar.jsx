/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  MdDriveFolderUpload,
  MdInbox,
  MdKeyboardDoubleArrowLeft,
  MdOutlinePayment,
} from "react-icons/md";
import { CiGrid32, CiHome } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import Button from "../UI/Button/Button";
import { handleLogout } from "../../redux/services/authServices";
import avatar from "../../assets/images/Avatar.jpg"
import { t } from "i18next";

const Sidebar = () => {
  const [Open, setOpen] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const [notifications, setNotifications] = useState({
    Home: 2,
    Projects: 2,
    Inbox: 0,
    Drive: 0,
    Plan: 1,
    Settings: 0,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    dispatch(handleLogout());
    navigate("/LogIn/Mail");
  };

  const items = [
    {
      title: t("Home"),
      icon: <CiHome className="sidebar_icon" />,
      path: "/Settings",
      notificationCount: notifications.Home,
    },
    {
      title: t("Projects"),
      icon: <CiGrid32 className="sidebar_icon" />,
      path: "/Projects",
      notificationCount: notifications.Projects,
    },
    {
      title: t("Inbox"),
      icon: <MdInbox className="sidebar_icon" />,
      path: "/Inbox",
      notificationCount: notifications.Inbox,
    },
    {
      title: t("Drive"),
      icon: <MdDriveFolderUpload className="sidebar_icon" />,
      path: "/Drive",
      notificationCount: notifications.Drive,
    },
    {
      title: t("SeePlan"),
      icon: <MdOutlinePayment className="sidebar_icon" />,
      path: "/plan",
      notificationCount: notifications.Plan,
    },
    {
      title: t("settings"),
      icon: <GiSettingsKnobs className="sidebar_icon" />,
      path: "/Settings",
      notificationCount: notifications.Settings,
    },
  ];

  const handleProfileClick = () => {
    setIsProfileActive(!isProfileActive);
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="Sidebar rtl:left-0">
      <div
        className={`bg-white h-screen py-5 pt-8 relative transition-custom duration-500 hidden lg:flex flex-col ${
          !Open ? "w-72" : "w-24"
        }`}
      >
        <MdKeyboardDoubleArrowLeft
          onClick={() => setOpen(!Open)}
          className={`bg-white rounded-full text-purple border border-purple p-1 text-3xl absolute ltr:-right-4 rtl:-left-3 top-20 cursor-pointer ${
            !Open && "rotate-180"
          }`}
        />
        <div
          className={`flex gap-2 items-center profile py-6 px-5 ${
            isProfileActive && "item_sidebar"
          }`}
        >
          <Link
            to="/Profile"
            onClick={handleProfileClick}
            className="flex gap-2 items-center"
          >
            <div className="relative">
              <img
                src={user.profilePic || avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover transition-custom duration-500"
              />
              <span className="bg-green absolute rounded-full w-4 h-4 left-8 top-8"></span>
            </div>
            {!Open && (
              <div className="flex flex-col">
                <p className="name font-bold font-inter text-xs">{user.name}</p>
                <p className="role font-bold font-inter text-xs text-gray">
                  {user.role.name}
                </p>
              </div>
            )}
          </Link>
        </div>
        <div
          className={`items w-full flex flex-col mt-5 gap-3 overflow-hidden`}
        >
          {items.map((item, index) => (
            <Link
              key={item.title}
              to={item.path}
              onClick={() => handleItemClick(index)}
              className={`text-sm font-semibold font-inter text-gray transition-custom duration-custom flex items-center gap-3 py-5 px-5 ${
                index === activeIndex ? "item_sidebar" : ""
              }
              ${item.path === window.location.pathname ? "item_sidebar" : ""}
                 ${Open && "item_sidebar_close pl-7"}`}
            >
              <span
                className={`${index === activeIndex ? "icon" : ""}    ${
                  item.path === window.location.pathname ? "icon" : ""
                }`}
              >
                {item.icon}
              </span>
              <p className={`${Open && "scale-0"}`}> {item.title}</p>
              {!Open && item.notificationCount > 0 && (
                <span className="Notifications rounded-full ltr:right-4 rtl:left-4 absolute w-8 h-8 bg-red-500 !text-red flex items-center justify-center">
                  {item.notificationCount}
                </span>
              )}
            </Link>
          ))}
          {/* Logout Button */}
          {user ? (
            <Button
              onClick={handleLogoutClick}
              className={`mt-auto  mx-2 ${Open && "hidden"}`}
            >
              {t("logout")}
            </Button>
          ) : (
            <Button className="mt-auto w-full">
              <Link to="/SignUp/ChooseRole">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
