
const URL = "http://localhost:8080/realms/disertatie/protocol/openid-connect/auth?client_id=gateway-client&scope=openid%20email%20profile&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=v8e-bXPy-rW1AEST0xqhP-Wb51oMZfgmGBKmfA69GUk&code_challenge=GVKS38oSMJYBIpciHEZgENu3YZaPfpLr0XN3_fjiaZg&code_challenge_method=S256"


export const login = () => {
 window.location.href = URL;

};
