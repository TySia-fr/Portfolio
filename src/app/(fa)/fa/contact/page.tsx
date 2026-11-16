import { ContactView, contactMetadata } from "@/views/contact";

export const metadata = contactMetadata("fa");

export default function ContactPage() {
  return <ContactView locale="fa" />;
}
