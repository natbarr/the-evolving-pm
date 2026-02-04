import { vi } from "vitest";

export interface MockSupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export function createMockSupabaseClient() {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();

  // Chain methods
  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
  });

  mockEq.mockReturnValue({
    single: mockSingle,
  });

  mockUpdate.mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: null, error: null }),
  });

  mockInsert.mockResolvedValue({ data: null, error: null });

  mockSingle.mockResolvedValue({ data: null, error: null });

  return {
    client: { from: mockFrom },
    mocks: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      eq: mockEq,
      single: mockSingle,
    },
    // Helper to set up specific responses
    mockExistingResource: (id: string) => {
      mockSingle.mockResolvedValueOnce({ data: { id }, error: null });
    },
    mockNoExistingResource: () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: null });
    },
    mockInsertError: (message: string, code?: string) => {
      mockInsert.mockResolvedValueOnce({
        data: null,
        error: { message, code },
      });
    },
    mockUpdateError: (message: string) => {
      mockUpdate.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message },
        }),
      });
    },
  };
}
