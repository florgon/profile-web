import Head from 'next/head'
import useAuth from '../contexts/auth';
import Link from "next/link"
import { useState } from 'react';
import { authApiRequest } from '@kirillzhosul/florgon-auth-api';
import {InputGroup, FormControl, Container, Card} from 'react-bootstrap'

const ConfirmationBanner = function({accessToken}){
/// @description Banner component for not confirmed users.
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Card className="shadow-sm mt-3" border="warning">
            <Card.Body>
                <Card.Title as="h2">Please confirm your email!</Card.Title>
                <Card.Text>
                <div className="mb-1 mt-3">Confirmation link will be sent to your email.</div>
                {!(isLoading || isSent) && 
                    <div className="btn btn-primary btn-sm" onClick={() => {
                        setIsLoading(true);
                        authApiRequest("_emailConfirmation.resend", "", accessToken).then(() => {
                            setIsLoading(false);
                            setIsSent(true);
                        }).catch(() => {
                            setIsLoading(false);
                        })
                    }}>Resend confirmation email</div>
                }
                {(isLoading && !isSent) && 
                    <div className="btn btn-secondary btn-sm" disabled>Sending...</div>
                }
                {(!isLoading && isSent) && 
                    <div className="btn btn-success btn-sm" disabled>Email was sent to you!</div>
                }
                </Card.Text>
            </Card.Body>
        </Card>);
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


export default function Profile() {
    const { user, loading, isAuthenticated, requestOauthAuthorization, accessToken } = useAuth();
    if (!isAuthenticated && !loading){
        requestOauthAuthorization()
        return (<div className="display-3 text-center"><b>Redirecting to authorization screen...</b></div>);
    }

    return (<>
        <Head>
            <meta name="title" content="My developer profile" />
            <title>My Florgon profile</title>
        </Head>
        {(loading) && <div className="display-3 text-center"><b>Loading...</b></div>}
        {(!loading && isAuthenticated) && <>
            <div className="display-1 text-center">My Florgon profile</div>
            <div className="row mt-3">
                <div className="col-lg text-center">
                    <Link href="https://florgon.space"><a className="btn btn-outline-secondary shadow">Back to homepage</a></Link>
                </div>
            </div>
            {!user.states?.is_confirmed && <ConfirmationBanner accessToken={accessToken}/>}
            {!user.states?.is_active && <DeactivatedBanner/>}
            <div className="row mt-5 mb-5">
                <div className="col-lg ml-lg-5 text-left">
                    <Container fluid className="w-75">
                        <InputGroup className="mb-2 shadow-sm">
                            <InputGroup.Text id="username-addon">Username</InputGroup.Text>
                            <FormControl
                                placeholder={user.username}
                                aria-label="Username"
                                aria-describedby="username-addon"
                                disabled
                            />
                        </InputGroup>
                        <InputGroup className="mb-3 shadow-sm">
                            <InputGroup.Text id="email-addon">E-Mail</InputGroup.Text>
                            <FormControl 
                                placeholder={user.email}
                                aria-label="Email"
                                aria-describedby="email-addon"
                                disabled
                            />
                        </InputGroup>

                        <InputGroup className="mb-4 shadow-sm">
                            <div className="input-group-prepend">
                                <span className="input-group-text">First name</span>
                            </div>
                            <FormControl placeholder="Not set" aria-label="First name" type="text" value={user.first_name} read-only/>
                            <div className="input-group-prepend">
                                <span className="input-group-text">Last name</span>
                            </div>
                            <FormControl placeholder="Not set" aria-label="Last name" type="text" value={user.last_name} read-only/>
                        </InputGroup>

                        <InputGroup className="mb-5">
                            <InputGroup.Text id="privacy-profile-public-addon">Keep my public profile private</InputGroup.Text>
                            <InputGroup.Checkbox
                                disabled
                            />
                            <InputGroup.Text id="privacy-profile-public-addon">Show my public profile only for authorized users</InputGroup.Text>
                            <InputGroup.Checkbox
                                disabled
                            />
                        </InputGroup>

                        <InputGroup className="mb-2 shadow-sm">
                            <InputGroup.Text id="about-me-addon">About me</InputGroup.Text>
                            <FormControl as="textarea"
                                placeholder="You has not written anything about yourself..."
                                value={user.profile?.bio}
                                aria-label="About me"
                                aria-describedby="about-me-addon"
                                read-only
                            />
                        </InputGroup>

                        <InputGroup className="mb-2 shadow-sm">
                            <InputGroup.Text id="website-addon">Website</InputGroup.Text>
                            <FormControl 
                                placeholder="Your personal website URL"
                                value={user.profile?.website}
                                aria-label="Email"
                                aria-describedby="website-addon"
                                read-only
                            />
                        </InputGroup>

                        <InputGroup className="mb-5 shadow-sm">
                            <InputGroup.Text id="vk-username-addon">VK username</InputGroup.Text>
                            <FormControl 
                                placeholder="{username}"
                                value={user.profile?.socials?.vk}
                                aria-label="VK username"
                                aria-describedby="vk-username-addon"
                                read-only
                            />
                            <InputGroup.Text id="telegram-username-addon">Telegram username</InputGroup.Text>
                            <FormControl 
                                placeholder="{username}"
                                value={user.profile?.socials?.tg}
                                aria-label="Telegram username"
                                aria-describedby="telegram-username-addon"
                                read-only
                            />
                            <InputGroup.Text id="github-username-addon">GitHub username</InputGroup.Text>
                            <FormControl 
                                placeholder="{username}"
                                value={user.profile?.socials?.gh}
                                aria-label="GitHub username"
                                aria-describedby="github-username-addon"
                                read-only
                            />
                        </InputGroup>



                        <InputGroup className="mb-4 shadow-sm">
                            <InputGroup.Text id="registered-for-addon">Florgon member since</InputGroup.Text>
                            <FormControl
                                placeholder={`${new Date(user.time_created * 1000).toDateString()} (${Math.floor((Date.now() - new Date(user.time_created * 1000)) / (1000 * 3600 * 24))} days)`}
                                aria-label="Florgon member for"
                                aria-describedby="registered-for-addon"
                                disabled
                            />
                        </InputGroup>
                        <Link href={`https://users.florgon.space/${user.username}`}><a className="btn btn-primary shadow mb-1">Your public profile</a></Link>&nbsp;
                        <Link href="https://dev.florgon.space/profile"><a className="btn btn-outline-primary shadow mb-1">Your developer profile</a></Link>&nbsp;
                        <Link href="https://oauth.florgon.space/logout?revoke_all"><a className="btn btn-outline-secondary shadow mb-1">Logout from all devices</a></Link>
                    </Container>
                </div>
            </div>
        </>}
    </>)
}