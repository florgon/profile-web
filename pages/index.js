import Head from 'next/head'
import useAuth from '../contexts/auth';
import Link from "next/link"
import { useState } from 'react';
import { authApiRequest } from '@kirillzhosul/florgon-auth-api';
import {InputGroup, FormControl, Container, Card, Button, Modal} from 'react-bootstrap'

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

const VIPBanner = function({onReadMore, userIsVip}){
    return (
        <Card className="shadow-sm mt-3"  border="success">
          <Card.Body>
            <Card.Title as="h2">
                Florgon VIP
            </Card.Title>
            <Card.Text>
              <span className="mb-3 mt-3">
                <div className="mb-1">
                    {userIsVip && <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
                            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
                        </svg>
                        {" "}
                        You are Florgon VIP user! Enjoy your day! Thanks for your support!
                        {" "}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
                            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
                        </svg>
                    </>}
                    {!userIsVip && <>
                        Get Florgon VIP status, to support Florgon, and get bonuses!
                    </>}
                </div>
                <Button onClick={onReadMore}>Read more</Button>
              </span>
            </Card.Text>
          </Card.Body>
        </Card>);
}

const AdminBanner = function(){
    return (
        <Card className="shadow-sm mt-3" border="danger">
          <Card.Body>
            <Card.Title as="h2">
                Welcome, master!
            </Card.Title>
            <Card.Text>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0zM8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
                {" "}
                You are granted admin privileges. You are able to access administrator pages.
                {" "}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0zM8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
            </Card.Text>
          </Card.Body>
        </Card>);

}


const calculateProfileFillness = function(user){
    const elements = [
        user?.avatar, 
        user?.first_name, user?.last_name, 
        user?.profile?.bio, user?.profile?.website, 
        user?.profile?.socials?.vk,
        user?.profile?.socials?.tg,
        user?.profile?.socials?.gh
    ];
    const fillness = 0;
    elements.forEach(element => {
        if (element === undefined) return;
        if (element == "") return;
        fillness += 100 / elements.length;
    });
    return Math.floor(fillness);
}

export default function Profile() {
    const { user, loading, isAuthenticated, requestOauthAuthorization, accessToken } = useAuth();
    const [vipModalOpened, setVipModalOpened] = useState(false);
    if (!isAuthenticated && !loading){
        requestOauthAuthorization()
        return (<div className="display-3 text-center"><b>Redirecting to authorization screen...</b></div>);
    }

    const profileFillness = calculateProfileFillness(user);
    return (<>
        <Head>
            <meta name="title" content="My developer profile" />
            <title>My Florgon profile</title>
        </Head>
        {(loading) && <div className="display-3 text-center"><b>Loading...</b></div>}
        {(!loading && isAuthenticated) && <>
            <div className="display-1 text-center">My Florgon profile</div>
            <h4 className="col-lg text-center mb-3 mt-3">
                    Your profile filled on <span className="text-primary">{profileFillness}</span>%
                    {profileFillness < 100 && <>
                        <br/>
                        Please enter more information about you!
                    </>}
                </h4>
            <div className="row mt-3">
                <div className="col-lg text-center">
                    <Link href="https://florgon.space"><a className="btn btn-outline-secondary shadow">Back to homepage</a></Link>
                </div>
                <div>
            </div>
            </div>

            {!user.states?.is_confirmed && <ConfirmationBanner accessToken={accessToken}/>}
            {!user.states?.is_active && <DeactivatedBanner/>}
            <VIPBanner onReadMore={() => setVipModalOpened(true)} userIsVip={user.states?.is_vip }/>
            {user.states?.is_admin && <AdminBanner/>}

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
                        <div className="mb-2">
                            <Link href={`https://users.florgon.space/${user.username}`}><a className="btn btn-primary shadow mb-1">Your public profile</a></Link>&nbsp;
                            <Link href="https://dev.florgon.space/profile"><a className="btn btn-outline-primary shadow mb-1">Your developer profile</a></Link>&nbsp;
                        </div>
                        <div className="mb-5">
                            <Link href="https://oauth.florgon.space/logout?revoke_all"><a className="btn btn-outline-secondary shadow mb-1">Logout from all devices</a></Link>&nbsp;
                            <Link href="https://oauth.florgon.space/logout"><a className="btn btn-outline-secondary shadow mb-1">Logout from this device</a></Link>
                        </div>
                    </Container>
                </div>
            </div>

            <Modal show={vipModalOpened} onHide={() => setVipModalOpened(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
                        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
                    </svg>
                    {" "}
                    Florgon VIP
                    {" "}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
                        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
                    </svg>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-1">
                        <div className="input-group-prepend">
                        <b>Florgon VIP</b>, is a status, that you may buy for special period of time (month, or year), if you are <b>Florgon VIP</b> user, you will receive special bonuses especially for you, and have increased limits in services.
                            <hr/>
                            Different services from <b>Florgon</b>, will give different bonuses for <b>Florgon VIP</b>. For example, <b>Gatey</b> will increase project count limitations (from 3 to 10), and other features.
                            <hr/>
                            <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Service</th>
                                <th scope="col">Bonus</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">Florgon</th>
                                <td>Faster support. VIP user badge.</td>
                                </tr>
                                <tr>
                                <th scope="row">Florgon Gatey</th>
                                <td>Increased project count (from 3 to 10)</td>
                                </tr>
                                <tr>
                                <th scope="row">...</th>
                                <td>And more bonuses!</td>
                                </tr>
                            </tbody>
                            </table>

                            <hr/>
                            <span className="text-danger">For now, payments are disabled!</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled>Buy now</Button>&nbsp;
                    <Button variant="secondary" onClick={() => setVipModalOpened(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>}
    </>)
}