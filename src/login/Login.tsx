export type Token = {
  type: string,
  token: string,
  expires_at: string;
};

export const getId = async () => {
  let id = await fetch(`${baseUrl}/api/auth/mi_id`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!id.ok) {
    throw new Error("Error getting id");
  }
  let resp = await id.json();
  return resp.id;
};


export const auth = async ({ usuario, password }: { usuario: String, password: String; }) => {
  let token = await fetch(`${baseUrl}/api/auth/login`, { //Change IP according to your server
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario, password
    }),
  });
  if (!token.ok) {
    throw new Error("Invalid credentials");
  }
  let ntoken = await token.json() as Token;
  localStorage.setItem("token", ntoken.token);
  localStorage.setItem("expiration", ntoken.expires_at);
  return ntoken.token;
};
import { useFormik } from "formik";
import { isAuth } from "../App";
import { baseUrl } from "../main";

export default function Login() {
  let formik = useFormik({
    initialValues: {
      usuario: "",
      password: "",
      error: ""
    },
    onSubmit: async (values) => {
      try {
        await auth(values);
        window.location.href = "/";
      } catch (error) {
        let errors = error as { message: string; };
        formik.setFieldValue("error", errors.message);
      }
    },
  });
  if (isAuth()) {
    window.location.href = "/";
    return <h2>Redireccionando a Home</h2>;
  }
  return (
    <div className="bg-green-300 w-screen h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Usuario
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="usuario"
                onChange={formik.handleChange}
                value={formik.values.usuario}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>
            <div className="mb-4">
              <label className="block text-red-700 text-sm font-bold mb-2">
                {formik.values.error}
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}