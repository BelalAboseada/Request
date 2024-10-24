import { Card, Dialog, DialogBody } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Input from "../UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Select from "../UI/Select/Select";
import { getAllTagsByUser, getAllUnits } from "../../Services/api";
import { useSelector } from "react-redux";
import { t } from "i18next";
import Button from "../UI/Button/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const AddNewTask = ({ newTask }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { ProjectId, taskType, members } = location.state || {};
  console.log(location.state);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [TaskType, setTaskType] = useState(taskType);
  const [isSubtask, setIsSubtask] = useState(false);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [Price, setPrice] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [Total, setTotal] = useState(0);
  const [Units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [UnitsLoading, setUnitsLoading] = useState(false);
  const [Member, setMember] = useState(members);
  const [isOpen, setIsOpen] = useState(false);
  const [SelectedMember, setSelectedMember] = useState("");
  const [tagsLoading, setTagsLoading] = useState(true);
  const [TaskId, setTaskId] = useState(false);
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
    priority: false,
    tag: false,
    price: false,
    quantity: false,
    unit: false,
    member: false,
  });

  useEffect(() => {
    setIsSubtask(TaskType === "sub");
  }, [TaskType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsData, UnitsData] = await Promise.all([
          getAllTagsByUser(user._id),
          getAllUnits(),
        ]);

        setTags(
          tagsData.results.map((tag) => ({
            value: tag._id,
            label: tag.name,
            colorCode: tag.colorCode,
          }))
        );
        setTagsLoading(false);
        setUnits(
          UnitsData.results.map((unit) => ({
            value: unit._id,
            label: unit.name,
          }))
        );
        setUnitsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [user._id]);

  const priorityOptions = [
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
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
    setSelectedTag("");
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
      tag: !selectedTag,
    };

    if (isSubtask) {
      newFieldErrors.price = !Price || isNaN(Price);
      newFieldErrors.quantity = !Quantity || isNaN(Quantity);
      newFieldErrors.total = !Total || isNaN(Total);
      newFieldErrors.unit = !selectedUnit;
    }
    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return;
    }

    const formattedSDate = formatDate(sDate.startDate);
    const formattedEDate = formatDate(eDate.endDate);

    try {
      const taskData = {
        title: Name,
        description: Description,
        startDate: formattedSDate,
        project: ProjectId,
        dueDate: formattedEDate,
        taskPriority: selectedPriority,
        member: SelectedMember,
        createdBy: user._id,
        tags: selectedTag,
        type: taskType,
        price: Price,
        quantity: Quantity,
        unit: selectedUnit,
        total: Total,
      };
      console.log(taskData);
      
      
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
  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) clearFormFields();
  };
  const handleTagChange = (selectedOptions) => {
    console.log("Selected options:", selectedOptions);
    setSelectedTag(selectedOptions || []);
  };

  const calculateTotal = (Price, Quantity) => {
    const Total = Number(Price || 0) * Number(Quantity || 0);
    setTotal(Total);
  };

  return (
    <div className="AddNewTask">
      <button
        onClick={handleOpen}
        className=" font-bold text-lg text-purple underline underline-offset-1"
      >
        +add new
      </button>
      <Dialog
        open={isOpen}
        size="lg"
        handler={handleOpen}
        className="overflow-y-scroll"
      >
        <DialogBody>
          <form action="submit">
            <Input
              label={t("TaskName")}
              placeholder={"Task Name"}
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
                  fieldErrors.priority ? "border  border-red rounded-2xl " : ""
                }`}
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e)}
                options={priorityOptions}
                error={false}
              />
              <div className="Tags">
                <Select
                  label={t("tag")}
                  id="tag"
                  isMulti={false}
                  value={selectedTag}
                  onChange={handleTagChange}
                  InputClassName={`${
                    fieldErrors.tag ? "border  border-red rounded-2xl " : ""
                  }`}
                  options={tags.map((tag) => ({
                    label: (
                      <div className="flex items-center justify-between">
                        <span className="text">{tag.label}</span>
                        <span
                          className="w-4 h-4 ml-2 rounded-full"
                          style={{ backgroundColor: tag.colorCode }}
                        />
                      </div>
                    ),
                    value: tag.value,
                  }))}
                  error={false}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                id=""
                label={t("Responsible Person")}
                InputClassName={` ${
                  fieldErrors.unit && "border-red  border rounded-2xl"
                }`}
                value={SelectedMember}
                onChange={(e) => setSelectedMember(e)}
                options={members.map((member) => ({
                  value: member._id,
                  label: member.name,
                }))}
                error={false}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                min={0}
                value={Price}
                label={"Price"}
                onChange={(e) => {
                  const newPrice = e.target.value;
                  setPrice(newPrice);
                  calculateTotal(newPrice, Quantity);
                }}
                className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                  ${fieldErrors.price && "border-red"}
                    `}
              />
              <Input
                type="number"
                min={0}
                label={"Quantity"}
                value={Quantity}
                onChange={(e) => {
                  const newQuantity = e.target.value;
                  setQuantity(newQuantity);
                  calculateTotal(Price, newQuantity);
                }}
                className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                      ${fieldErrors.quantity && "border-red "}
                    `}
              />
              <Input
                className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                  
                    `}
                label={"Total"}
                type="number"
                min={0}
                value={Total}
                disabled
              />
              <Select
                options={Units}
                placeholder="Unit"
                disabled={UnitsLoading}
                label={"Unit"}
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e)}
                className={`bg-white mx-4`}
                InputClassName={` ${
                  fieldErrors.unit && "border-red  border rounded-2xl"
                }`}
                loading={UnitsLoading}
              />
            </div>

            {error && (
              <div className="text-red font-bold text-center p-2">
                {t(error.message)}
              </div>
            )}
            <div className="btn flex items-center justify-center md:justify-end my-3">
              <Button onClick={handleSubmit}>{t("Next")}</Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  );
};
