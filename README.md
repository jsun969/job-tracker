<div align="center">

# 💼 Job Tracker 📊

A simple app to track job applications

</div>

## ✨ Features

- Track the different stages of your job applications with a timeline
- Organise your applications into categories (Upcoming, Ongoing, Offer, Closed)
- Take notes for each application and interview
- Set date and time easily with the timezone date-time picker
- Share your application details with others
- [Coming soon] Generate a sankey diagram to visualize your job application flow
- [Coming soon] View other cohorts' job application flow
- [Coming soon] Search your applications
- [Coming soon] Find job postings
- and more... [(Contribute your ideas!)](https://github.com/jsun969/job-tracker/pulls)

## 🛠️ Development

```sh
# Initialize environment variables
# (follow the comments in the file to set up the variables)
cp .env.example .env.local

# Install dependencies
pnpm i

# Initialize the database
pnpm db:push

# Seeding the database
# (kinda buggy, you can skip this)
pnpm db:seed

# Start the development server
pnpm dev

# Manage the database
# (you can also use the neon dashboard)
pnpm db:studio
```

## 🏗️ Tech Stack

| [React](https://react.dev/)                       | [TypeScript](https://www.typescriptlang.org/)   | [Next.js](https://nextjs.org/)           |
| ------------------------------------------------- | ----------------------------------------------- | ---------------------------------------- |
| [TailwindCSS](https://tailwindcss.com/)           | [shadcn/ui](https://ui.shadcn.com/)             | [Drizzle ORM](https://orm.drizzle.team/) |
| [Better Auth](https://www.better-auth.com/)       | [React Hook Form](https://react-hook-form.com/) | [Day.js](https://day.js.org/en/)         |
| [next-safe-action](https://next-safe-action.dev/) | [Valibot](https://valibot.dev/)                 | ...                                      |
