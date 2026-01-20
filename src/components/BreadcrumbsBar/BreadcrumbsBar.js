import * as React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink, matchPath, useLocation } from "react-router-dom";

const labelMap = {
  main_page: "Αρχική",
  owner: "Ιδιοκτήτης",
  vet: "Κτηνίατρος",
  find_vet: "Εύρεση Κτηνιάτρου",
  lost_pets: "Απολεσθέντα",
  found_report: "Δήλωση Εύρεσης",
  lost_report: "Δήλωση Απώλειας",
  history_report: "Ιστορικό Δηλώσεων",
  appointments: "Ραντεβού",
  profile: "Προφίλ",
  edit: "Επεξεργασία",
  pet: "Κατοικίδιο",
  health_book: "Βιβλιάριο Υγείας",
  arrange_meeting: "Προγραμματισμός Ραντεβού",
  vet_main: "Κτηνίατρος",
  owner_main: "Ιδιοκτήτης",
  schedule: "Διαθεσιμότητα",
  arrange_appointment: "Διαχείριση Ραντεβού",
  reviews: "Αξιολογήσεις",
  registration: "Εγγραφή",
  login: "Σύνδεση",
  terms: "Όροι Χρήσης",
  privacy: "Πολιτική Απορρήτου",
  faq: "Συχνές Ερωτήσεις",
  "forgot-password": "Ανάκτηση Κωδικού",
  "delete-account": "Διαγραφή Λογαριασμού",
  "pet-register": "Καταγραφή Κατοικιδίου",
  "pet-history": "Ιστορικό Καταγραφών",
  "pet-preview": "Προεπισκόπηση",
  "pet-edit": "Επεξεργασία",
  "health-book": "Βιβλιάριο Υγείας",
  "new-act": "Νέα Ιατρική Πράξη",
  "new-event": "Νέο Συμβάν",
  "act-preview": "Προεπισκόπηση Πράξης",
  "event-preview": "Προεπισκόπηση Συμβάντος",
};

