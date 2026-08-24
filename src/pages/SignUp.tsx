import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // 2. Initialize navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the browser's default full-page reload on submit
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // needed so the browser stores/sends the session cookie
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Signup succeeded — cookie is set, user is logged in.
      // Replace this with a redirect once routing is wired up, e.g.:
      // navigate("/dashboard");
      console.log("Signed up successfully:", data);
      navigate("/dashboard");
    } catch (err) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        <h3 className="text-center text-xl font-semibold pb-4">Sign-Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 pb-8">
            <label className="flex flex-col gap-2">
              First Name
              <input
                type="text"
                placeholder="Enter your first name"
                className="p-3 border rounded-lg border-gray-800"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 pb-8">
            <label className="flex flex-col gap-2">
              Last Name
              <input
                type="text"
                placeholder="Enter your last name"
                className="p-3 border rounded-lg border-gray-800"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 pb-8">
            <label className="flex flex-col gap-2">
              Email
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 border rounded-lg border-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              Password
              <input
                type="password"
                placeholder="Enter your password"
                className="p-3 border rounded-lg border-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center pt-4">{error}</p>
          )}

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex self-center align-bottom hover:bg-green-300 transition-colors cursor-pointer bg-green-600 py-3 px-16 font-bold border-2 rounded-lg border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
          <div className="pt-4 flex justify-center">
            <h6
              // Added cursor-pointer, hover effect, and the navigate function here
              className="text-[14px] cursor-pointer hover:underline text-gray-700"
              onClick={() => navigate("/signin")}
            >
              Already have an account? Click here to sign-in
            </h6>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
