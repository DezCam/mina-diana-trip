export type EmergencyAction = {
  label: string;
  number: string;
  href: string;
  emphasis?: "primary" | "secondary";
};

export type EmergencyContact = {
  title: string;
  number?: string;
  label?: string;
  description?: string;
  address?: string[];
  actions: EmergencyAction[];
  warning?: string;
};

export type EmergencyCity = {
  name: "Amsterdam" | "Edinburgh";
  contacts: EmergencyContact[];
};

export const quickCallGuide = [
  {
    need: "Immediate danger / serious injury / fire",
    amsterdam: "112",
    edinburgh: "999 or 112",
  },
  {
    need: "Police issue, not urgent",
    amsterdam: "0900-8844",
    edinburgh: "101",
  },
  {
    need: "Urgent medical issue in Edinburgh, but not life-threatening",
    amsterdam: "",
    edinburgh: "111",
  },
  {
    need: "Lost/stolen U.S. passport or need U.S. citizen assistance",
    amsterdam: "U.S. Consulate",
    edinburgh: "U.S. Consulate",
  },
];

export const emergencyCities: EmergencyCity[] = [
  {
    name: "Amsterdam",
    contacts: [
      {
        title: "Emergency",
        number: "112",
        label: "Police · Ambulance · Fire",
        description: "For life-threatening emergencies or a crime in progress.",
        actions: [
          {
            label: "Call 112",
            number: "112",
            href: "tel:112",
            emphasis: "primary",
          },
        ],
      },
      {
        title: "Police — Non-Emergency",
        number: "0900-8844",
        label: "Netherlands Police — Non-Emergency",
        actions: [
          {
            label: "Call 0900-8844",
            number: "0900-8844",
            href: "tel:09008844",
            emphasis: "secondary",
          },
          {
            label: "From an international/foreign phone: +31 343 57 8844",
            number: "+31 343 57 8844",
            href: "tel:+31343578844",
            emphasis: "secondary",
          },
        ],
      },
      {
        title: "U.S. Consulate — Amsterdam",
        label: "U.S. Consulate General Amsterdam",
        address: ["Museumplein 19", "1071 DJ Amsterdam", "Netherlands"],
        description:
          "For U.S. citizen assistance such as a lost or stolen passport, being the victim of a crime, or other serious consular emergencies.",
        actions: [
          {
            label: "Telephone / emergency assistance: +31 70 310 2209",
            number: "+31 70 310 2209",
            href: "tel:+31703102209",
            emphasis: "secondary",
          },
        ],
        warning: "If there is immediate danger: CALL 112 FIRST.",
      },
    ],
  },
  {
    name: "Edinburgh",
    contacts: [
      {
        title: "Emergency",
        number: "999",
        label: "Police · Ambulance · Fire",
        actions: [
          {
            label: "Call 999",
            number: "999",
            href: "tel:999",
            emphasis: "primary",
          },
          {
            label: "112 also works in the United Kingdom",
            number: "112",
            href: "tel:112",
            emphasis: "secondary",
          },
        ],
      },
      {
        title: "Police — Non-Emergency",
        number: "101",
        label: "Police Scotland — Non-Emergency",
        actions: [
          {
            label: "Call 101",
            number: "101",
            href: "tel:101",
            emphasis: "secondary",
          },
        ],
      },
      {
        title: "Urgent Medical Help",
        number: "111",
        label: "NHS 24",
        description:
          "For urgent medical help when the situation is not life- or limb-threatening.",
        actions: [
          {
            label: "Call 111",
            number: "111",
            href: "tel:111",
            emphasis: "secondary",
          },
        ],
        warning: "For a life-threatening emergency, call 999.",
      },
      {
        title: "U.S. Consulate — Edinburgh",
        label: "U.S. Consulate General Edinburgh",
        address: ["3 Regent Terrace", "Edinburgh EH7 5BW", "Scotland"],
        description:
          "For U.S. citizen assistance such as a lost or stolen passport, being the victim of a crime, or other serious consular emergencies.",
        actions: [
          {
            label: "Telephone: +44 131 556 8315",
            number: "+44 131 556 8315",
            href: "tel:+441315568315",
            emphasis: "secondary",
          },
          {
            label: "After-hours emergency assistance: +44 20 7499 9000",
            number: "+44 20 7499 9000",
            href: "tel:+442074999000",
            emphasis: "secondary",
          },
        ],
        warning: "If there is immediate danger: CALL 999 FIRST.",
      },
    ],
  },
];

export const stateDepartmentFallback = {
  title: "U.S. Citizen Help Abroad",
  description:
    "If Diana or Mina cannot reach the appropriate U.S. embassy or consulate during an emergency:",
  label: "From overseas:",
  number: "+1 202-501-4444",
  href: "tel:+12025014444",
};
