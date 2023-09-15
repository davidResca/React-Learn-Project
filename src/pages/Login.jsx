import { login } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { user } = useUserContext();

  useRedirectActiveUser(user, "/dashboard");

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, resetForm }
  ) => {
    console.log(email, password);
    try {
      const credentialUser = await login({ email, password });
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
    email: Yup.string().email("Email no válido").required("Email required"),
    password: Yup.string()
      .trim()
      .min(6, "6 char min")
      .required("Password required"),
  });

  return (
    <>
      <h1>Login</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleSubmit,
          handleChange,
          errors,
          touched,
          handleBlur,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="email"
              value={values.email}
              onChange={handleChange}
              name="email"
              onBlur={handleBlur}
            />
            {errors.email && touched.email && errors.email}
            <input
              type="password"
              placeholder="password"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
