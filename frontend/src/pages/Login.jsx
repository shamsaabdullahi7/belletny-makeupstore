import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(form);
      navigate("/shop");
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-ink/10 bg-porcelain p-6 sm:p-8 rounded-lg shadow-sm"
      >
        <p className="eyebrow">Account</p>

        <h1 className="mt-3 font-display text-4xl">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-ink/60">
          Sign in to continue shopping luxury beauty products.
        </p>

        {error && (
          <p className="mt-4 rounded bg-rose/10 p-3 text-sm text-rose">
            {error}
          </p>
        )}

        <label className="mt-6 block">
          <span className="luxury-label">Email</span>

          <input
            className="luxury-field mt-2"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />
        </label>

        <label className="mt-5 block">
          <div className="flex items-center justify-between">
            <span className="luxury-label">Password</span>

            <Link
              to="/forgot-password"
              className="text-sm text-rose hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <input
            className="luxury-field mt-2"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />
        </label>

        <Button
          className="mt-8 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Log In"}
        </Button>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to Belletny?{" "}
          <Link
            to="/register"
            className="font-semibold text-rose hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;