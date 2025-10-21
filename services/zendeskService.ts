interface ZendeskTicketData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

/**
 * Simulates creating a Zendesk ticket.
 *
 * @remarks
 * In a real-world application, making a direct API call to Zendesk from the frontend
 * is not secure or feasible due to two main reasons:
 * 1.  **Security Risk**: It would expose your secret API token to anyone viewing the website's code.
 * 2.  **CORS Policy**: Browsers block such requests for security reasons (Cross-Origin Resource Sharing).
 *
 * The correct approach is to send the form data to a secure backend endpoint (a proxy server)
 * that you control. This backend would then add the secret API token and safely forward the
 * request to Zendesk.
 *
 * This function simulates that process to allow the UI to be fully functional for this demo.
 *
 * @param ticketData - The data for the ticket to be created.
 * @returns A promise that resolves to a mock response object, simulating a successful API call.
 */
export const createZendeskTicket = async (ticketData: ZendeskTicketData): Promise<Response> => {
    console.log("--- SIMULATING ZENDESK TICKET CREATION ---");
    console.log("This is a simulation because a secure backend is required for this operation.");
    console.log("Ticket Data:", ticketData);

    // Simulate network delay for a realistic user experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a successful response from the server.
    // The 'ok: true' property will prevent the .catch() block from being triggered in the form.
    const mockResponse = {
        ok: true,
        status: 201, // HTTP status for "Created"
        json: async () => ({
            ticket: {
                id: Date.now(),
                subject: ticketData.subject
            }
        }),
    } as Response;

    return Promise.resolve(mockResponse);

    /*
    // To simulate an error for testing, you could uncomment the following line:
    // return Promise.reject(new Error("Simulated API Failure"));
    */
};
