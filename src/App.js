// Libraries.
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

// Auth API.
import { authMethodUser, authApiErrorCode, authApiGetErrorMessageFromCode } from './Api';


// Where to redirect when auth expired or invalid.
const AUTH_PROVIDER_REDIRECT_URL = "https://auth.florgon.space/?";


const _errorCheckToken = function(error){
  /// @description Checks token from error and redirect if it is invalid.

  if (!("error" in error)) return;

  // Get error code.
  const error_code = error["error"]["code"];
  if (error_code == authApiErrorCode.AUTH_INVALID_TOKEN || error_code == authApiErrorCode.AUTH_EXPIRED_TOKEN){
    // If our token is invalid.

    // Redirect to auth provider.
    //window.location.href = AUTH_PROVIDER_REDIRECT_URL;
  }
}

function Profile(){
  /// @description Profile component with fetching.

  // Usings.
  const [cookies] = useCookies(["access_token"])

  // States.
  const [error, setError] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

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
  
  return (<div>
    Welcome, {user["username"]}!
    Your user id: {user["id"]}. Your email: {user["email"]}. Your account created at: {new Date(user["time_created"]  * 1000).toString()}
    
  </div>);

}
function App() {
  // Core application.
  return (
    <div className="App">
      <div className="row">
          <div className="col d-flex justify-content-center">
              <Profile/>
          </div>
      </div>
    </div>
  );
}

export default App;
