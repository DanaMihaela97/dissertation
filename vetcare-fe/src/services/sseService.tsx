const SSE_URL = `http://ec2-13-61-108-126.eu-north-1.compute.amazonaws.com:8060/websocket/updates`;

export function getEventSourcePath() {
   return SSE_URL;
}

