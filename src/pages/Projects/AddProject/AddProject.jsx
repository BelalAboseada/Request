import i18next, { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import { addProject } from "../../../Services/api";
import Loader from "../../../Components/Loader/Loader";
import Select from "../../../Components/UI/Select/Select";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const AddProject = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
    const lang = i18next.language;
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("");
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
    budget: false,
    priority: false,
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

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
    setSDate(null);
    setEDate(null);
    setBudget("");
    setPriority("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newFieldErrors = {
      Name: !Name.trim(),
      Description: !Description.trim(),
      sDate: !sDate.startDate,
      eDate: !eDate.endDate,
      budget: !budget.toString().trim() || budget < 10,
      priority: !priority,
    };

    if (budget < 10) {
      setError({ message: "budget must be greater than or equal to 10" });
      return null; // Return null if validation fails
    }
    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return null; // Return null if validation fails
    }

    const formattedSDate = formatDate(sDate.startDate);
    const formattedEDate = formatDate(eDate.endDate);

    try {
      const projectData = {
        name: Name,
        description: Description,
        sDate: formattedSDate,
        dueDate: formattedEDate,
        budget: budget,
        projectPriority: priority,
        createdBy: user._id,
      };

      setLoading(true);
      console.log("Project data =>  ", projectData);
      const res = await addProject(token, projectData);
      toast.success(t("toast.ProjectSuccess"));
      clearFormFields();
      setLoading(false);
      return {
        projectId: res.addedProject._id,
        projectName: res.addedProject.name,
        members: res.addedProject.members,
      };
    } catch (err) {
      setError({
        message: err.response ? err.response.data.message : err.message,
      });
      console.log(err);
      setLoading(false);
      return null; 
    } finally {
      setLoading(false);
    }
  };

  const handlePublic = async (e) => {
    e.preventDefault();

    const result = await handleSubmit(e);
    if (result) {
      navigate("/Requests/TableOfQuantities", {
        state: {
          projectId: result.projectId,
          projectName: result.projectName,
          members: result.members,
        },
      });
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    const result = await handleSubmit(e);
    if (result) {
      navigate("/AddProject/Invite", {
        state: {
          projectId: result.projectId,
          projectName: result.projectName,
        },
      });
    }
  };




  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="AddProject mx-1">
      {Loading ? (
        <div className="flex">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="title font-inter font-bold text-3xl text-black m-2 rtl:hidden">
            {t("AddProject")}
          </h1>
          <div className="wrapper bg-white rounded-3xl p-3 m-2 ">
            <form action="submit">
              <Input
                label={t("PName")}
                placeholder={t("PName")}
                className={`bg-white border border-purple  border-solid focus:border   focus:border-purple  focus:border-solid ${
                  fieldErrors.Name && "border-red"
                }`}
                type={"name"}
                required={true}
                id={"name"}
                value={Name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus
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
                  placeholder={t("desc")}
                  required={true}
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${
                    fieldErrors.Description && "border-red"
                  } bg-white  w-full   rounded-xl border border-purple font-jost font-normal text-base  my-2 py-2 px-4  border-solid  focus:border   focus:border-purple  focus:border-solid`}
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
                    popoverClassName="!bg-purple-100"
                    popoverDirection="down"
                    toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white  w-full   rounded-xl border border-purple font-jost font-normal text-base  my-2 py-2 px-4  border-solid  focus:border   focus:border-purple  focus:border-solid ${
                      fieldErrors.sDate && "border-red"
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
                    popoverClassName="!bg-purple-100"
                    popoverDirection="down"
                    toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white  w-full   rounded-xl border border-purple font-jost font-normal text-base  my-2 py-2 px-4  border-solid  focus:border   focus:border-purple  focus:border-solid ${
                      fieldErrors.eDate && "border-red"
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col my-2 col-span-1">
                  <Select
                    label={t("Priority")}
                    isClearable
                    options={[
                      { value: "low", label: t("Low") },
                      { value: "medium", label: t("Medium") },
                      { value: "high", label: t("High") },
                    ]}
                    className={`bg-white  ${
                      fieldErrors.priority && "border-b border-red  rounded-2xl"
                    }`}
                    value={priority}
                    placeholder={t("Priority")}
                    onChange={(value) => setPriority(value)}
                  />
                </div>
                <div className="flex flex-col my-2 col-span-1">
                  <Input
                    label={t("budget")}
                    placeholder={t("budget")}
                    className={`bg-white border border-purple  border-solid focus:border   focus:border-purple  focus:border-solid ${
                      fieldErrors.Name && "border-red"
                    }`}
                    type={"number"}
                    required={true}
                    id={"budget"}
                    min="10"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    autoFocus={true}
                  />
                </div>
              </div>

              {error && (
                <div className="text-center">
                  <p className="error text-red">{error.message}</p>
                </div>
              )}
              <div className="btn flex items-center justify-center md:justify-end my-3 gap-2">
                <button
                  className={
                    "bg-white text-purple border border-purple border-solid font-jost py-3 px-32 rounded-xl capitalize   opacity-100  disabled:opacity-50 text-base font-medium text-left"
                  }
                  onClick={handleInvite}
                >
                  {t("invite")}
                </button>
                <Button onClick={handlePublic}>{t("Public")}</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddProject;



