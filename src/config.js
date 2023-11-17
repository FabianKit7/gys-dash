

export const LOGO = "/logo.svg" 
export const LOGO_WITH_NAME = "/liftinf-logo-with-name.svg" 
export const ANALYST_NAME = "Mike P"
export const EMAIL = "hello@liftinfluence.com"

export const SCRAPER_API_URL = "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile"
export const X_RAPID_API_HOST = 'instagram-bulk-profile-scrapper.p.rapidapi.com'
export const X_RAPID_API_KEY = process.env.REACT_APP_X_RAPID_API_KEY


// export const BACKEND_URL = process.env.REACT_APP_BASE_URL;
// export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
// export const PRICE_ID = "price_1O19OjCnqUVSKo0r00jGNiwV"


export const BACKEND_URL = process.env.NODE_ENV !== 'production' ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
export const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV !== 'production' ? "pk_test_51NxVGcCnqUVSKo0rSv7GutaMAUUrmXeYBFhQMI4nMzyfEiQGka6b8GryR3ESbSegoibBeK9F2TF6eoNCWrAeJzOb00DAPmHDiu" : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

export const PRICE_ID = process.env.NODE_ENV !== 'production' ? "price_1O19ITCnqUVSKo0rnNCxRPoQ" : "price_1O19OjCnqUVSKo0r00jGNiwV"

const live_prices = [
    { planId: 'price_1O878gCnqUVSKo0rL6jzNUJA', value: '79.95', name: 'Standard', type: '1 month' },
    // { planId: '', value: '133', name: 'Start', type: '3 months' },
    // { planId: '', value: '117', name: 'Start', type: '6 months' },

    { planId: 'price_1O879kCnqUVSKo0rBOhlx62v', value: '129.95', name: 'Turbo', type: '1 month' },
    // { planId: '', value: '221', name: 'Professional', type: '3 months' },
    // { planId: '', value: '199', name: 'Professional', type: '6 months' },

    // { planId: '', value: '347', name: 'Elite', type: '1 month' },
    // { planId: '', value: '311', name: 'Elite', type: '3 months' },
    // { planId: '', value: '277', name: 'Elite', type: '6 months' },
]
// const test_prices = [
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '147', name: 'Start', type: '1 month' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '133', name: 'Start', type: '3 months' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '117', name: 'Start', type: '6 months' },

//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '247', name: 'Professional', type: '1 month' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '221', name: 'Professional', type: '3 months' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '199', name: 'Professional', type: '6 months' },

//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '347', name: 'Elite', type: '1 month' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '311', name: 'Elite', type: '3 months' },
//     { planId: 'price_1NcosTJqmKOYlLGobsjK81cK', value: '277', name: 'Elite', type: '6 months' }
// ]

export const SUBSCRIPTION_PLANS = live_prices;

// SMS templates
export const INCORRECT_PASSWORD_SMS_TEMPLATE = () => {
  return `
  It seems the Instagram password you entered is incorrect. Please re-enter your password in your LiftInfluence dashboard for us to proceed.
`;
};

export const TWOFAC_BACKUP_SMS_TEMPLATE = () => {
  return `
  LiftInfluence needs your Instagram backup code to complete the login process. Please enter it in your dashboard. Find the guide here: https://help.instagram.com/1006568999411025
`;
};

export const TWOFAC_CODE_SMS_TEMPLATE = () => {
  return `
  We're almost there! Please enter the two-factor authentication code you received from Instagram in your LiftInfluence dashboard.
`;
};

export const CHECKING_SMS_TEMPLATE = () => {
  return `
  To start your growth on LiftInfluence, please check your Instagram activity for a foreign login request and confirm by clicking 'This was me'.
`;
};

export const ACTIVE_SMS_TEMPLATE = () => {
  return `
  Great news! Your account is now active on LiftInfluence. Expect to see your Instagram growth begin within the next 8 hours!
`;
};

export const CANCELLED_SMS_TEMPLATE = () => {
  return `
  We are sorry to see you go! 😞 Your LiftInfluence subscription has been successfully cancelled.
`;
};

export const TRUSTPILOT_SMS_TEMPLATE = () => {
  return `
  👋We hope you're enjoying LiftInfluence! Mind leaving us a review on Trustpilot? We'll extend your subscription by 7 days if you do so: https://www.trustpilot.com/review/liftinfluence.com
`;
};

export const NOT_CONNECTED_SMS_TEMPLATE = (full_name) => {
  return `
  ${
    full_name && `${full_name}, `
  }Welcome to LiftInfluence! To get started, please connect your Instagram account. Let's start with your growth now!
`;
};


