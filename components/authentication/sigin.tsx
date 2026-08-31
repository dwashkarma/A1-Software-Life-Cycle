// src/app/login/page.tsx

import Link from "next/link";

export default function SignInPage() {
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

      {/* Login SIDE */}
      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full  rounded-2xl border border-gray-200 bg-white p-14 shadow-sm grid gap-6">
          {/* Mobile Logo */}
          <h1 className=" text-lg text-center font-bold text-primary lg:hidden">
            TRAVELMATE
          </h1>
          <hr className="lg:hidden" />

          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome back
          </h2>

          <form className=" space-y-6">
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
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-2 focus:ring-[#078579]/20"
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
                type="password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-2 focus:ring-[#078579]/20"
              />
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-[#078579] text-sm font-semibold text-white transition hover:bg-primary"
            >
              Sign in
            </button>
          </form>

          {/* Reference text */}
          <p className=" text-xs text-gray-500">
            Roles: Traveller and Administrator
          </p>

          <p className="text-center text-sm">
            <span>Don't have an account?</span>{" "}
            <Link
              href={"/authentication/register"}
              className="font-semibold text-primary"
            >
              Creat an account
            </Link>
          </p>

          {/* Example error */}
          {/* <p className=" text-xs text-center text-red-600">Invalid email or password</p> */}
        </div>
      </section>
    </main>
  );
}
