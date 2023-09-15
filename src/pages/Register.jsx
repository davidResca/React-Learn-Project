import { useState } from "react";
import { register } from "../config/firebase";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { user } = useUserContext();

  useRedirectActiveUser(user, "/dashboard");

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const credentialUser = await register({ email, password });
      console.log(credentialUser);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrors({ email: "Usuario no registrado" });
      }
      if (error.code === "auth/wrong-password") {
        setErrors({ password: "Password incorrecta" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("invalid email").required("Required field"),
    password: Yup.string()
      .trim()
      .min(6, "6 char min")
      .required("Pass required"),
  });

  return (
    <>
      <h1>Register</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          handleBlur,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={values.email}
              placeholder="email"
              onChange={handleChange}
              name="email"
            />
            {errors.email && touched.email && errors.email}
            <input
              type="password"
              value={values.password}
              placeholder="password"
              onChange={handleChange}
              name="password"
            />
            {errors.password && touched.password && errors.password}
            <button disabled={isSubmitting}>Register</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Register;
