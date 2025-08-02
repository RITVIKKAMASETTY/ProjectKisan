import { useState } from "react";
import useLogin from "./useLogin"; // Make sure you import your login hook
import SpinnerMini from "../ui/SpinnerMini"; // Assuming this is your spinner component

function Loginform() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10"
    >
      {/* Email field */}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          placeholder="email"
          disabled={isPending}
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Password field */}
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          placeholder="password"
          disabled={isPending}
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit button */}
      <div className="flex flex-col">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {!isPending ? "Log in" : <SpinnerMini />}
        </button>
      </div>
    </form>
  );
}

export default Loginform;