// email templates
export const INCORRECT_PASSWORD_TEMPLATE = (full_name, username) => {
    return `
<div>
<p class="MsoNormal"><span lang="EN">Dear <b>${full_name}</b>,</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">We regret to inform you that the password
provided for @<b>${username}</b>, to access our service is incorrect. We kindly request
you to attempt re-logging into your dashboard by following this <a href="http://app.liftinfluence.com"><span style="color:#1155CC">link</span></a>.
Once the correct password is provided, our team will proceed to log in to your
account within the next 24 hours.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Should you require further assistance, please
do not hesitate to contact us at ${EMAIL}.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Best regards,</span></p>

<p class="MsoNormal"><span class="SpellE"><span lang="EN">LiftInfluence</span></span><span lang="EN"> Team</span></p>
</div>
`
}

// export const TWO_FACTOR_TEMPLATE = (full_name, username) => {
//     return `
// <div>
// <p class="MsoNormal"><span lang="EN">Hey <b>${full_name}</b>,</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">We regret to inform you that your account @<b>${username}</b>
// has two-factor authentication enabled, which is currently preventing us from
// accessing the necessary information to initiate our service. We understand the
// importance of account security, and we want to assure you that your account's
// safety is our utmost priority.</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">In order for our team to proceed with logging
// into your account and commencing the service, we kindly request you to
// temporarily disable the two-factor authentication feature. To do so, please
// follow these steps:</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">Access your Instagram account.</span></p>

// <p class="MsoNormal"><span lang="EN">Navigate to the "Settings" section.</span></p>

// <p class="MsoNormal"><span lang="EN">Locate and select the "Security"
// option.</span></p>

// <p class="MsoNormal"><span lang="EN">Find the "Two-Factor Authentication"
// settings.</span></p>

// <p class="MsoNormal"><span lang="EN">Disable the two-factor authentication feature.</span></p>

// <p class="MsoNormal"><span lang="EN">Once the two-factor authentication is
// disabled, our team will be able to log into your account within the next 24
// hours to initiate the requested service. We assure you that all necessary
// precautions will be taken to safeguard your account and ensure its security
// throughout the process.</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">After completing the steps above we kindly
// request you to attempt re-logging into your dashboard by following this <a href="http://app.liftinfluence.com"><span style="color:#1155CC">link</span></a></span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">If you have any concerns or require further
// assistance, please do not hesitate to reach out to us at
// ${EMAIL}. Our dedicated support team is ready to assist you.</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">Thank you for your cooperation.</span></p>

// <p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

// <p class="MsoNormal"><span lang="EN">Kind regards,</span></p>

// <p class="MsoNormal"><span class="SpellE"><span lang="EN">LiftInfluence</span></span><span lang="EN"> Team</span></p>
// </div>

// `
// }

export const TWO_FACTOR_TEMPLATE = (full_name, username) => {
    return `
    <div class="">
        <p class="MsoNormal"><span lang="EN">Hey <b>${full_name}</b>,<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">We regret to inform you that your account
        <b>@${username}</b> has two-factor authentication enabled, which is currently preventing
        us from accessing the necessary information to initiate our service. We
        understand the importance of account security, and we want to assure you that
        your account's safety is our utmost priority.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><span> </span><o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">In order for our team to proceed with logging
        into your account and commencing the service, we kindly request you to provide
        us with your two-factor authentication backup code or SMS code. To do so,
        please follow these steps:<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">1. Access your <span class="SpellE">Instagram</span>
        account and Navigate to the "Settings" section.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN">2. Navigate to the "Accounts Centre"
        and click on "Password and Security" option.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN">3. Locate and select "Two-factor
        authentication", then click on your <span class="SpellE">Instagram</span>
        account.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN">4. Click on "Additional Methods" and
        select "Backup codes".<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN">5. Copy one 8-digit code and paste it into
        your <span class="SpellE">LiftInfluence</span> dashboard.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">Once the two-factor authentication backup code
        is provided, our team will be able to log into your account within the next 12
        hours to initiate the requested service. We assure you that all necessary
        precautions will be taken to safeguard your account and ensure its security
        throughout the process.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">After completing the steps above we kindly
        request you to attempt re-logging into your dashboard by following this <a href="https://app.liftinfluence.com/">link</a></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">If you have any concerns or require further
        assistance, please do not hesitate to reach out to us at
        <a href="mailto:${EMAIL}">${EMAIL}</a>. Our dedicated support team is ready to assist you. <o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">Thank you for your cooperation.<o:p /></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN">Kind regards,<o:p /></span></p>

        <p class="MsoNormal"><span class="SpellE"><span lang="EN">LiftInfluence</span></span><span lang="EN"> Team</span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

        <p class="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>
    </div>
    `
}

