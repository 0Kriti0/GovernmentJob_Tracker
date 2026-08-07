"""
alert.py
Turns "jobs closing soon" (popped from the MinHeap) into alerts.

Two free delivery options:
  1. console_alert()  -- always works, no setup.
  2. send_email_alert() -- free via Gmail SMTP + an "App Password"
     (Google Account > Security > 2-Step Verification > App Passwords).
     Put your address + app password in env vars, never hardcode them:
         export GJT_EMAIL="you@gmail.com"
         export GJT_EMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
"""
import os
import smtplib
import ssl
from email.mime.text import MIMEText


def console_alert(jobs):
    if not jobs:
        print("\nNo jobs closing soon. You're all caught up.\n")
        return
    print(f"\n=== {len(jobs)} DEADLINE ALERT(S) ===")
    for job in jobs:
        print(f"- {job.title} ({job.department}) closes in {job.days_left()} day(s) "
              f"on {job.deadline}. Apply: {job.apply_link}")
    print()


def send_email_alert(to_email, jobs, from_email=None, app_password=None):
    """
    Sends one summary email listing all due alerts. Returns True/False.
    Reads credentials from env vars if not passed explicitly.
    """
    if not jobs:
        return False

    from_email = from_email or os.environ.get("GJT_EMAIL")
    app_password = app_password or os.environ.get("GJT_EMAIL_APP_PASSWORD")
    if not from_email or not app_password:
        print("Email not sent: set GJT_EMAIL and GJT_EMAIL_APP_PASSWORD env vars first.")
        return False

    lines = [f"{j.title} ({j.department}) - closes {j.deadline} "
             f"({j.days_left()} days left)\nApply: {j.apply_link}\n" for j in jobs]
    body = "Government Job Tracker - Deadline Alerts\n\n" + "\n".join(lines)

    msg = MIMEText(body)
    msg["Subject"] = f"[Job Tracker] {len(jobs)} deadline alert(s)"
    msg["From"] = from_email
    msg["To"] = to_email

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(from_email, app_password)
            server.sendmail(from_email, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
