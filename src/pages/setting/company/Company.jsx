import { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../Components/UI/Input/Input";
import { t } from "i18next";
import { LiaStampSolid } from "react-icons/lia";
import { SignatureBtn } from "../../../Components/signature/signature";
import Button from "../../../Components/UI/Button/Button";
import { toast } from "react-toastify";
import { uploadCompanyFiles } from "../../../Services/api";

const Company = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  console.log(userId);

  const [preview, setPreview] = useState(user.companyLogo);
  const [logo, setLogo] = useState(user.companyLogo);
  const [name, setName] = useState(user.companyName);
  const [stampPreview, setStampPreview] = useState(user.electronicStamp);
  const [stamp, setStamp] = useState(user.electronicStamp);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStampChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStampPreview(URL.createObjectURL(file));
      setStamp(file);
    }
  };

  const handleSignatureChange = (dataUrl) => {
    setSignature(dataUrl);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare updated data
    const updatedData = {
      companyLogo: logo,
      electronicStamp: stamp,
      signature: signature,
      companyName: name,
    };
    console.log("Updated data:", updatedData);

    try {
      const res = await uploadCompanyFiles(userId, updatedData);
      console.log("Response from server:", res);

    
      const updatedUser = { ...user, ...res.updates }; 
      console.log("Updated user data:", updatedUser);

      // Save to local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("User saved to local storage successfully");

      toast.success("User updated successfully");
      setError(null);
    } catch (err) {
      console.error("Update user failed:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="Company">
      <div className="wrapper bg-white rounded-xl p-4 m-2">
        <div className="flex flex-col">
          <div className="logo my-2 mx-4 relative">
            <img
              src={preview}
              alt={user.companyName}
              className="rounded-full w-24 h-24 object-contain border border-gray p-2"
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="absolute h-10 rounded-b-full flex items-center justify-center ltr:left-0 rtl:right-0 bottom-px cursor-pointer"
              style={{ background: "#9E9E9E", width: "95px" }}
              aria-label="Upload Company Logo"
            >
              <CiCamera className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="companyName mx-4 my-2">
            <Input
              type="text"
              id="companyName"
              name="companyName"
              placeholder={name}
              required
              onChange={(e) => setName(e.target.value)}
              label={t("CompanyName")}
              className="bg-white border border-solid border-gray focus:border focus:border-solid focus:border-gray px-6 font-workSans font-bold text-base"
            />
          </div>

          <div className="stamp">
            <label
              htmlFor="stamp"
              className="box flex justify-start items-center bg-white py-1 px-6 gap-2 rounded-2xl m-2 shadow-mdc1 shadow-lg"
            >
              <div
                className="icon_wrapper rounded-2xl p-5 my-2 mx-4"
                style={{ background: "#CCABDA33" }}
              >
                <LiaStampSolid className="text-purple w-6 h-6" />
              </div>
              <img
                src={stampPreview}
                alt="Stamp Preview"
                className="w-[66px] h-[62px] object-cover rounded-lg"
              />
            </label>
            <input
              type="file"
              name="stamp"
              id="stamp"
              className="hidden"
              required
              onChange={handleStampChange}
            />
          </div>
          <div className="signature">
            <SignatureBtn onSignatureChange={handleSignatureChange} />
          </div>
        </div>
        {error && <div className="error text-red text-center">{error}</div>}
        <div className="flex items-center justify-end gap-2 m-2">
          <Button onClick={handleSubmit} disabled={loading || !signature}>
            {loading ? t("loading...") : t("save")}
          </Button>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="fileInput"
      />
    </div>
  );
};

export default Company;


 