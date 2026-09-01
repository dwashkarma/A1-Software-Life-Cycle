"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      const user = result.user;
      if (user) {
        localStorage.setItem("travelMateUser", JSON.stringify(user));
        window.dispatchEvent(new Event("travelmate-auth-change"));
      }

      const role = result.user?.role;
      router.push(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 lg:flex">
      <section className="relative hidden min-h-screen w-[56%] overflow-hidden bg-primary p-14 text-white lg:block">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-orange">
          TRAVELMATE
        </h1>
        <div className="mt-28 max-w-xl">
          <h2 className="text-5xl font-bold leading-tight text-secondary">
            Plan less.
            <br />
            Experience more.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-secondary">
            Build a simple itinerary, discover attractions and keep your trip
            organised in one place.
          </p>
          <b className="font-semibold text-lg text-orange">
            Plan your Journey with Travel Mate
          </b>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-14 shadow-sm grid gap-6">
          <h1 className="text-lg text-center font-bold text-primary lg:hidden">
            TRAVELMATE
          </h1>
          <hr className="lg:hidden" />

          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome back
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-2 focus:ring-[#078579]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-2 focus:ring-[#078579]/20"
              />
            </div>

            {error ? (
              <p className="text-xs text-center text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-[#078579] text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-gray-500">
            Roles: Traveller and Administrator
          </p>

          <p className="text-center text-sm">
            <span>Don't have an account?</span>{" "}
            <Link
              href="/authentication/register"
              className="font-semibold text-primary"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
