import type { Widen } from "@/i18n/types";

import type { contact as fr } from "../contact";

/** Contact page in English. Error keys match the API responses. */
export const contact = {
  title: "Contact",
  description:
    "Contact Siavash Izadi, full-stack JavaScript developer based in France: a role, a project or a collaboration.",
  heading: "Let’s talk about your project.",
  intro:
    "A role, a web project or a collaboration? Write me a few lines: the context, what you want to build and your timeline.",
  channels: {
    title: "Reach me",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  form: {
    title: "Send a message",
    name: "Name",
    email: "Email",
    emailHint: "So I can reply to you.",
    message: "Message",
    messageHint: "The context, what you want to build, your timeline.",
    honeypot: "Leave this field empty",
    submit: "Send message",
    sending: "Sending…",
    noScript: "The form needs JavaScript. You can email me directly instead.",
    errorsTitle: "The form has errors:",
    client: {
      name: "Enter your name.",
      email: "Invalid email address.",
      messageShort: "Your message must be at least 20 characters long.",
      tooLong: "Text too long.",
    },
    success: {
      title: "Message sent.",
      body: "Thank you, I will reply as soon as possible to the address you gave.",
      again: "Send another message",
    },
    errors: {
      invalid: "Some fields need to be corrected.",
      rate_limited:
        "Too many messages in a short time. Try again in a few minutes, or email me.",
      unavailable:
        "The form is temporarily unavailable. Your message was not sent: email me directly.",
      delivery_failed:
        "The message could not be sent. It was not delivered: try again, or email me directly.",
      network:
        "No connection. Your message was not sent: check your connection and try again.",
      generic: "The message could not be sent. Email me directly.",
    },
  },
  privacy:
    "Your message is only used to reply to you. It is not stored on this site, sold, or used for advertising.",
  privacyLink: "Privacy and legal notice",
  privacyHref: "/en/legal#donnees",
} as const satisfies Widen<typeof fr>;
