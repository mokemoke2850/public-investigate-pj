/**
 * Creates a mock fetch function that returns a Promise with a mocked response.
 * @param mockResponseBody - The mocked response body.
 * @returns A function that simulates a fetch request and returns a Promise with the mocked response.
 */
export const createMockFetch =
  <T>(mockResponseBody: T) =>
  async (url: string, options: RequestInit): Promise<Response> => {
    console.log('mockFetch', url, options);
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = new Response(JSON.stringify(mockResponseBody), {
          status: 200,
          headers: {
            'Content-type': 'application/json',
          },
        });
        resolve(response);
      }, 2000);
    });
  };
