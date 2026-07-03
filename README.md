# PetHealth — Pet Health Monitoring & Registration Platform

A full-featured frontend web application built with **React** and **JSON Server** for managing pet health records, veterinary appointments, and lost & found pet reports.

Developed as a university **Human-Computer Interaction (ΥΣ08)** project at the **Department of Informatics & Telecommunications, National and Kapodistrian University of Athens (NKUA)**.

You can view the application in the demo video below:

[Watch the demo video on YouTube](Check here: https://youtu.be/DGQiSj9kfL4?si=Y4WaIGrp-1zsYlJl)

---

## 📌 Overview

**PetHealth Portal** is a digital platform designed to connect pet owners, veterinarians, and citizens through a user-friendly interface for pet health monitoring and pet-related services.

The platform enables users to manage pet health data, view and print pet health records, schedule veterinary appointments, and submit lost or found pet reports.

The application supports three main user roles, each with a personalized experience:

- 🐶 **Pet Owners** — manage their pets' health records, report lost/found animals, search for veterinarians, and book appointments
- 🩺 **Veterinarians** — register pets, record medical procedures, manage availability, and handle appointment requests
- 👤 **Guests / Citizens** — browse lost pets, submit found-pet reports, search for veterinarians, book appointments without an account, and register on the platform
  
This is a **frontend-only academic prototype**. The backend is simulated using **JSON Server** for demonstration purposes.

---

## ✨ Key Features

### For Pet Owners

- View a personalized pet owner dashboard
- View and edit profile information
- View and print the health passport / health book of registered pets
- Submit a lost pet report
- Save lost pet reports as draft before final submission
- Submit a found pet report
- Browse the history of submitted reports
- Search for veterinarians by area, availability, specialty, education, and experience
- View veterinarian profiles and details
- Book appointments for pet registration or medical procedures
- View appointment status: pending, confirmed, or cancelled
- Cancel pending or confirmed appointments
- View appointment history and appointment details
- Rate and review veterinarians after visits

### For Veterinarians

- View a personalized veterinarian dashboard
- Create and manage a professional profile
- Add professional information such as VAT number, full name, gender, education, experience, and clinic address
- Register a new pet using microchip information
- Add pet identity details such as species, gender, name, and date of birth
- Save pet registration forms as draft before final submission
- View pet registration history
- Record medical procedures such as vaccinations, sterilization, surgeries, and other medical acts
- Register pet life events such as loss, found, transfer, adoption, and fostering
- View and print the pet's medical history
- Create and manage availability slots
- Manage appointment requests
- Confirm or reject appointment requests
- Receive cancellation updates from pet owners
- View ratings and reviews submitted by owners

### For Guests / Citizens

Public visitors can use several platform services without creating an account.

Implemented features include:

- Browse lost pet listings without an account
- View details about lost pets
- Submit a found-pet report linked to a lost-pet listing
- Provide finder details, location, date, and photo information
- Search for veterinarians without an account
- View veterinarian profiles and basic professional information
- Book an appointment with a veterinarian without logging in
- Create a new account / register on the platform
- Log in to access personalized owner or veterinarian services
- Access general informational pages such as FAQ, Terms of Use, and Privacy Policy

---

## 🎨 UI/UX Focus

The project was designed with emphasis on **Human-Computer Interaction** principles and usability.

Main UI/UX goals:

- Clear separation between pet owner and veterinarian workflows
- Simple and understandable navigation
- Personalized information based on the logged-in user
- Accessible public browsing for lost pets
- Easy-to-use forms for lost and found pet reports
- Clear appointment status handling
- Consistent layout across pages
- Reusable interface components
- Helpful navigation elements such as breadcrumbs, navigation bar, footer, and back buttons

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Project Setup | Create React App |
| Language | JavaScript |
| Routing | React Router |
| UI Components | Material UI, Bootstrap |
| Styling | CSS |
| Mock Backend | JSON Server |
| Data Storage | `db.json` |
| Package Manager | npm |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 14
- npm

### Run the app

Start the mock backend (**JSON Server**) and the React app in two separate terminals:

```bash
# Terminal 1 – mock API
npx json-server --watch db.json --port 3004

# Terminal 2 – React app
npm start
```
Open the application in your browser:

```text
http://localhost:3000
```

The mock API will be available at:

```text
http://localhost:3004
```

---

## Project Structure

```text
PawHealth-Portal/
│
├── public/                     # Static public assets
│
├── src/                        # React source code
│   ├── components/              # Reusable UI components
│   │   ├── BackButton/
│   │   ├── BreadcrumbsBar/
│   │   ├── Footer/
│   │   ├── Navigation_bar/
│   │   ├── Owner/
│   │   └── Vet/
│   │
│   ├── pages/                   # Page-level components
│   │   ├── Lost_Pets/            # Public lost/found pet pages
│   │   ├── Main/                 # Main public pages
│   │   ├── Owner/                # Pet owner pages and flows
│   │   └── Vet/                  # Veterinarian pages and flows
│   │
│   ├── pics/                    # Images and visual assets
│   ├── App.js                   # Main routing and role-based navigation
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── db.json                     # Mock database used by JSON Server
├── package.json                # Project dependencies and scripts
├── package-lock.json
├── SUBMISSION_README.txt        # Academic submission notes and demo credentials
└── README.md                   # Project documentation
```
## 🎓 Academic Context

This project was built for the **Human-Computer Interaction (ΥΣ08)** course at the **Department of Informatics & Telecommunications, National and Kapodistrian University of Athens**, as part of a three-phase assignment:

- **A1** — Requirements analysis & user personas
- **A2** — Illustrated scenario / storyboard / wireframes
- **A3** — Full frontend implementation of the application

The A3 assignment focused on implementing the frontend interface of a new digital service for the **registration and monitoring of pet health records**.

**Note:** This is a frontend-only implementation. The backend is simulated using **JSON Server** for demonstration purposes.

