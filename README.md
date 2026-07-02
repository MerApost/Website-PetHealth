# PetHealth — Pet Health Monitoring & Registration Platform

A full-featured frontend web application built with **React** and **JSON Server** for managing pet health records, veterinary appointments, and lost & found pet reports.

The project was developed as a university assignment for the **Human-Computer Interaction (ΥΣ08)** course at the **Department of Informatics and Telecommunications, National and Kapodistrian University of Athens (NKUA)**.

The application implements the frontend interface of a digital platform for the **registration and monitoring of pet health records**, with separate user flows for pet owners, veterinarians, and public visitors.

## Demo Video

You can view the application in the demo video below:
Check here: https://youtu.be/DGQiSj9kfL4?si=Y4WaIGrp-1zsYlJl

## Overview

**PawHealth Portal** is a civic digital platform designed to connect pet owners and veterinarians through a user-friendly interface.

The platform allows users to manage pet health data, view and print health records, schedule veterinary appointments, submit lost or found pet reports, and access role-based services depending on the type of user.

The application supports three main user roles:

- **Pet Owners** — manage pets, health records, lost/found reports, and appointments
- **Veterinarians** — register pets, log medical procedures, manage availability, and handle appointment requests
- **Guests / Citizens** — browse lost pet reports and submit found-pet notifications without logging in

This is a **frontend-only academic prototype**. Data persistence is simulated using **JSON Server** and a local `db.json` file.


## Key Features

### For Pet Owners

Pet owners can access personalized services related to their pets and veterinary appointments.

Implemented features include:

- View a personalized pet owner dashboard
- View and edit owner profile information
- View pet health passport / health book
- Print pet health record information
- Submit a lost pet report
- Save lost pet reports as draft before final submission
- Submit a found pet report
- View history of submitted lost/found reports
- Search for veterinarians using criteria such as location, availability, specialty, education, and experience
- View veterinarian profiles and details
- Book appointments for pet registration or medical procedures
- View appointment status: pending, confirmed, or cancelled
- Cancel pending or confirmed appointments
- View appointment history
- Submit ratings and reviews for veterinarians

### For Veterinarians

Veterinarians can manage their professional profile, availability, appointments, and pet medical records.

Implemented features include:

- View a personalized veterinarian dashboard
- Create and edit a professional profile
- Manage information such as VAT number, name, gender, education, experience, and clinic address
- Register a pet using microchip information
- Add pet identity details such as species, gender, name, and date of birth
- Save pet registration forms as draft before final submission
- View pet registration history
- Record medical procedures such as vaccinations, sterilization, surgeries, and other medical acts
- Register pet life events such as loss, found, transfer, adoption, and fostering
- View and print pet medical history
- Create and manage availability slots
- Manage appointment requests from pet owners
- Confirm or reject appointment requests
- Receive cancellation updates from pet owners
- View ratings and reviews submitted by owners

### For Guests / Citizens

Public visitors can use part of the platform without authentication.

Implemented features include:

- Browse lost pet listings
- View lost pet details
- Submit a found-pet report
- Provide finder details, location, date, and photo information
- Access general informational pages such as FAQ, Terms of Use, and Privacy Policy


The project was designed with emphasis on **Human-Computer Interaction** principles and usability.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Language | JavaScript |
| Routing | React Router |
| UI Components | Material UI, Bootstrap |
| Styling | CSS |
| Mock Backend | JSON Server |
| Data Storage | `db.json` |
| Package Manager | npm |

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
