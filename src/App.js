// Libraries.
import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Card, Button, InputGroup, FormControl } from 'react-bootstrap';

// Auth API.
import { authMethodUser, authApiErrorCode, authApiGetErrorMessageFromCode } from './Api';


// Where to redirect when auth expired or invalid.
const AUTH_PROVIDER_REDIRECT_URL = "https://auth.florgon.space/?";


const _errorCheckToken = function(error){
  /// @description Checks token from error and redirect if it is invalid.

  if (!("error" in error)) return;

  // Get error code.
  const error_code = error["error"]["code"];
  if (error_code == authApiErrorCode.AUTH_INVALID_TOKEN || error_code == authApiErrorCode.AUTH_EXPIRED_TOKEN || error_code == authApiErrorCode.AUTH_REQUIRED){
    // If our token is invalid.

    // Redirect to auth provider.
    window.location.href = AUTH_PROVIDER_REDIRECT_URL;
  }
}

function Profile(){
  /// @description Profile component with fetching.

  // Usings.
  const [cookies, setCookie] = useCookies(["access_token"])

  // States.
  const [error, setError] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    /// @description Logout from profile.
    setCookie("access_token", undefined);
    window.location.href = AUTH_PROVIDER_REDIRECT_URL;
  }, [setCookie]);

  /// Requesting user.
  useEffect(() => {
    authMethodUser(cookies["access_token"], (_, response) => {
      setIsLoading(false);
      setError(undefined);
      setUser(response["success"]["user"]);
    }, (_, error) => {
      setIsLoading(false);
      setUser(undefined);
      if ("error" in error){
        _errorCheckToken(error);
        setError(error["error"]);
      }
    })
  }, [setIsLoading, setError, setUser]);


  // Handle error message.
  if (error) return (<div>
    Got error when loading user profile information. 
    Code: ({error["code"]}) {authApiGetErrorMessageFromCode(error["code"])}. Message: {error["message"]}
  </div>);

  /// Other messages.
  if (isLoading) return <div>Loading user profile information...</div>;
  if (user === undefined) return <div>Failed to load user profile information...</div>;
  
  // Get how long in days we are registered.
  const time_created = new Date(user["time_created"] * 1000);
  const registered_for_days = Math.floor((Date.now() - time_created) / (1000 * 3600 * 24));

  return (<div>
    <Card className="shadow">
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
    
  </div>);
}

function App() {
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
