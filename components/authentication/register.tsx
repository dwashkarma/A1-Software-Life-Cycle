"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "traveller",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      router.push("/authentication/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 lg:flex">
      <section className="relative hidden min-h-screen w-[50%] overflow-hidden bg-primary p-14 text-white lg:block">
        <h1 className="text-4xl uppercase font-bold tracking-wide text-orange">
          TRAVEL MATE
        </h1>

        <div className="mt-28 max-w-xl">
          <h2 className="text-5xl font-bold leading-tight">
            Start planning
            <br />
            your next trip.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-300">
            Create an account, discover destinations and organise your favourite
            attractions into one simple itinerary.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-14 shadow-sm grid gap-6">
          <h1 className="text-xl text-center font-bold text-primary lg:hidden">
            TRAVELMATE
          </h1>
          <hr className="lg:hidden" />

          <h2 className="text-3xl text-center font-bold text-gray-900">
            Create your account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

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
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-gray-800">
                Choose your role
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary/40 hover:bg-primary/5">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleChange}
                    className="h-4 w-4 accent-primary"
                  />
                  Administrator
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary/40 hover:bg-primary/5">
                  <input
                    type="radio"
                    name="role"
                    value="traveller"
                    checked={formData.role === "traveller"}
                    onChange={handleChange}
                    className="h-4 w-4 accent-primary"
                  />
                  Traveller
                </label>
              </div>
            </fieldset>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-[#078579] text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/authentication/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterComponent;
