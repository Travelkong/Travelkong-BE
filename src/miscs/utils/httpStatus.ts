// Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#informational_responses
export const HTTP_STATUS = {
  // Successful responses
  OK: {
    code: 200,
    message: "OK",
  },

  CREATED: {
    code: 201,
    message: "Created",
  },

  NO_CONTENT: {
    code: 204,
    message: "No Content",
  },

  // Redirection messages
  NOT_MODIFIED: {
    code: 304,
    message: "Not Modified",
  },

  // Client error responses
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },

  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },

  PAYMENT_REQUIRED: {
    code: 402,
    message: "Payment Required",
  },

  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },

  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },

  CONFLICT: {
    code: 409,
    message: "Conflict",
  },

  UNPROCESSABLE_CONTENT: {
    code: 422,
    message: "Unprocessable Content",
  },

  // Server error responses
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
} as const
