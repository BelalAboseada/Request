import { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import {
  addTask,
  getAllConsultants,
  getAllContractors,
  getAllOwners,
} from "../../../Services/api";
import Select from "../../../Components/UI/Select/Select";
import Loader from "../../../Components/Loader/Loader";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTask = () => {
  const { ProjectId } = useParams();
  console.log("Params =>  ", ProjectId);
  const user = useSelector((state) => state.auth.user);

  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [SelectedStatus, setSelectedStatus] = useState("");

  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedContractor, setSelectedContractor] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [Owners, setOwners] = useState([]);
  const [OwnersLoading, setOwnersLoading] = useState(true);
  const [Contractors, setContractors] = useState([]);
  const [ContractorsLoading, setContractorsLoading] = useState(true);
  const [Consultants, setConsultants] = useState([]);
  const [ConsultantsLoading, setConsultantsLoading] = useState(true);
  const [sDate, setSDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [eDate, setEDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [fieldErrors, setFieldErrors] = useState({
    Name: false,
    Description: false,
    sDate: false,
    eDate: false,
    owner: false,
    contractor: false,
    consultant: false,
    priority: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownersData = await getAllOwners();
        setOwners(
          ownersData.results.map((owner) => ({
            value: owner._id,
            label: owner.name,
          }))
        );
        setOwnersLoading(false);

        const contractorsData = await getAllContractors();
        setContractors(
          contractorsData.results.map((contractor) => ({
            value: contractor._id,
            label: contractor.name,
          }))
        );
        setContractorsLoading(false);

        const consultantsData = await getAllConsultants();
        setConsultants(
          consultantsData.results.map((consultant) => ({
            value: consultant._id,
            label: consultant.name,
          }))
        );
        setConsultantsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  const priorityOptions = [
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
  ];
  const statusOptions = [
    { value: "completed", label: t("completed") },
    { value: "working", label: t("medium") },
    { value: "waiting", label: t("waiting") },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const clearFormFields = () => {
    setName("");  
    setDescription("");
    setSDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setEDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedPriority("");
    setSelectedOwner("");
    setSelectedContractor("");
    setSelectedConsultant("");
    setSelectedStatus("")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newFieldErrors = {
      Name: !Name.trim(),
      Description: !Description.trim(),
      sDate: !sDate.startDate,
      eDate: !eDate.endDate,
      priority: !selectedPriority,
      owner: !selectedOwner,
      contractor: !selectedContractor,
      consultant: !selectedConsultant,
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return;
    }

    const formattedSDate = formatDate(sDate.startDate);
    const formattedEDate = formatDate(eDate.endDate);
    console.log(formattedSDate);
    console.log(formattedEDate);

    try {
      const taskData = {
        title: Name,
        description: Description,
        startDate: formattedSDate,
        project: ProjectId,
        dueDate: formattedEDate,
        owner: selectedOwner,
        contractor: selectedContractor,
        consultant: selectedConsultant,
        taskPriority: selectedPriority,
        taskStatus: SelectedStatus,
        createdBy: user._id,
      };

      setLoading(true);
      console.log("task data =>  ", taskData);
      const res = await addTask(taskData);
      console.log(res);
      clearFormFields();
    } catch (err) {
      setError({
        message: err.response ? err.response.data.message : err.message,
      });
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddTask mx-1">
      {Loading ? (
        <div className="flex">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="title font-inter font-bold text-3xl text-black m-2 rtl:hidden">
            {t("AddTask")}
          </h1>
          <div className="wrapper bg-white rounded-3xl p-3 m-2 ">
            <form action="submit">
              <Input
                label={t("PName")}
                placeholder={"Project Name"}
                className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid ${
                  fieldErrors.Name && "border-red"
                }`}
                type={"name"}
                required={true}
                id={"name"}
                value={Name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus={true}
              />
              <div className="desc">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 font-jost text-base font-medium "
                >
                  {t("desc")}
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder={t("Description")}
                  required={true}
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${
                    fieldErrors.Description && "border-red"
                  } bg-white w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col my-2 col-span-1">
                  <label
                    htmlFor="sDate"
                    className="flex items-center gap-2 font-jost text-base font-medium "
                  >
                    {t("sDate")}
                  </label>
                  <Datepicker
                    useRange={false}
                    asSingle={true}
                    inputId="sDate"
                    value={sDate}
                    onChange={(date) => setSDate(date)}
                    primaryColor={"purple"}
                    popoverClassName="!bg-white !border-gray-300 !shadow-md"
                    popoverDirection="up"
                    toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white text-gray-800 w-full rounded-xl border border-gray-300 font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple focus:border-solid ${
                      fieldErrors.sDate ? "border-red border" : ""
                    }`}
                  />
                </div>
                <div className="flex flex-col my-2 col-span-1">
                  <label
                    htmlFor="dDate"
                    className="flex items-center gap-2 font-jost text-base font-medium "
                  >
                    {t("dDate")}
                  </label>
                  <Datepicker
                    useRange={false}
                    asSingle={true}
                    primaryColor={"purple"}
                    value={eDate}
                    onChange={(date) => setEDate(date)}
                    inputId="dDate"
                    popoverClassName="!bg-white !border-gray-300 !shadow-md"
                    popoverDirection="down"
                    toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid ${
                      fieldErrors.eDate && "border-red border"
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  id="priority"
                  label={t("Priority")}
                  InputClassName={`${
                    fieldErrors.priority
                      ? "border  border-red rounded-2xl "
                      : ""
                  }`}
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e)}
                  options={priorityOptions}
                  error={false}
                />
                <Select
                  id="status"
                  label={t("status")}
                  InputClassName={`${
                    fieldErrors.status ? "border  border-red rounded-2xl " : ""
                  }`}
                  value={SelectedStatus}
                  onChange={(e) => setSelectedStatus(e)}
                  options={statusOptions}
                  error={false}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  id="owners"
                  label={t("Owners")}
                  InputClassName={`${
                    fieldErrors.owner ? "border  border-red rounded-2xl " : ""
                  }`}
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e)}
                  options={Owners}
                  loading={OwnersLoading}
                  error={!!error}
                />
                <Select
                  id="contractors"
                  label={t("Contractors")}
                  InputClassName={`${
                    fieldErrors.contractor
                      ? "border  border-red rounded-2xl "
                      : ""
                  }`}
                  value={selectedContractor}
                  onChange={(e) => setSelectedContractor(e)}
                  options={Contractors}
                  loading={ContractorsLoading}
                  error={!!error}
                />
              </div>
              <Select
                id="consultants"
                label={t("Consultants")}
                InputClassName={`${
                  fieldErrors.consultant
                    ? "border  border-red rounded-2xl "
                    : ""
                }`}
                value={selectedConsultant}
                onChange={(e) => setSelectedConsultant(e)}
                options={Consultants}
                loading={ConsultantsLoading}
                error={!!error}
              />

              {error && (
                <div className="text-red font-bold text-center p-2">
                  {t(error.message)}
                </div>
              )}
              <div className="btn flex items-center justify-center md:justify-end my-3">
                <Button onClick={handleSubmit}>{t("Next")}</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddTask;