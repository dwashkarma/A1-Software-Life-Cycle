Travel Mate

Travel Mate is a trip-planning web application built with Next.js, React, TypeScript, and MongoDB. Travellers can discover Australian destinations and attractions, then organise places into dated itineraries. Administrators can manage the attraction catalogue.

## Features

- Register and sign in as a traveller or administrator.
- Browse and search destinations and attractions.
- View destination and attraction details.
- Create itineraries with a destination and travel dates, then add attractions and manage trips.
- Use the admin dashboard to review catalogue counts and create, edit, or remove attractions.
- Store users, destinations, attractions, and itineraries in MongoDB.

## Assignment 2

Assignment 2 extends Travel Mate with content lifecycle management, personalised recommendations, weather information, and automated tests.

### Admin content lifecycle

- Administrators can manage attraction and destination catalogue content.
- Attractions and destinations have one of three lifecycle statuses: `DRAFT`, `PUBLISHED`, or `ARCHIVED`. New records default to `DRAFT`.
- Admins can publish draft content and archive draft or published content. Invalid transitions are rejected.
- Traveller-facing discovery and detail pages show published content, keeping draft and archived items out of public listings.
- Lifecycle changes are handled by API routes and restricted to administrators.

### OOP and design patterns

- **State pattern:** The content lifecycle uses a `ContentContext` with `DraftState`, `PublishState`, and `ArchivedState` implementations. The current state determines which lifecycle operations are valid.
- **Strategy pattern:** The recommendation feature separates recommendation behavior into interchangeable strategies.
- **Adapter pattern:** The weather feature adapts the external weather provider to the application's weather service interface.

### Personalised recommendations and weather

- Travellers can save and update preferences used to produce attraction recommendations.
- Recommendation results respect published-content visibility and provide an empty state when there are no matches.
- Weather information is retrieved through the weather service/provider abstraction and displayed for a selected destination.

### Automated tests

Tests use Mocha, Chai, and Sinon, with `tsx` to run TypeScript tests. The test dependencies are declared in `devDependencies`; `package-lock.json` records their resolved versions.

Run the full test suite with:

```bash
npm test
```

Current tests cover lifecycle state transitions and attraction lifecycle API authorization/input validation, alongside weather functional and fuzz tests. The lifecycle API tests do not write to MongoDB. `test/setup.ts` sets a local test-only MongoDB URI for modules that require the environment variable during import; it does not start a database.

## Requirements

- Node.js 20.9 or newer and npm.
- A MongoDB instance, either local or hosted (for example, MongoDB Atlas).

## Run Locally

1. Install dependencies from the project directory:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set the MongoDB connection string:

   ```dotenv
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   ```

   For MongoDB Atlas, use the connection string provided for your cluster instead. Keep credentials private: do not commit `.env.local` or paste database passwords into source files.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). To check the database connection, visit [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db); it should return a successful MongoDB connection response.

Stop the server with `Ctrl+C` in the terminal.

## Main User Flows

### Traveller

1. Create an account at `/authentication/register` and sign in at `/authentication/login`.
2. Browse `/explore` and open a destination or attraction to see its details.
3. Create a trip at `/itineraries/create`, choosing its destination and dates.
4. Add attractions to the itinerary, then review and manage trips from `/itineraries` or the home dashboard.

### Administrator

1. Sign in with an administrator account to open `/admin/dashboard`.
2. Use `/admin/attractions` to manage the attraction catalogue or `/admin/attractions/create` to add an attraction.
3. Open an attraction's edit page to update its details. Admin itinerary editing is available under `/admin/itineraries/[id]/edit`.

> **Development security note:** The current registration flow allows a user to select the administrator role. This is suitable only for the current development/assignment setup and must be restricted before deploying the application for real users. Do not rely on the current role selection as production access control.

## Project Structure

| Path          | Purpose                                                                    |
| ------------- | -------------------------------------------------------------------------- |
| `app/`        | Next.js pages, layouts, and API route handlers                             |
| `app/api/`    | Authentication, destination, attraction, itinerary, and database endpoints |
| `components/` | Shared interface components and feature-specific forms                     |
| `lib/`        | MongoDB connection and session helpers                                     |
| `models/`     | Mongoose schemas and models                                                |
| `public/`     | Static assets such as destination and attraction images                    |

## API Overview

### Authentication

