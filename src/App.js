// Libraries.
import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Card, Button, InputGroup, FormControl } from 'react-bootstrap';

// Auth API.
import { authApiErrorCode, authApiGetErrorMessageFromCode, authApiRedirectOAuthAuthorization, authMethodUserGetInfo, authMethodEmailResendConfirmation } from '@kirillzhosul/florgon-auth-api';


const _errorCheckToken = function(error, onRedirect){
  /// @description Checks token from error and redirect if it is invalid.

  if (!("error" in error)) return;

  // Get error code.
  const error_code = error["error"]["code"];
  if (error_code == authApiErrorCode.AUTH_INVALID_TOKEN || error_code == authApiErrorCode.AUTH_EXPIRED_TOKEN || error_code == authApiErrorCode.AUTH_REQUIRED){
    // If our token is invalid.
    
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === ""){
      // Do not redirect to authentication server if this is localhost.
      return;
    }

    // Redirect to auth provider.
    onRedirect()
    authApiRedirectOAuthAuthorization(1, "https://profile.florgon.space", "token", "email", "")
  }
}

const DeactivatedBanner = function(){
  /// @description Banner component for deactivated users.
  return (
    <Card className="shadow-sm mt-3" border="danger">
      <Card.Body>
        <Card.Title as="h2">Your account has been suspended!</Card.Title>
        <Card.Text>
          <span className="mb-3 mt-3">Contact <a href="mailto: support@florgon.space">support@florgon.space</a> if you think this is due to mistake.</span>
        </Card.Text>
      </Card.Body>
    </Card>);
}

const ServicesBanner = function(){
  /// @description Banner component for servic list.
  return (
    <Card className="shadow-sm mt-3">
      <Card.Body>
        <Card.Title as="h2">Florgon services</Card.Title>
        <Card.Text>
          <a href="https://chat.florgon.space" className="btn btn-outline-primary mx-1">Chat</a>
          <a href="https://notes.florgon.space" className="btn btn-outline-primary mx-1">Notes</a>
          <a href="https://gatey.florgon.space" className="btn btn-outline-primary mx-1">Gatey</a>
          <a href="https://dev.florgon.space" className="btn btn-outline-primary mx-1">Developers portal</a>
        </Card.Text>
      </Card.Body>
    </Card>);
}

const Footer = function(){
  /// @description Footer component for servic list.
  return (<Card className="shadow-sm mt-3">
    <Card.Body>
      <Card.Text as="h6">
        <div>
          Copyright (c) 2022 <a href="https://florgon.space">Florgon</a>.
        </div>
        <div>
          <a href="https://florgon.space/legal/privacy-policy">Privacy policy</a>
        </div>
        <a href="https://dev.florgon.space">For developers</a>
        </Card.Text>
    </Card.Body>
  </Card>);
}

const ConfirmationBanner = function({onResendConfirmation}){
  /// @description Banner component for not confirmed users.
  return (
    <Card className="shadow-sm mt-3" border="warning">
      <Card.Body>
        <Card.Title as="h2">Please confirm your email</Card.Title>
        <Card.Text>
          <div className="mb-1 mt-3">Confirmation link was sent to your email.</div>
          <div className="btn btn-primary btn-sm" onClick={onResendConfirmation}>Resend email.</div>
        </Card.Text>
      </Card.Body>
    </Card>);
}

const Profile = function(){
  /// @description Profile component with fetching.

  // Usings.
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"])

  // States.
  const [accessToken] = useState(() => {
    let token = cookies["access_token"];
    if (token) return token;
 
    const params = new URLSearchParams(document.location.search)
    token = params.get("token");
    if (token){
      params.delete("token");
      document.location.search = params;  
    }else{
      token = new URLSearchParams(window.location.hash.substr(1)).get("token");
    }

    if (token){
      setCookie("access_token", token, {
        "path": "/"
      });
    }

    return token;
  });

  const [apiError, setApiError] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);


  const logout = useCallback(() => {
    /// @description Logout from profile.
    removeCookie("access_token");
    window.location.href = "https://oauth.florgon.space/logout"
  }, []);

  
  /// Requesting user.
  useEffect(() => {
    authMethodUserGetInfo(accessToken).then((response) => {
      setIsLoading(false);
      setApiError(undefined);
      setUser(response["success"]["user"]);
    }).catch((error) => {
      setIsLoading(false);
      setUser(undefined);
      if ("error" in error){
        _errorCheckToken(error, () => {
          removeCookie("access_token");
        });
        setApiError(error["error"]);
      }
    })
  }, [setIsLoading, setApiError, setUser]);


  // Handle error messages.
  if (apiError) return (<div className="display-5 text-danger">
    <div className="display-6 text-black">{authApiGetErrorMessageFromCode(apiError["code"])} (Code {apiError["code"]})</div> {apiError["message"]}
  </div>);
  if (error) return (<div className="display-5 text-danger">
    {error}
  </div>);

  /// Other messages.
  if (isLoading) return <div>Loading user profile information...</div>;
  if (user === undefined) return <div>Failed to load user profile information...</div>;
  
  // Get how long in days we are registered.
  const time_created = new Date(user["time_created"] * 1000);
  const registered_for_days = Math.floor((Date.now() - time_created) / (1000 * 3600 * 24));

  return (<div>
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title as="h2">Welcome, <span className="text-primary">{user["username"]}</span>!</Card.Title>
        <Card.Text>
          <span className="mb-3 mt-3">This is your Florgon services account. Your account is shared between all Florgon services.</span>
        </Card.Text>

        <InputGroup className="mb-2 shadow-sm">
          <InputGroup.Text id="username-addon">Username</InputGroup.Text>
          <FormControl
            placeholder={user["username"]}
            aria-label="Username"
            aria-describedby="username-addon"
            disabled
          />
        </InputGroup>
        <InputGroup className="mb-4 shadow-sm">
          <InputGroup.Text id="email-addon">@</InputGroup.Text>
          <FormControl
            placeholder={user["email"]}
            aria-label="Email"
            aria-describedby="email-addon"
            disabled
          />
        </InputGroup>
        <InputGroup className="mb-3 shadow-sm">
          <InputGroup.Text id="registered-for-addon">Registered for</InputGroup.Text>
          <FormControl
            placeholder={registered_for_days + " days"}
            aria-label="Registered for"
            aria-describedby="registered-for-addon"
            disabled
          />
        </InputGroup>
        
        <Row>
          <Col>
            <Button variant="warning" className="shadow-sm" onClick={logout}>Logout me</Button>
          </Col>
          <Col>
            <Button variant="primary" className="shadow-sm" href="https://florgon.space" as="a">Go to homepage</Button>
          </Col>
        </Row>

      </Card.Body>
    </Card>
    
    {!user["states"]["is_active"] && <DeactivatedBanner/>}
    {!user["states"]["is_confirmed"] && <ConfirmationBanner onResendConfirmation={() => {
      authMethodEmailResendConfirmation(accessToken);
    }}/>}
    <ServicesBanner/>
    <Footer/>
  </div>);
}

const App = function() {
  // Core application.
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col className="d-flex justify-content-center">
            <div className="text-center mt-5">
              <Profile/>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
