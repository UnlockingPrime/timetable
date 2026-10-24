# Semester

My timetable and end-semester exams in one minimal app. It installs on Android like a normal app, works offline and also runs as a website on a laptop.

## What's inside

- **Today.** The lectures for one day, with a live "now" line, the free time between lectures, and a status card that shows the current lecture, the next one and the next exam. Use the day chips to look at any other weekday.
- **Week.** The whole week as a timetable grid. Tap a block to open that day.
- **Exams.** A live countdown to the next exam, a strip showing the exam fortnight, and every exam with its date, day, time, venue and days left. Tap **Add venue** to type in the hall and seat once the seating plan is out.
- **Marks.** Tap any lecture or exam to open that course's marks and notes (the same as the old timetable app).
- **Backup.** **Back up to file** downloads a `.json` file. **Restore from file** loads one back, including backups from the old timetable app such as `semester_backup_2026-10-24.json`.
- Light and dark themes (the button next to the clock).

## Put it online (GitHub Pages)

1. Push this folder to the repo:
   ```bash
   cd semester
   git init
   git add .
   git commit -m "Add Semester app"
   git branch -M main
   git remote add origin https://github.com/UnlockingPrime/timetable.git
   git push -u origin main
   ```
2. In the repo, open **Settings → Pages**. Under *Build and deployment* pick *Deploy from a branch*, branch `main`, folder `/ (root)`, then **Save**.
3. After a minute the app is live at **https://unlockingprime.github.io/timetable/**.

## Install it on Android

1. Open the link in **Chrome** on the phone.
2. Tap **Install as app** at the bottom of the page, or Chrome's own **Install** prompt (or ⋮ → *Add to Home screen* / *Install app*).
3. It now opens from the home screen as a full-screen app and works without internet.

On iPhone: open the link in Safari, then Share → **Add to Home Screen**.

## Getting your old marks back

Tap **Restore from file** and pick your backup `.json` (for example `semester_backup_2026-10-24.json`).

Your data stays on the device (browser storage). Take a backup now and then.

## Editing the timetable or exams

Everything is in `index.html`, near the top of the `<script>`:

- `COURSES`: code, name, instructor, room and colour for each course
- `SCHED`: the lectures for each weekday
- `EXAMS`: exam date and time (IST)

After any change, bump `VERSION` in `sw.js` (`semester-app-v1` → `semester-app-v2`) so installed copies update.

## Run it on your laptop

```bash
cd semester
python3 -m http.server 8000
```

Then open http://localhost:8000. Offline mode needs `http://`, not `file://`.
