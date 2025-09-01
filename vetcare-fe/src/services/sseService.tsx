const SSE_URL = `${process.env.GATEWAY_API_URL}/websocket/updates`;

export function getEventSourcePath() {
   return SSE_URL;
}

