# Study Compass

Build a clean, modern web application for the "Learning Disability Detector and Classifier System" with the following exact scope only:

1. Landing Page

- Professional, calm, and accessible design

- Project name: Learning Disability Detector and Classifier System

- Short clear description: "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support. This is not a formal diagnosis tool."

- Prominent call-to-action buttons to enter the three roles

- Clean footer with a small disclaimer: "This system provides screening indicators only and does not replace professional assessment."

2. Role Selection / Entry

After the landing page, the user can choose one of exactly three roles:

- Student

- DUT Disability Unit / Support Staff

- System Administrator

3. Simulated Dashboards Only

Create a simple simulated dashboard for each role. These must be static/mock dashboards with fake data only. Do not build real functionality.

Student Dashboard (simulated):

- Welcome message

- Cards showing: Available Assessments, My Results, Recommended Exercises, Support Information

- Fake sample results (e.g. Reading: Moderate, Mathematics: Needs Attention, etc.)

- Clear disclaimer that results are screening indicators only

DUT Disability Unit / Support Staff Dashboard (simulated):

- Overview cards: Students Screened, Flagged for Support, Pending Referrals

- Simple table with fake student names/numbers and status

- Buttons that do nothing (or show a toast “Simulated action”)

System Administrator Dashboard (simulated):

- Overview cards: Total Users, Active Assessments, Content Items

- Sections for: Manage Users, Manage Assessments, Manage Exercises & Support Content

- All buttons are non-functional (simulated only)

Strict Rules:

- Do NOT create any real authentication, registration, or login system

- Do NOT create actual assessment questions or scoring logic

- Do NOT create any forms that save data

- Do NOT create more pages or features beyond the landing page + 3 role dashboards

- Keep everything simulated and visual only

- Use a clean, professional, accessible design with good contrast

- Mobile responsive

- Soft, calming color palette suitable for an educational/support tool

Only build the landing page and the three simulated role dashboards. Nothing else.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bb2c270b-3f11-4c14-a181-20f8cbf24dc3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
