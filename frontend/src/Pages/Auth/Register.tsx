import GuestLayout from "../../Layouts/GuestLayout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../Components/Button";
import { authRoutes, routes } from "../../routes";
import axios from "axios";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await axios.get("/sanctum/csrf-cookie");

    await axios
      .post("/api/register", data)
      .then(() => {
        navigate(routes.dashboard);
      })
      .catch((error) => {
        if (error.response.data.errors && error.response.status === 422) {
          Object.entries(error.response.data.errors).forEach((err) => {
            setError(err[0] as keyof FormData, {
              type: "manual",
              message: err[1] as string,
            });
          });
        }
      });
  };

  return (
    <GuestLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name Field is required!" })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email Field is required!" })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password Field is required!",
              })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Register
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={authRoutes.login}
              className="text-green-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Register;
