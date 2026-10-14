// Every hourglass-server response: { status, message, data? }. Extra top-level fields (like tokens)
// are added per endpoint.
type ApiResponse<T = null> = {
  status: boolean;
  message: string;
  data: T;
};

export type { ApiResponse };
