Create a minimal anonymous confession website called “TGP Confessions” that will be deployed on tgpconfessions.vercel.app.

The website should allow users to submit anonymous confessions. The site must be simple and focused only on confession submission, similar to confessout.com, but with a modern UI, basic statistics, and a secure admin dashboard.

MAIN PAGE DESIGN

The homepage should contain:

• Title: TGP Confessions
• Subtitle: Share your confession anonymously

Form fields:

• Input field: Name (Only visible to admin)
• Large textarea: Write your confession
• Button: Submit Confession

After the form, display a statistics section showing:

• Total Confessions Submitted
• Total Visitors

Example layout:

TGP Confessions
Share your confession anonymously

Name (Only admin can see)
[ input field ]

Write your confession
[ textarea ]

[ Submit Confession ]

Total Confessions Submitted: 124
Total Visitors: 892

FORM FUNCTIONALITY

When a user submits the form:

Send the data to a backend endpoint /api/confess.

Store both name and confession in the database.

Increase the confession counter by 1.

Clear the form fields.

After submission show the message:

“✅ Thank you for your confession. Your message has been sent anonymously.”

ADMIN LOGIN SYSTEM

Create a secure Admin Login Page.

Admin login page should contain:

Admin Username
Admin Password
[ Login ]

After login, redirect to Admin Dashboard.

Only the admin can access this dashboard.

ADMIN DASHBOARD FEATURES

The dashboard should show a table of submitted confessions containing:

• Name (visible only to admin)
• Confession message
• Date and time submitted

Admin should also be able to:

• Delete confessions
• Mark confessions as reviewed

Regular users must never see any submitted confessions.

STATISTICS SYSTEM

Track and display:

Total Confessions Submitted

Total Website Visitors

Visitor count should increase whenever someone visits the homepage.

Show both statistics on the homepage.

DESIGN REQUIREMENTS

Use a modern dark UI theme.

Background: #0f172a
Card background: #1e293b
Accent button: #ff2e63
Text color: white

Design style:

• Centered layout
• Rounded inputs and buttons
• Clean minimal UI
• Smooth hover animations
• Mobile responsive

PROJECT STRUCTURE

tgpconfessions

index.html
style.css
script.js

/admin
login.html
dashboard.html

/api
confess.js
stats.js
admin.js

TECH STACK

Frontend: HTML, CSS, JavaScript
Backend: Serverless API functions
Deployment: Compatible with Vercel

The final website should be fast, mobile-friendly, secure, and focused on anonymous confession submission while providing an admin-only dashboard and live site statistics.