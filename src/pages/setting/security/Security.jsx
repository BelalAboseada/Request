import React from "react";
import { useSelector } from "react-redux";
import { CheckInput } from "../setting";
import { t } from "i18next";
import { Link } from "react-router-dom";

const Security = () => {
  const user = useSelector((state) => state.auth.user);

   const formatDate = (date) => {
     if (!date) return "";
     const d = new Date(date);
     const year = d.getFullYear();
     const month = String(d.getMonth() + 1).padStart(2, "0");
     const day = String(d.getDate()).padStart(2, "0");
     return `${year}-${month}-${day}`;
   };

  return (
    <div className="Security">
      <div className="email flex items-center  justify-between   m-2 mb-4 ">
        <p>{t("Sign-in Email")}</p>
        <span>{user.email}</span>
      </div>
      <div className="changePassword flex items-center  justify-between   m-2 mt-8">
        <p>{t("Password")}</p>
        <Link to={"/forgotPassword"}>
          <button className="btn  text-gold">{t("Change password")}</button>
        </Link>
      </div>
      <div className="divider h-px w-full bg-gray my-2"></div>
      <div className="twoFactor flex items-center  justify-between   mx-2 mt-4 mb-8">
        <p>{t("2-FA authentication")}</p>
        <CheckInput />
      </div>
      <div className="Phone flex items-center  justify-between   mx-2 mt-8 mb-2">
        <p>{t("Phone number")}</p>
        <span>{user.phone}</span>
      </div>
      <div className="divider h-px w-full bg-gray my-2"></div>
      <div className="LastSignIn mx-2 mt-4 mb-8">
        <p>{t("Last Sign-in")}</p>
        <span>{formatDate(user.updatedAt)}</span>
      </div>
    </div>
  );
};

export default Security;
