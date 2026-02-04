import { vi } from "vitest";

export interface MockEmailSent {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export function createMockResend() {
  const sentEmails: MockEmailSent[] = [];

  const mockSend = vi.fn().mockImplementation(async (email: MockEmailSent) => {
    sentEmails.push(email);
    return { data: { id: "mock-email-id" }, error: null };
  });

  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    mockSend,
    sentEmails,
    mockSendError: (message: string) => {
      mockSend.mockRejectedValueOnce(new Error(message));
    },
    reset: () => {
      sentEmails.length = 0;
      mockSend.mockClear();
    },
  };
}
