# PawCare

PawCare is a web application designed to help pet owners manage their pets’ information, access veterinary services, and receive personalized recommendations with ease.

## Key Features
### User Authentication & Account Management

- Users can create a personal account using their email address.

- Authentication and authorization are handled via Keycloak, which generates JWT tokens for secure access validation.

- All requests go through an API Gateway, which verifies the token and routes the request to the correct microservice.

### Pet Profile Management

- Users can create profiles for one or more pets, storing information such as name, species, breed, age, weight, and vaccination history.

- This data is used to generate personalized medical suggestions via the chatbot.

### Online Consultations

- Users can initiate online consultations by selecting a pet and starting a chat session.

- The chatbot (Gemini model) asks relevant questions, generates a preliminary diagnosis, suggests treatments, and provides health & nutrition recommendations.

- User interactions and reviews are stored in a MySQL database.

### Veterinary Clinic Locator

- Users can enter their address and city, and the app finds nearby veterinary clinics.

- Uses Google Geocoding API (to convert address to GPS coordinates) and Google Places API (to list clinics).

- Displays clinic details (distance, address, opening hours, phone number) and shows the location on a map with route directions.

### Real-time & Email Notifications

- Real-time in-app notifications are implemented using Server-Sent Events (SSE).
   
- Email notifications are handled via AWS services:
- 
  SNS triggers events (for subscriptions or vaccine reminders).
    
  Lambda processes events and invokes SES to send personalized emails.
    

### Feedback & Reviews

- Users can leave reviews about the platform and services.

- Feedback is used to continuously improve the application and user experience.

## Backend Architecture

The backend is structured into three microservices:

- API Location – Integrates with Google APIs to fetch nearby clinics and related details.

- API Chat – Handles chatbot interaction using the Gemini model and stores responses in MySQL.

- API Animals – Manages pet data and vaccination history, and coordinates the notification system.

# Commands
* init `yarn`
* run `yarn run dev`
* add dependency `yarn add <>`
* .env file needs to have
```.env
NEXTAUTH_SECRET="random"
NODE_ENV=
KEYCLOAK_ID=
KEYCLOAK_SECRET=
KEYCLOAK_ISSUER=
GATEWAY_API_URL=
NEXTAUTH_URL=
HOME_PAGE_URL=
```

## Keycloak
```
sudo docker build -t keycloak-container -f Containerfile .
sudo docker run --name mykeycloak -p 8443:8443 -p 8080:8080 -p 9000:9000 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin keycloak-container start --optimized --hostname=ec2-13-51-246-3.eu-north-1.compute.amazonaws.com
```


## Network
```
docker network create \
  --driver bridge \
  --subnet=172.20.0.0/16 \
  pawcare-network
```
