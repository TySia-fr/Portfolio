/** Contact page copy (ADR-0003). */
export const contact = {
  title: "Contact",
  description:
    "Contacter Siavash Izadi, développeur full-stack JavaScript basé en France : projet, collaboration ou opportunité.",
  heading: "Parlons de votre projet.",
  intro:
    "Un projet web, une collaboration ou une opportunité ? Écrivez-moi en quelques lignes : le contexte, ce que vous cherchez à construire et vos délais.",
  channels: {
    title: "Me joindre",
    email: "E-mail",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  form: {
    title: "Écrire un message",
    name: "Nom",
    email: "E-mail",
    emailHint: "Pour pouvoir vous répondre.",
    message: "Message",
    messageHint: "Le contexte, ce que vous cherchez à construire, vos délais.",
    honeypot: "Ne pas remplir ce champ",
    submit: "Envoyer le message",
    sending: "Envoi en cours…",
    noScript:
      "Le formulaire nécessite JavaScript. Vous pouvez m’écrire directement par e-mail.",
    errorsTitle: "Le formulaire contient des erreurs :",
    client: {
      name: "Indiquez votre nom.",
      email: "Adresse e-mail invalide.",
      messageShort: "Votre message doit contenir au moins 20 caractères.",
      tooLong: "Texte trop long.",
    },
    success: {
      title: "Message envoyé.",
      body: "Merci, je vous réponds dès que possible à l’adresse indiquée.",
      again: "Écrire un autre message",
    },
    errors: {
      invalid: "Certains champs sont à corriger.",
      rate_limited:
        "Trop de messages envoyés en peu de temps. Réessayez dans quelques minutes, ou écrivez-moi par e-mail.",
      unavailable:
        "Le formulaire est momentanément indisponible. Votre message n’a pas été envoyé : écrivez-moi directement par e-mail.",
      delivery_failed:
        "Le message n’a pas pu être envoyé. Il n’a pas été transmis : réessayez, ou écrivez-moi directement par e-mail.",
      network:
        "Connexion impossible. Votre message n’a pas été envoyé : vérifiez votre connexion et réessayez.",
      generic: "Le message n’a pas pu être envoyé. Écrivez-moi directement par e-mail.",
    },
  },
  privacy:
    "Votre message est uniquement utilisé pour vous répondre. Il n’est pas stocké sur ce site, ni revendu, ni utilisé à des fins publicitaires.",
  privacyLink: "Confidentialité et mentions légales",
} as const;
