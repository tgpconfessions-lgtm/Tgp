Build a minimal anonymous confession website called “TGP Confessions” that will be deployed on tgpconfessions.vercel.app.

The purpose of the website is to allow students to submit anonymous confessions. The site should work similarly to confessout.com but much simpler: users can only submit confessions and cannot see other submissions.

Core requirements:

Single-page submission website

Title at the top: TGP Confessions

Subtitle: Share your confession anonymously

Input field: Name (Only visible to admin)

Large textarea: Write your confession

Button: Submit Confession

Functionality

When a user submits the form, send the data to a backend API endpoint /api/confess.

Store both name and confession in the backend.

The name must only be visible to the admin, never shown publicly.

The website should not display a public confession feed.

Admin access

The admin should be able to view submissions (name + confession) through logs or a protected admin endpoint.

Regular visitors cannot access or view any confessions.

Design

Modern dark theme UI.

Background color: #0f172a

Card background: #1e293b

Accent button color: #ff2e63

Rounded inputs and buttons.

Centered layout with a confession card.

Mobile responsive.

User experience

After submitting, display the message: “Confession sent anonymously!”

Clear the form after submission.

Tech stack

Frontend: HTML + CSS + JavaScript.

Backend: Serverless API /api/confess.

Compatible with Vercel deployment.

Project structure

tgpconfessions

index.html

style.css

/api/confess.js

The final result should be a clean, fast, and simple anonymous confession submission site.