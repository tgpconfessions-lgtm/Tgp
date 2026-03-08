Create a minimal anonymous confession website called “TGP Confessions” that will be deployed on tgpconfessions.vercel.app.

The website should allow users to submit anonymous confessions. The site must be simple and focused only on confession submission, similar to confessout.com, but with a modern UI and basic statistics.

MAIN PAGE DESIGN

The homepage should contain:

• Title: TGP Confessions
• Subtitle: Share your confession anonymously

Form fields:
• Input field: Name (Only visible to admin)
• Large textarea: Write your confession
• Button: Submit Confession

After the form, show a statistics section displaying:

• Total Confessions Submitted
• Total Visitors to the Website

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

FUNCTIONALITY

When a user submits a confession:

Send the data to backend endpoint /api/confess.

Store both name and confession.

After submission:

Clear the form.

Display a message:

“✅ Thank you for your confession. Your message has been sent anonymously.”

Admin visibility:

The name should only be visible to the admin.

The public website must never show the name.

Admin should be able to view submissions through logs or a protected admin route.

STATISTICS FEATURE

The website should track and display:

Total Confessions Submitted

Increase by 1 whenever a confession is submitted.

Total Visitors

Increase when a unique user visits the site.

Display both numbers on the homepage under the form.

DESIGN REQUIREMENTS

Use a modern dark theme:

Background: #0f172a
Card color: #1e293b
Accent button: #ff2e63
Text: white

UI requirements:
• Centered card layout
• Rounded inputs and buttons
• Smooth hover effects
• Mobile responsive design

PROJECT STRUCTURE

tgpconfessions

index.html
style.css
script.js
/api/confess.js
/api/stats.js

TECH STACK

Frontend: HTML, CSS, JavaScript
Backend: Serverless API functions compatible with Vercel deployment.

The final website should be clean, fast, mobile-friendly, and focused on anonymous confession submission while showing real-time statistics for total confessions and visitors.