| Method and endpoint     | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `POST /api/auth/signup` | Register an account                     |
| `POST /api/auth/login`  | Sign in and set the session cookie      |
| `POST /api/auth/logout` | End the current session                 |
| `GET /api/auth/me`      | Read the current user's session details |

### Admin content management

| Method and endpoint                            | Purpose                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/attractions`                         | List attractions with their destination data                            |
| `POST /api/attractions`                        | Create an attraction (admin only)                                        |
| `GET /api/attractions/[id]`                    | Read an attraction and its destination                                  |
| `PUT /api/attractions/[id]`                    | Update an attraction (admin only)                                        |
| `DELETE /api/attractions/[id]`                 | Delete an attraction (admin only)                                        |
| `PATCH /api/attractions/[id]/status`            | Publish or archive an attraction (admin only; lifecycle rules apply)     |
| `GET /api/destinations`                         | List destinations                                                       |
| `POST /api/destinations`                        | Create a destination (admin only)                                        |
| `DELETE /api/destinations/[id]`                 | Delete a destination (admin only; blocked while it has attractions)       |
| `PATCH /api/destinations/[id]/status`            | Publish or archive a destination (admin only; lifecycle rules apply)     |
| `DELETE /api/destinations/[id]/status`           | Delete a destination (admin only)                                        |

### Recommendations and preferences

| Method and endpoint                       | Purpose                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `GET /api/attractions/categories`          | List categories from published attractions for preference selection    |
| `GET /api/preferences`                    | Read the signed-in user's saved travel preferences                      |
| `PUT /api/preferences`                    | Save or skip preference setup for the signed-in user                    |
| `GET /api/recommendations`                | Get recommendations based on the signed-in user's saved preferences    |

### Weather

| Method and endpoint                              | Purpose                                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `GET /api/weather?destination=<destination-name>` | Fetch weather for a destination through the weather adapter |

### Itineraries and diagnostics

| Method and endpoint                            | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `GET /api/itineraries`                         | List the signed-in user's itineraries        |
| `POST /api/itineraries`                        | Create an itinerary                          |
| `GET /api/itineraries/[id]`                    | Read an itinerary owned by the signed-in user |
| `PUT /api/itineraries/[id]`                    | Update an itinerary owned by the signed-in user |
| `DELETE /api/itineraries/[id]`                 | Delete an itinerary owned by the signed-in user |
| `POST /api/itineraries/[id]/attractions`       | Add an attraction to an itinerary             |
| `DELETE /api/itineraries/[id]/attractions`      | Remove an attraction from an itinerary        |
| `GET /api/test-db`                             | Check MongoDB connectivity                     |
| `GET /api/seed`                                 | Seed sample data (destructive; see warning below) |

## Useful Commands

| Command         | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `npm run dev`   | Start the local development server                             |
| `npm run lint`  | Run ESLint                                                     |
| `npm test`      | Run all Mocha tests                                             |
| `npm run build` | Create a production build                                      |
| `npm run start` | Serve the production build locally (run `npm run build` first) |

## Team Workflow

1. Pull the latest shared changes before starting work and install dependencies if `package.json` has changed.
2. Create a focused branch for your task and keep changes limited to the relevant page, component, API route, or model.
3. Run `npm run lint` before sharing your changes. For changes that affect production compilation, also run `npm run build`.
4. Never commit `.env.local`, database credentials, or real user data. Coordinate schema changes with teammates because pages and API routes share the Mongoose models in `models/`.
5. Describe the change and any manual testing or migration steps in your pull request.

## Database Seed Warning

`GET /api/seed` clears existing destinations, attractions, users, and itineraries before inserting sample records. Only use it with a disposable development database after confirming that you are connected to the right database. The inserted sample user passwords are placeholders and are not valid bcrypt login credentials.

## Troubleshooting

- **MongoDB connection error:** Confirm `.env.local` exists, `MONGODB_URI` is correct, and your local MongoDB service or Atlas cluster is reachable. Restart the dev server after changing environment variables.
- **Protected page redirects to login:** Sign in first; dashboard, itinerary, destination, attraction, and admin sections require a session. Admin pages require an administrator role.
- **Session cookie behind a proxy:** Login marks the session cookie `Secure` when the request uses HTTPS or the proxy forwards `X-Forwarded-Proto: https`. Plain HTTP requests receive a cookie without `Secure`, so use HTTPS for public deployments; unencrypted HTTP can expose sessions.
- **Lint or build errors:** Run `npm run lint` or `npm run build` and address the first reported error before investigating follow-on failures.
  This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
