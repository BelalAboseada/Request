import { t } from "i18next";
import avatar from "../../assets/images/avatar1.png";
import signature from "../../assets/images/signature.png";
import { useEffect, useState } from "react";
import { getModelById, updateModel } from "../../Services/api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Loader from "../../Components/Loader/Loader";
import ProfileAvatar from "../../Components/UI/profilePic/profilePic";
import Button from "../../Components/UI/Button/Button";
import { toast } from "react-toastify";

const ViewRequest = () => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [IsOwner, setIsOwner] = useState(user.role.jobTitle === "owner");
  const [IsConsultant, setIsConsultant] = useState(
    user.role.jobTitle === "consultant"
  );
  const [IsContractor, setIsContractor] = useState(
    user.role.jobTitle === "contractor"
  );
  //  const IsOwner = user.role.jobTitle === "owner";
  //  const IsConsultant = user.role.jobTitle === "consultant";
  //  const IsContractor = user.role.jobTitle === "contractor";

  const location = useLocation();
  const { ModelId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getModelById(token, ModelId);
        setModel(res.results);
        console.log(res);

        console.log(model);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (ModelId) fetchData();
  }, []);

  const handleApprove = async (e) => {
    try {
      // Prepare payload dynamically based on roles
      const getApprovalPayload = () => {
        if (IsOwner) return { ownerStatus: "approved" };
        if (IsConsultant) return { consultantStatus: "approved" };
        if (IsContractor) return { contractorStatus: "approved" };
        return {};
      };

      const payload = getApprovalPayload();
      console.log("Approval Payload:", payload);

      if (Object.keys(payload).length === 0) {
        console.error("No valid role detected for approval.");
        toast.error("Approval failed: Invalid role.");
        return;
      }

      // Perform the API call
      const res = await updateModel(token, ModelId, payload);
      console.log("API Response:", res);

      // Handle success
      toast.success("Request approved successfully.");
      window.location.reload();
    } catch (error) {
      // Error handling
      console.error("Error during approval:", error);
      toast.error("Failed to approve the request.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd-MM-yyy");
  };
  if (loading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }
  return (
    <div className="ViewRequest">
      <div className="header bg-white p-4 rounded-l-3xl">
        <h5 className="font-bold text-base">{model?.title}</h5>
      </div>
      <div className="content bg-white p-4 rounded-3xl my-6 ">
        <div className="flex items-center justify-between">
          {(model?.consultant || model?.contractor) && (
            <div className="flex items-center gap-3">
              {model?.consultant && (
                <div className="flex flex-col items-center gap-3">
                
                  <ProfileAvatar
                    name={model?.consultant?.companyName}
                    profilePic={
                      model?.consultant?.companyLogo
                        ? model?.consultant?.companyLogo
                        : model?.consultant?.name
                    }
                    className={`!w-20 !h-20 !text-3xl`}
                  />
                  <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                    {model?.consultant?.name}
                  </span>
                </div>
              )}
              {model?.contractor && (
                <div className="flex flex-col items-center gap-3">
                  
                  <ProfileAvatar
                    name={model?.contractor?.companyName}
                    profilePic={
                      model?.contractor?.companyLogo !== ""
                        ? model?.contractor?.companyLogo
                        : model?.contractor?.name
                    }
                    className={`!w-20 !h-20`}
                  />
                  <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                    {model?.contractor?.name}
                  </span>
                </div>
              )}
              {model?.owner && (
                <div className="flex flex-col items-center gap-3">
                 
                  <ProfileAvatar
                    name={model?.owner?.companyName}
                    profilePic={
                      model?.owner?.companyLogo
                        ? model?.owner?.companyLogo
                        : model?.owner?.name
                    }
                    className={`!w-20 !h-20`}
                  />
                  <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                    {model?.owner?.name}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col ">
            <div className="Ref flex items-center gap-2 my-6">
              <label
                htmlFor="Ref"
                className="font-bold text-base text-gray-dark"
              >
                {t("REF NO")}
              </label>
              <input
                type="text"
                id="Ref"
                disabled
                value={model?.refNo}
                className="bg-white border border-gray rounded-lg p-1 max-w-52"
              />
            </div>
            <div className="Date flex items-center gap-2 ">
              <label
                htmlFor="currentDay"
                className="font-bold text-base text-gray-dark"
              >
                {t("date")}
              </label>
              <div className="inputs">
                <input
                  type="text"
                  id="currentDay"
                  name="Date"
                  value={formatDate(model?.date)}
                  className="bg-white border border-gray rounded-2xl  font-medium text-center mx-1 "
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="bg-gray my-4" />
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{t("PName")} : </h3>
          <span className="text-sm  font-bold"> {model?.project?.name}</span>
        </div>
        <hr className="bg-gray my-4" />
        <div className="flex items-center gap-5">
          {model?.discipline && (
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Discipline")}
              </h5>
              <input
                type="text"
                disabled
                value={model?.discipline?.name}
                className="bg-white w-fit  text-center border  border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.actionCode && (
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Action Code")}
              </h5>
              <input
                type="text"
                disabled
                value={model?.actionCode?.name}
                className="bg-white border  w-fit  text-center border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.reason && (
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("reason")}
              </h5>
              <input
                type="text"
                disabled
                value={model?.reason?.name}
                className="bg-white border  w-fit  text-center border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
        </div>
        {model?.consultantsComment > 0 &&
          model.consultantsComment.map((comment) => (
            <div className="feedback my-4">
              <h5 className="font-bold  text-base">consultants Comment</h5>
              <input
                type="text"
                disabled
                value={comment}
                className="bg-white w-full my-1 text-gray border  border-solid border-gray rounded-2xl p-2"
              />
            </div>
          ))}
        <div className="flex items-center gap-3 my-4">
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-base text-gray-dark">
              Reviewed by :
            </h5>
            <span className="font-medium text-sm">fadl mohamed</span>
            <img src={signature} alt="signature" className="w-14 h-14" />
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-base text-gray-dark">Noted by :</h5>
            <span className="font-medium text-sm">Ahmed mohamed</span>
            <img src={signature} alt="signature" className="w-14 h-14" />
          </div>
        </div>
        <hr className="bg-gray my-4" />
        <div className="desc ">
          <label htmlFor="desc" className="font-bold text-base text-gray-dark">
            {t("desc")}
          </label>
          <input
            type="text"
            id="desc"
            disabled
            value={model?.description}
            className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
          />
        </div>
        {model?.remarks && (
          <div className="desc ">
            <label
              htmlFor="remarks"
              className="font-bold text-base text-gray-dark"
            >
              {t("remarks")}
            </label>
            <input
              type="text"
              id="remarks"
              disabled
              value={model?.remarks}
              className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
            />
          </div>
        )}
        <div className="grid grid-cols-4 gap-3 my-4">
          {model?.supplier && (
            <div className="col-span-2">
              <label
                htmlFor="supplier"
                className="font-bold text-base text-gray-dark"
              >
                manufacturer / supplier
              </label>
              <input
                type="text"
                id="supplier"
                disabled
                value={model?.supplier}
                className="bg-white my-1 border  w-full  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.approvedMaterialSubmittalNo && (
            <div className="col-span-2 flex flex-col">
              <label
                htmlFor="approved"
                className="font-bold text-base text-gray-dark"
              >
                approved material submittal no
              </label>
              <input
                type="text"
                id="approved"
                disabled
                value={model?.approvedMaterialSubmittalNo}
                className="bg-white border my-1  w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
        </div>
        <div className="flex items-center  gap-3 my-2">
          {model?.boqItemNo && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="BOQ item no"
                className="font-bold text-base text-gray-dark"
              >
                BOQ item no
              </label>
              <input
                type="text"
                id="BOQ item no"
                disabled
                value={model?.boqItemNo}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.qty && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="QTY"
                className="font-bold text-base text-gray-dark"
              >
                QTY
              </label>
              <input
                type="text"
                id="QTY"
                disabled
                value={model?.qty}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.location && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="location"
                className="font-bold text-base text-gray-dark"
              >
                location
              </label>
              <input
                type="text"
                id="location"
                disabled
                value={model?.location}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.workArea && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="workArea"
                className="font-bold text-base text-gray-dark"
              >
                workArea
              </label>
              <input
                type="text"
                id="workArea"
                disabled
                value={model?.workArea}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.unit && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Unit"
                className="font-bold text-base text-gray-dark"
              >
                {t("Unit")}
              </label>
              <input
                type="text"
                id="Unit"
                disabled
                value={model?.unit}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
        </div>
        <div className="flex items-center  gap-3 my-2">
          {model?.deliveryNoteNo && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="delivery note no"
                className="font-bold text-base text-gray-dark"
              >
                delivery note no
              </label>
              <input
                type="text"
                id="delivery note no"
                disabled
                value={model?.deliveryNoteNo}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.cell && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Unit"
                className="font-bold text-base text-gray-dark"
              >
                {t("cell")}
              </label>
              <input
                type="text"
                id="Unit"
                disabled
                value={model?.cell}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.inspectionDate && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Unit"
                className="font-bold text-base text-gray-dark"
              >
                {t("inspectionDate")}
              </label>
              <input
                type="text"
                id="inspectionDate"
                disabled
                value={formatDate(model?.inspectionDate)}
                className="bg-white border  my-1 w-fit  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h5 className="font-bold text-base text-gray-dark">submitted by:</h5>
          <span className="font-medium text-sm">{model?.owner?.name}</span>
          <img src={signature} alt="signature" className="w-14 h-14" />
        </div>
        {((IsOwner && model?.ownerStatus === "pending") ||
          (IsConsultant && model?.consultantStatus === "pending") ||
          (IsContractor && model?.contractorStatus === "pending")) && (
          <div className="flex right-0 my-2 items-center gap-3 justify-end">
            <Button onClick={handleApprove}>{t("approve")}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequest;
