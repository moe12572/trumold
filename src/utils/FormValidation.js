import * as Yup from "yup";
import { EMAIL_REGEX } from ".";
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("The email field is required"),
  password: Yup.string()
    .min(8, "The password must have at least 8 character")
    .required("The password field is required"),
});
const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name should be at least 2 character long")
    .max(70, "Too Long!")
    .required("The name field is required"),
  email: Yup.string()
  .email("Invalid email")
    .matches(
      EMAIL_REGEX,
      "Invalid email"
    )
    .required("The email field is required"),
  password: Yup.string()
    .min(8, "The password must have at least 8 character")
    .required("The password field is required"),
});
const informationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name should be at least 2 character long")
    .max(70, "Too Long!")
    .required("The name field is required"),
  age: Yup.number()
    .min(18, "You must be at least 18 years")
    .max(60, "You must be at most 60 years")
    .required("The age feild is required"),
  bio: Yup.string()
    .min(2, "Bio should be at least 2 character long")
    .max(300, "Too Long!")
    .required("The bio field is required"),
  phone: Yup.number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .min(8)
    .required("A phone number is required"),
  address: Yup.string()
    .min(2, "Address should be at least 2 character long")
    .required("The address field is required"),
});

const coachFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name should be at least 2 character long")
    .max(70, "Too Long!")
    .required("The name field is required"),
  age: Yup.number()
    .min(18, "You must be at least 18 years")
    .max(60, "You must be at most 60 years")
    .required("The age field is required"),
  bio: Yup.string()
    .min(2, "Bio should be at least 2 character long")
    .max(300, "Too Long!")
    .required("The bio field is required"),
  phone: Yup.number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .min(8)
    .required("A phone number is required"),
  address: Yup.string()
    .min(2, "Address should be at least 2 character long")
    .required("The address field is required"),
  experience: Yup.string()
    .min(0, "For example 3 Years")
    .max(100, "For example 3 Years")
    .required("The experience field is required"),
  hourly_rate: Yup.string()
    .min(2, "Hourly rate should be at least 2 character long")
    .max(70, "Too Long!")
    .required("The hourly rate field is required"),
});

const changePasswordSchema = Yup.object().shape({
  password: Yup.string().required("The password field is required"),
  newPassword: Yup.string()
    .required("The new password field is required")
    .min(8, "The password must have at least 8 character"),
  confirmNewPassword: Yup.string()
    .required("The confirm password field is required")
    .when("newPassword", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "New and Confirm password should be same"
      ),
    }),
});

export {
  loginSchema,
  signupSchema,
  informationSchema,
  changePasswordSchema,
  coachFormSchema,
};
