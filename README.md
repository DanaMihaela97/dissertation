# Vetcare

* init `yarn`
* run `yarn run dev`
* add dependency `yarn add <>`
* .env file needs to have
```.env
NEXTAUTH_SECRET=
NODE_ENV=
KEYCLOAK_ID=next-client
KEYCLOAK_SECRET=[...]
KEYCLOAK_ISSUER=http://localhost:8080/realms/vetcare
```


## Keycloak
```
sudo docker build -t keycloak-container -f Containerfile .
sudo docker run --name mykeycloak -p 8443:8443 -p 8080:8080 -p 9000:9000 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin keycloak-container start --optimized --hostname=ec2-13-51-246-3.eu-north-1.compute.amazonaws.com
```

## Frontend
```

```

## Network
```
docker network create \
  --driver bridge \
  --subnet=172.20.0.0/16 \
  pawcare-network
```