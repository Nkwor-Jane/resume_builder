// validationSchema.js
import * as Yup from "yup";

export const resumeSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  summary: Yup.string().min(30, "Too short").required("Summary is required"),
  skills: Yup.string().required("Skills are required"),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required("Degree is required"),
      school: Yup.string().required("School is required"),
      startYear: Yup.string().required("Start year is required"),
      endYear: Yup.string().required("End year is required"),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      company: Yup.string().required("Company is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().required("End date is required"),
      responsibilities: Yup.string().required("Responsibilities required"),
    })
  ),
});
