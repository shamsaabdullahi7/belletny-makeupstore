import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await register(form);
      navigate("/");
    } catch {
      // Error message is handled by AuthContext.
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md border border-ink/10 bg-porcelain p-6 sm:p-8">
        <p className="eyebrow">Concierge</p>
        <h1 className="mt-3 font-display text-4xl">Create account</h1>
        {error && <p className="mt-4 bg-rose/10 p-3 text-sm text-rose">{error}</p>}
        <label className="mt-6 block">
          <span className="luxury-label">Name</span>
          <input className="luxury-field mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="mt-4 block">
          <span className="luxury-label">Email</span>
          <input className="luxury-field mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="mt-4 block">
          <span className="luxury-label">Password</span>
          <input className="luxury-field mt-2" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <Button className="mt-6 w-full" type="submit" disabled={loading}>
          {loading ? "Creating" : "Register"}
        </Button>
        <p className="mt-5 text-center text-sm text-ink/60">
          Already registered? <Link to="/login" className="font-semibold text-rose">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
