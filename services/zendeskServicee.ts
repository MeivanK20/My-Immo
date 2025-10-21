interface ZendeskTicketData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// A real-world app should use a backend proxy for this to avoid exposing API tokens.
// These environment variables would be set in the deployment environment.
const myimmo.zendesk.com = process.env.myimmo.zendesk.com; // e.g., 'myimmo'
const mbaye.ivan@outlook.com = process.env.mbaye.ivan@outlook.com; // e.g., 'api.user@myimmo.com'
const topccsPA5JEUUhklyaWiP5Jbdsy32dkLiCjd1OHu = process.env.topccsPA5JEUUhklyaWiP5Jbdsy32dkLiCjd1OHu; // Zendesk API token

export const createZendeskTicket = async (ticketData: ZendeskTicketData): Promise<Response> => {
    if (!myimmo.zendesk.com || !mbaye.ivan@outlook.com || !topccsPA5JEUUhklyaWiP5Jbdsy32dkLiCjd1OHu) {
        console.warn("Zendesk environment variables are not set. Simulating success for demo purposes.");
        // Simulate a successful API call for demo purposes if variables are not set.
        return new Promise(resolve => setTimeout(() => resolve(new Response(null, { status: 201 })), 1000));
    }

    const url = `https://${myimmo.zendesk.com}.zendesk.com/api/v2/tickets.json`;

    const credentials = btoa(`${mbaye.ivan@outlook.com}/token:${topccsPA5JEUUhklyaWiP5Jbdsy32dkLiCjd1OHu}`);

    const ticketPayload = {
        ticket: {
            subject: ticketData.subject,
            comment: {
                body: `
                    Message from: ${ticketData.name} (${ticketData.email})
                    ----------------------------------
                    ${ticketData.message}
                `
            },
            requester: {
                name: ticketData.name,
                email: ticketData.email,
            },
        },
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify(ticketPayload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Failed to create Zendesk ticket');
    }

    return response;
};
