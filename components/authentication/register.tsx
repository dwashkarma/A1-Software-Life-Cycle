import React from "react";
import Link from "next/link";

function RegisterComponent() {
  return (
    <main className="min-h-screen bg-gray-50 lg:flex">
      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full  rounded-2xl border border-gray-200 bg-white p-14 shadow-sm grid gap-6">
          {/* Mobile Logo */}
          <h1 className=" text-xl text-center font-bold text-primary lg:hidden">
            TRAVELMATE
          </h1>
          <hr className="lg:hidden" />

          <h2 className="text-3xl text-center font-bold text-gray-900">
            Create your account
          </h2>

          <form className=" space-y-5">
            {/* Full Name */}
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
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
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
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
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
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Confirm Password */}
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
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Create Account */}
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary"
            >
              Create account
            </button>
          </form>

          {/* Login Link */}
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
