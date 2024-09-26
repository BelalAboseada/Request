import React, { useState, useEffect } from "react";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import { BiImageAdd } from "react-icons/bi";
import { PiSignatureBold } from "react-icons/pi";
import { LiaStampSolid } from "react-icons/lia";
import Input from "../../../Components/UI/Input/Input";
import "./style.scss";
import { SignatureBtn } from "../../../Components/signature/signature";
import { t } from "i18next";
import Button from "../../../Components/UI/Button/Button";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { uploadCompanyFiles } from "../../../Services/api";
import { toast } from "react-toastify";

const CreateCompany = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const [logoPreview, setLogoPreview] = useState(null);
  const [stampPreview, setStampPreview] = useState(null);
  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);
  const [stamp, setStamp] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Function to handle image change and set preview for logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
    setLogo(file);
  };

  // Function to handle image change and set preview for stamp
  const handleStampChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStampPreview(URL.createObjectURL(file));
    }
    setStamp(file);
  };

  const handleSignatureChange = (dataUrl) => {
    setSignature(dataUrl);
  };

  const clearFields = () => {
    setLogoPreview(null);
    setLogo(null);
    setName("");
    setStampPreview(null);
    setStamp(null);
  };

  // Form validation logic
  useEffect(() => {
    const isValid = logo && stamp && signature && name;
    setIsFormValid(isValid);
  }, [logo, stamp, signature, name]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("All fields are required");
      return;
    }
    setLoading(true);

    try {
      const updatedData = {
        companyLogo: logo,
        electronicStamp: stamp,
        signature: signature,
        companyName: name,
      };

      const res = await uploadCompanyFiles(userId, updatedData);
      

      const updatedUser = { ...user, ...res.updates };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoading(false);
      toast.success("User created successfully");
      clearFields();
      navigate("/");
      window.location.reload();

    } catch (err) {
      console.error("Update user failed:", err);
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="CreateCompany h-screen relative effect_right overflow-hidden">
      <AuthHeader />
      <div className="Wrapper flex items-center justify-between gap-2">
        <form
          className="form flex flex-col"
          onSubmit={handleSubmit}
        >
          {/* Logo Input */}
          <div className="addLogo w-[250px] m-auto shadow-sm rounded-3xl my-2">
            <label
              htmlFor="logo"
              className="bg-white p-2 flex flex-col justify-center items-center rounded-3xl shadow-sm cursor-pointer"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-24 h-24 object-cover rounded-full border border-solid border-purple"
                />
              ) : (
                <div
                  className="icon_wrapper rounded-full p-5 my-2 mx-4"
                  style={{
                    background: "#CCABDA33",
                  }}
                >
                  <BiImageAdd className="text-purple w-12 h-12" />
                </div>
              )}
              <span className="font-workSans font-extrabold text-xl my-2 mx-4">
                {t("AddLogo")}
              </span>
            </label>
            <input
              type="file"
              name="logo"
              id="logo"
              className="hidden"
              required={true}
              onChange={handleLogoChange}
            />
          </div>

          {/* Company Name Input */}
          <div className="companyName">
            <Input
              type={"text"}
              id={"companyName"}
              name={"companyName"}
              placeholder={t("CompanyName")}
              required={true}
              onChange={(e) => setName(e.target.value)}
              label={"Company Name"}
              className={
                "bg-white w-[500px] border border-solid border-purple focus:border focus:border-solid focus:border-purple px-6 font-workSans font-bold text-base"
              }
              label_class={"text-purple font-workSans font-bold text-base"}
            />
          </div>

          {/* Stamp Input */}
          <div className="stamp w-[500px]">
            <label
              htmlFor="stamp"
              className="box flex justify-start items-center bg-white py-1 px-6 gap-2 rounded-2xl m-2 shadow-mdc1"
            >
              <div
                className="icon_wrapper rounded-2xl p-5 my-2 mx-4"
                style={{
                  background: "#CCABDA33",
                }}
              >
                <LiaStampSolid className="text-purple w-6 h-6" />
              </div>
              {stampPreview ? (
                <img
                  src={stampPreview}
                  alt="Stamp Preview"
                  className="w-[66px] h-[62px] object-cover rounded-lg"
                />
              ) : (
                <span className="font-workSans font-semibold text-xl leading-5">
                  {t("stamp")}
                </span>
              )}
            </label>
            <input
              type="file"
              name="stamp"
              id="stamp"
              className="hidden"
              required={true}
              onChange={handleStampChange}
            />
          </div>

          {/* Signature Input */}
          <div className="signature">
            <SignatureBtn onSignatureChange={handleSignatureChange} />
          </div>

          {error && <p className="text-red text-center">{error}</p>}

          {/* Submit Button */}
          <div className="btn flex items-center justify-center md:justify-end my-3 mx-1 !px-0">
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`${
                !isFormValid
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-purple text-white"
              }`}
            >
              {t("save")}
            </Button>
          </div>
        </form>

        {/* Right Side Info Section */}
        <div className="w-[529px] my-40">
          <h3 className="font-workSans font-bold text-5xl leading-[56px]">
            You're just steps away from your screens
          </h3>
          <p className="font-jost font-medium text-2xl text-gray">
            Complete the following data to save time added each time
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
