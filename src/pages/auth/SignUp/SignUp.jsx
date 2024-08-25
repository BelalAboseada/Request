import { Link, useNavigate } from "react-router-dom";
import Button from "../../../Components/UI/Button/Button";
import SignUpImg from "../../../assets/images/SignUp.png";
import Input from "../../../Components/UI/Input/Input";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import Google from "../../../assets/images/Google.png";
import Apple from "../../../assets/images/Apple.png";
import Facebook from "../../../assets/images/Facebook.png";
import "./style.scss";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setPassword,
  setName,
  setPhone,
  startSignUp,
  finishSignUp,
  setError,
} from "../../../redux/slices/authSlice";
import { useState } from "react";
import Loader from "../../../Components/Loader/Loader";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import countries from "react-select-country-list";
import { TbUserEdit } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";

const SignUp = () => {
  const dispatch = useDispatch();
  const { email, password, name, phone, isLoadingSignUp, error } = useSelector(
    (state) => state.auth
  );
  const [country, setCountry] = useState({
    value: "SA",
    label: "Saudi Arabia",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    if (confirmPasswordValue !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    dispatch(startSignUp());

    try {
      const userData = { email, password, name, phone };
      dispatch(finishSignUp());
      dispatch(setError(""));
      navigate("/SignUp/ChooseRole", { state: userData });
    } catch (err) {
      dispatch(finishSignUp());
      dispatch(setError(err.message || "Sign-up failed"));
    }
  };
  console.log(countries());

  const countryOptions = countries()
    .getData()
    .map((country) => ({
      value: country.value,
      label: `${country.label}`,
    }));
const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "40%",
    borderRadius: "1.5rem",
    margin: "0.5rem 1rem",
    position: "absolute",
    zIndex: "99",
    right: "0",
    backgroundColor: "#EAF0F7",
  }),
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    backgroundColor: "#EAF0F7",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    font: "jost",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-10px)",
    transition: "opacity 200ms ease, transform 200ms ease",
    ".react-select__menu-list": {
      opacity: 1,
      transform: "translateY(0)",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    borderRadius: "0.5rem",
    overflow: "auto",
    overflowX: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    cursor:"pointer",
    borderRadius : state.isSelected ? ".25rem" : "0", 
    background: state.isSelected ? "var(--linear1)" : "#EAF0F7   ",
    color: state.isSelected ? "#ffffff" : "#000000",
    "&:hover": {
      background: state.isSelected ? "var(--linear1)" : "#f0f0f0",
    },
  }),
};


  return (
    <div className="LogIn h-screen relative effect overflow-hidden ">
      {isLoadingSignUp ? (
        <div className="flex items-center justify-center">
          {" "}
          <Loader />
        </div>
      ) : (
        <>
          <AuthHeader />
          <div className="Wrapper flex items-center justify-between">
            <div className="w-96 my-40">
              <h3 className="font-workSans font-bold text-5xl">
                {t("sign in To activate your business easily")}
              </h3>
              <p className="font-jost font-medium text-2xl">
                {t("if you don’t have an account you can")}
                <Link className="text-blue block">{t("Register here!")}</Link>
              </p>
            </div>
            <div className="LogIn_Image flex justify-center -z-10">
              <img
                src={SignUpImg}
                className="mb-40"
                alt="image"
                width={400}
                height={400}
                loading="lazy"
              />
            </div>
            <div className="form flex flex-col mt-14">
              <form onSubmit={handleSubmit}>
                <div className="name">
                  <Input
                    placeholder={"Your Name "}
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => dispatch(setName(e.target.value))}
                    autoFocus
                    label={t("yourName")}
                    labelIcon={<TbUserEdit />}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="email">
                  <Input
                    placeholder="name@email.com"
                    type="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    labelIcon={<CiMail />}
                    label={t("enter email")}
                  />
                </div>
                <div className="phone relative">
                  <label className="Input_label flex items-center  gap-2 font-jost text-base font-medium ">
                    <span className="label_icon w-4 h-4 ">
                      <FiPhone />
                    </span>
                    {t("PhoneNumber")}
                  </label>
                  <div className="input flex items-center my-2  ">
                    <PhoneInput
                      international
                      defaultCountry={country.value}
                      country={country.value}
                      onChange={(value) => {
                        dispatch(setPhone(value));
                      }}
                      value={phone}
                      placeholder={"+96244679900"}
                      className="Input font-jost font-normal text-base py-2 !relative px-4 w-full "
                    />
                    <Select
                      options={countryOptions}
                      value={country}
                      onChange={(option) => setCountry(option)}
                      className=" "
                      styles={customStyles}
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div className="password">
                  <Input
                    type="password"
                    placeholder={"••••••••"}
                    className="placeholder:font-normal placeholder:text-xl placeholder:font-inter"
                    id="password"
                    autoComplete="password"
                    required
                    value={password}
                    label={t("Enter password")}
                    labelIcon={<MdLockOutline />}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    minLength={8}
                    inputIcons={[
                      {
                        element: <FaRegEyeSlash className="text-gold" />,
                        type: "visibility",
                      },
                      {
                        element: <FaEye />,
                        type: "visibility",
                      },
                    ]}
                  />
                </div>
                <div className="confirmPassword">
                  <label
                    htmlFor="confirmPassword"
                    className="font-inter confirmPassword_label  font-normal text-xs absolute z-10 mx-2 bg-white p-1 rounded-3xl text-purple-dark "
                  >
                    {t("confirm password")}
                  </label>
                  <Input
                    placeholder={"••••••••"}
                    type="password"
                    id="confirmPassword"
                    autoComplete="password"
                    className="confirmPassword_input border-purple-dark border focus:!border  relative placeholder:font-normal placeholder:text-xl placeholder:font-inter"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    minLength={8}
                    inputIcons={[
                      {
                        element: <FaRegEyeSlash className="text-gold" />,
                        type: "visibility",
                      },
                      {
                        element: <FaEye />,
                        type: "visibility",
                      },
                    ]}
                  />
                </div>
                {passwordError && (
                  <div className="text-center">
                    <p className="text-red">{passwordError}</p>
                  </div>
                )}
                <Button className="mt-5 w-full" onClick={handleSubmit}>
                  {t("Register")}
                </Button>
                {error && (
                  <div className="text-center">
                    <p className="text-red">{error}</p>
                  </div>
                )}
              </form>
              <hr className="my-4" />
              <div className="flex items-center justify-between mt-4 gap-4">
                <div className="box_Google">
                  <img src={Google} alt="Google" width={23} height={28} />
                </div>
                <div className="box_Apple">
                  <img src={Apple} alt="Apple" width={23} height={28} />
                </div>
                <div className="box_Facebook">
                  <img src={Facebook} alt="Facebook" width={23} height={28} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;