export const NOT_CONNECTED_TEMPLATE = (full_name) => {
    return `
<div>
<p class="MsoNormal"><span lang="EN">Dear <b>${full_name}</b>,</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">We would like to bring to your attention that
you are currently not connected to our service. We kindly request you to
establish the connection at your earliest convenience by clicking on the
provided <a href="http://app.liftinfluence.com"><span style="color:#1155CC">link</span></a>.
By doing so, we can promptly initiate the growth process for your account.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Once you enter your login credentials, our
team will proceed to connect to your account within the next 24 hours to begin
the desired growth.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Please be aware that you may receive a login
attempt notification from us on Instagram. To ensure a seamless connection, we
kindly ask you to acknowledge the attempt by clicking on the "That Was
Me" option. This will grant us the necessary access to your account in
order to commence the growth process.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Furthermore, we would like to emphasize the
importance of selecting appropriate targets. We recommend entering 10-20
targets initially and periodically adjusting them on a monthly basis to achieve
optimal growth results.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">If you have any inquiries or require further
assistance, please do not hesitate to contact us. We are committed to providing
you with the support you need.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Thank you for your cooperation.</span></p>

<p class="MsoNormal"><span lang="EN"><o:p>&nbsp;</o:p></span></p>

<p class="MsoNormal"><span lang="EN">Kind regards,</span></p>

<p class="MsoNormal"><span class="SpellE"><span lang="EN">LiftInfluence</span></span><span lang="EN"> Team.</span></p>
</div>
`
}

export const ACTIVE_TEMPLATE = (full_name, username) => {
    return `
        <div>
            <p className="MsoNormal"><span lang="EN">Dear <b>${full_name}</b>,<o:p /></span></p><p className="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

            <p className="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

            <p className="MsoNormal"><span lang="EN">We are thrilled to inform you that your
            account <b>@${username}</b> has been successfully linked with <span className="SpellE">LiftInfluence</span>!
            You can expect to witness growth within just 12 hours on your account. Should
            you have any inquiries or require any assistance, please don't hesitate to
            reach out to us at <a href='mailto:${EMAIL}'>${EMAIL}</a>.<o:p /></span></p>

            <p className="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

            <p className="MsoNormal"><span lang="EN">Thank you for choosing <span className="SpellE">LiftInfluence</span>
            to enhance your social media experience!<o:p /></span></p>

            <p className="MsoNormal"><span lang="EN"><o:p> </o:p></span></p>

            <p className="MsoNormal"><span lang="EN">Best Regards,<o:p /></span></p>

            <p className="MsoNormal"><span lang="EN">The <span className="SpellE">LiftInfluence</span>
            Team</span></p>
        </div>
    `
}

export const CHECKING_TEMPLATE = (full_name, username) => {
    return `
        <div className="WordSection1">
            <p className="MsoNormal" style={{ lineHeight: "150%" }}>Hey ${full_name},<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>We regret to inform you that your
            account @${username} has to confirm our login request, which is currently
            preventing us from starting our service. We understand the importance of
            account security, and we want to assure you that your account's safety is our
            utmost priority.<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>In order for our team to proceed
            with logging into your account and commencing the service, we kindly request
            you confirm our login request. To do so, please follow these steps:<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>1. Access your <span className="SpellE">Instagram</span>
            account and Navigate to the "Notifications" section by clicking a
            Heart button.<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>2. Find the "An <span className="SpellE">unrecognised</span> device just logged in near location" and
            click on it.<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>3. Locate and select the button
            "This was me".<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>Once the "This was me"
            button is clicked, our team will be able to log into your account within the
            next 12 hours to initiate the requested service. We assure you that all
            necessary precautions will be taken to safeguard your account and ensure its
            security throughout the process.</p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>After completing the steps above we
            kindly request you to attempt re-logging into your dashboard by following this
            <a href="app.liftinfluence.com">link</a><o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>If you have any concerns or require
            further assistance, please do not hesitate to reach out to us at
            <a href="mailto:${EMAIL}">${EMAIL}</a>. Our dedicated support team is ready to assist you.<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>Thank you for your cooperation.<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}><o:p> </o:p></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}>Kind regards,<o:p /></p>

            <p className="MsoNormal" style={{ lineHeight: "150%" }}><span className="SpellE">LiftInfluence</span>
            Team</p>

            </div>
    `
}