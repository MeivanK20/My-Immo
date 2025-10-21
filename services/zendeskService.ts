interface ZendeskTicketData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// A real-world app should use a backend proxy for this to avoid exposing API tokens.
// For production, set these as environment variables.
// For demo purposes, we fall back to the provided credentials if environment variables are not set.
const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN || 'myimmo.zendesk.com';
const ZENDESK_API_EMAIL = process.env.ZENDESK_API_EMAIL || 'mbaye.ivan@outlook.com';
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN || 'topccsPA5JEUUhklyaWiP5Jbdsy32dkLiCjd1OHu';

export const createZendeskTicket = async (ticketData: ZendeskTicketData): Promise<Response> => {
    const url = `https://${ZENDESK_SUBDOMAIN}/api/v2/tickets.json`;

    const credentials = btoa(`${ZENDESK_API_EMAIL}/token:${ZENDESK_API_TOKEN}`);

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
        console.error('Zendesk API Error:', errorData);
        throw new Error(errorData.description || 'Failed to create Zendesk ticket');
    }

    return response;
};
