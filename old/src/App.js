
{!user["states"]["is_active"] && <DeactivatedBanner/>}
{!user["states"]["is_confirmed"] && <ConfirmationBanner onResendConfirmation={() => {
authMethodEmailResendConfirmation(accessToken);
}}/>}