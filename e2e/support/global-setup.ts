import { startMockEmailProvider } from "./mock-email-provider";

/**
 * When E2E_MAIL_MOCK_PORT is set, start the mock e-mail provider for the whole
 * run. The app under test must have been started with
 * CONTACT_EMAIL_API_URL=http://127.0.0.1:<port>/emails and RESEND_API_KEY=test-key.
 */
export default async function globalSetup() {
  const port = Number(process.env.E2E_MAIL_MOCK_PORT);
  if (!port) return;
  const server = await startMockEmailProvider(port);
  return async () => {
    await new Promise((resolve) => server.close(resolve));
  };
}
