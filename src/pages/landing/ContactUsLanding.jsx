import { t } from "i18next";
import UiInput from "../../Components/UI/Input/UIInput";
import Button from "../../Components/UI/Button/Button";
import ContactUsImage from "../../assets/images/ContactUs.svg";
import { CiLocationOn, CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";
import { useState } from "react";
import { sendEmailGetInTouch } from "../../Services/api";
import { toast } from "react-toastify";
import {
  Input as MaterialInput,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Button as Btn,
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useCountries } from "use-react-countries";

const ContactUsLanding = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Message, setMessage] = useState("");
  const [Phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const countries = useCountries().countries;
  const [countryIndex, setCountryIndex] = useState(230);
  const { name, flags, countryCallingCode } = countries[countryIndex];
  const [fieldErrors, setFieldErrors] = useState({
    Name: false,
    Email: false,
    Phone: false,
    Message: false,
  });

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");
    const codeWithoutPlus = countryCallingCode.replace("+", "");

    // Prevent user from starting the input with the country calling code
    if (value.startsWith(codeWithoutPlus)) {
      setError({
        Phone: `Phone number cannot start with ${countryCallingCode}`,
      });
      return;
    }
    // Validate phone number length (9 or 11 digits)
    if (numericValue.length <= 11) {
      setPhone(numericValue);
    }

    // Display validation error if the number is invalid
    if (
      numericValue.length > 0 &&
      numericValue.length !== 9 &&
      numericValue.length !== 11
    ) {
      setError("Phone number must be 9 or 11 digits long.");
    } else {
      setError("");
    }
  };
  const clearFields = () => {
    setName("");
    setEmail("");
    setMessage("");
    setPhone("");
    setFieldErrors({
      Name: false,
      Email: false,
      Phone: false,
      Message: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim the message input
    // Trim inputs
    const trimmedName = Name.trim();
    const trimmedEmail = Email.trim();
    const trimmedPhone = Phone.trim();
    const trimmedMessage = Message.trim();

    // Check if the trimmed message is empty
    if (!trimmedMessage) {
      setError("Please enter a message.");
      return; // Exit the function if validation fails
    }

    // Check if required fields are filled
    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setError("Please fill all fields.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const formattedData = {
        name: Name,
        email: Email,
        phone: Phone,
        message: trimmedMessage,
      };
      console.log(formattedData);
      
      const res = await sendEmailGetInTouch(formattedData);
      console.log(res);
    toast.success(t("toast.MsgSentSuccess"));
      clearFields();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);

      setLoading(false);
    }
  };
  return (
    <div className="ContactUsLanding grid  grid-cols-2 lg:grid-cols-4  gap-4 p-8 lg:h-[95vh] overflow-hidden relative">
      <div className="form col-span-2 p-3 mt-10">
        <h2 className="text-purple-dark  text-2xl  font-bold my-1">
          {t("Get in touch")}
        </h2>
        <p className="text-lg font-normal text-gray-dark my-2">
          {t("We are here for you! How can we help?")}
        </p>
        <form
          action="submit"
          onSubmit={handleSubmit}
          className="form bg-white rounded-3xl  p-4  "
        >
          <div className="Name my-2">
            <UiInput
              type="text"
              id="name"
              label={t("yourName")}
              value={Name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className={`border border-solid ${
                fieldErrors.Name ? "border-red" : "border-purple"
              } focus:border focus:border-solid focus:border-purple`}
            />
          </div>
          <div className="Email my-2">
            <UiInput
              type="text"
              id="Email"
              label={t("Email")}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Email")}
              className="border border-solid  border-purple focus:border focus:border-solid  focus:border-purple"
            />
          </div>
          <div className="phone">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 font-jost text-base font-medium "
            >
              {t("Phone number")}
            </label>
            <div className=" flex relative">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Btn
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 items-center gap-2  ltr:rounded-r-none rtl:rounded-l-none border ltr:border-r-0 rtl:border-l-0 border-gray border-solid pl-3"
                  >
                    <img
                      src={flags.svg}
                      alt={name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {countryCallingCode}
                  </Btn>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {countries.map(
                    ({ name, flags, countryCallingCode }, index) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => setCountryIndex(index)}
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          {name}{" "}
                          <span className="ml-auto">{countryCallingCode}</span>
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
              <MaterialInput
                type="tel"
                value={Phone}
                onChange={handlePhoneChange}
                placeholder={t("Phone number")}
                className="ltr:rounded-l-none rtl:rounded-r-none border border-solid !border-gray focus:!border-gray"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
              />
            </div>
          </div>
          <div className="message">
            <label
              htmlFor="message"
              className="flex items-center gap-2 font-jost text-base font-medium "
            >
              {t("message")}
            </label>
            <textarea
              name="message"
              id="message"
              placeholder={t("Type something")}
              rows={6}
              required={true}
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              className={`   bg-white  w-full   rounded-xl border border-purple font-jost font-normal text-base  my-2 py-2 px-4  border-solid  focus:border   focus:border-purple  focus:border-solid`}
            />
          </div>

          {error && (
            <div className="text-center">
              <p className="error text-red">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 m-2">
            <Button type="submit" d>
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
      <div className="image col-span-2 flex flex-col  justify-center items-center">
        <img src={ContactUsImage} alt="contact us" width={450} height={450} />
        <div className="flex flex-col ">
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <CiLocationOn className="text-purple w-5 h-5" />
            </span>
            545 Mavis Island, IL 99191
          </p>
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <FiPhone className="text-purple w-5 h-5" />
            </span>
            +2034 4040 3030
          </p>
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <CiMail className="text-purple w-5 h-5" />
            </span>
            hello@gmail.com
          </p>
        </div>
      </div>
      <div className="social flex flex-col gap-3 bg-purple p-2 ltr:rounded-l-xl rtl:rounded-r-xl absolute ltr:right-0 rtl:left-0 bottom-20">
        <a href="#" target="_blank">
          <span className="">
            <FaFacebookF className="text-white " />
          </span>
        </a>
        <a href="#" target="_blank">
          <span className="">
            <FaInstagram className="text-white " />
          </span>
        </a>
        <a href="#" target="_blank">
          <span className="">
            <FaLinkedinIn className="text-white " />
          </span>
        </a>
        <a href="#" target="_blank">
          <span className="">
            <FaTwitter className="text-white " />
          </span>
        </a>
      </div>
    </div>
  );
};

export default ContactUsLanding;