const routeCrumbs = [
  {
    pattern: "/find_vet/:vetid/arrange_meeting",
    crumbs: ({ vetid }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Εύρεση Κτηνίατρου", to: "/find_vet" },
      { label: "Προβολή Προφίλ Κτηνιάτρου", to: `/find_vet/${vetid}` },
      { label: "Προγραμματισμός Ραντεβού" },
    ],
  },
  {
    pattern: "/find_vet/:vetid",
    crumbs: ({ vetid }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Εύρεση Κτηνίατρου", to: "/find_vet" },
      { label: "Προβολή Προφίλ Κτηνιάτρου" },
    ],
  },
  {
    pattern: "/lost_pets/:id/found_report",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Απολεσθέντα", to: "/lost_pets" },
      { label: "Προβολή Προφίλ Κατοικιδίου", to: `/lost_pets/${id}` },
      { label: "Δήλωση Εύρεσης" },
    ],
  },
  {
    pattern: "/lost_pets/:id",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Απολεσθέντα", to: "/lost_pets" },
      { label: "Προβολή Προφίλ Κατοικιδίου" },
    ],
  },
  {
    pattern: "/lost_pets",
    crumbs: () => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Απολεσθέντα" },
    ],
  },
  {
    pattern: "/owner_main/:id/find_vet/:vetid/arrange_meeting",
    crumbs: ({ id, vetid }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Εύρεση Κτηνίατρου", to: `/owner_main/${id}/find_vet` },
      { label: "Προβολή Προφίλ Κτηνιάτρου", to: `/owner_main/${id}/find_vet/${vetid}` },
      { label: "Προγραμματισμός Ραντεβού" },
    ],
  },
  {
    pattern: "/owner_main/:id/find_vet/:vetid",
    crumbs: ({ id, vetid }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Εύρεση Κτηνίατρου", to: `/owner_main/${id}/find_vet` },
      { label: "Προβολή Προφίλ Κτηνιάτρου" },
    ],
  },
  {
    pattern: "/owner_main/:id/found_report",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Δήλωση Εύρεσης" },
    ],
  },
  {
    pattern: "/owner_main/:id/lost_report",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Δήλωση Απώλειας" },
    ],
  },
  {
    pattern: "/owner_main/:id/appointments/review/:appointmentId",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Ραντεβού", to: `/owner_main/${id}/appointments` },
      { label: "Αξιολόγηση" },
    ],
  },
  {
    pattern: "/owner_main/:id/appointments/:appointmentId",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Ραντεβού", to: `/owner_main/${id}/appointments` },
      { label: "Πληροφορίες Ραντεβού" },
    ],
  },
  {
    pattern: "/owner_main/:id/appointments",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Ραντεβού" },
    ],
  },
  {
    pattern: "/owner_main/:id/history_report/:eventId",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Ιστορικό Δηλώσεων", to: `/owner_main/${id}/history_report` },
      { label: "Προεπισκόπηση Δήλωσης" },
    ],
  },
  {
    pattern: "/owner_main/:id/history_report",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Ιστορικό Δηλώσεων" },
    ],
  },
  {
    pattern: "/owner_main/:id/pet/:petid/health_book",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Βιβλιάριο Υγείας" },
    ],
  },
  {
    pattern: "/owner_main/:id/find_vet",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης", to: `/owner_main/${id}` },
      { label: "Εύρεση Κτηνίατρου" },
    ],
  },
  {
    pattern: "/owner_main/:id",
    crumbs: ({ id }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Ιδιοκτήτης" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/health-book/:ownerId/:petId/new-act",
    crumbs: ({ vetId, ownerId, petId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Βιβλιάριο Υγείας", to: `/vet_main/${vetId}/health-book/${ownerId}/${petId}` },
      { label: "Νέα Ιατρική Πράξη" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/health-book/:ownerId/:petId/new-event",
    crumbs: ({ vetId, ownerId, petId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Βιβλιάριο Υγείας", to: `/vet_main/${vetId}/health-book/${ownerId}/${petId}` },
      { label: "Νέο Συμβάν" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/health-book/:ownerId/:petId",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Βιβλιάριο Υγείας" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/pet-register",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Καταγραφή Κατοικιδίου" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/pet-history",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Ιστορικό Καταγραφών" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/pet-preview/:id",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Προεπισκόπηση" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/pet-edit/:id",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Επεξεργασία" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/appointments/:appointmentId",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Ραντεβού", to: `/vet_main/${vetId}/arrange_appointment` },
      { label: "Πληροφορίες Ραντεβού" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/arrange_appointment",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Διαχείριση Ραντεβού" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/schedule",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Διαθεσιμότητα" },
    ],
  },
  {
    pattern: "/vet_main/:vetId/reviews",
    crumbs: ({ vetId }) => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Κτηνίατρος", to: `/vet_main/${vetId}` },
      { label: "Αξιολογήσεις" },
    ],
  },
  {
    pattern: "/registration",
    crumbs: () => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Εγγραφή" },
    ],
  },
  {
    pattern: "/login",
    crumbs: () => [
      { label: "Αρχική", to: "/main_page" },
      { label: "Σύνδεση" },
    ],
  },
  {
    pattern: "/main_page",
    crumbs: () => [{ label: "Αρχική" }],
  },
];

const buildFallback = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let current = "";
  parts.forEach((part) => {
    if (/^\d+$/.test(part)) return;
    current += `/${part}`;
    const label = labelMap[part] || part;
    crumbs.push({ label, to: current });
  });
  if (crumbs.length === 0) {
    return [{ label: "Αρχική", to: "/main_page" }];
  }
  return crumbs;
};

const getCrumbs = (pathname) => {
  for (const route of routeCrumbs) {
    const match = matchPath({ path: route.pattern, end: true }, pathname);
    if (match) {
      return route.crumbs(match.params || {});
    }
  }
  return buildFallback(pathname);
};

export default function BreadcrumbsBar() {
  const { pathname } = useLocation();
  const role = (localStorage.getItem("role") || "").trim();
  const userId = (localStorage.getItem("userId") || "").trim();
  const hasDashboard = (role === "owner" || role === "vet") && userId;
  const crumbs = React.useMemo(() => getCrumbs(pathname), [pathname]);
  if (!crumbs.length) return null;

  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        borderBottom: "1px solid #ddd",
        ml: hasDashboard ? "270px" : 0,
        backgroundColor: "transparent",
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "& .MuiTypography-root": { color: "#000" },
          "& .MuiLink-root": { color: "#000" },
        }}
      >
        {crumbs.map((crumb, idx) =>
          idx < crumbs.length - 1 && crumb.to ? (
            <Link
              key={`${crumb.label}-${idx}`}
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={crumb.to}
            >
              {crumb.label}
            </Link>
          ) : (
            <Typography key={`${crumb.label}-${idx}`} sx={{ color: "text.primary" }}>
              {crumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
}
