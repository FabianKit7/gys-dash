

export const LOGO = "/Android.png" 
export const LOGO_WITH_NAME = "/color-logo-no-background.svg" 
export const ANALYST_NAME = "Mike P"
export const EMAIL = "hello@grow-your-social.com"

export const SCRAPER_API_URL = "https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile"
export const X_RAPID_API_HOST = 'instagram-bulk-profile-scrapper.p.rapidapi.com'
export const X_RAPID_API_KEY = process.env.REACT_APP_X_RAPID_API_KEY


// export const BACKEND_URL = process.env.REACT_APP_BASE_URL;
// export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
// export const PRICE_ID = "price_1OUrTuGqRSmA1tlM2kYgY0te" #test


export const BACKEND_URL = process.env.NODE_ENV !== 'production' ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
export const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV !== 'production' ? "pk_test_51LY8WXGqRSmA1tlMTNHaLNLdBJHPu4FwoSbT3zfIUFFHq8anMSnhyjLKbZvDb3qtANHaCbJ7UBSpWUhelCjyGCZK00C0WOHKPX" : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

export const PRICE_ID = process.env.NODE_ENV !== 'production' ? "price_1OUrSOGqRSmA1tlMhbLQZR1E" : "price_1OUrTuGqRSmA1tlM2kYgY0te"

const live_prices = [
  { planId: 'price_1OUrTuGqRSmA1tlM2kYgY0te', value: '74.99', name: 'Monthly', type: '1 month' },
  { planId: 'price_1OVYrOGqRSmA1tlM4ROGR9QQ', value: '185.99', name: 'Quaterly', type: '1 month' }
]

const test_prices = [
  { planId: 'price_1OUrSOGqRSmA1tlMhbLQZR1E', value: '74.99', name: 'Monthly', type: '1 month' },
  { planId: 'price_1OVYuCGqRSmA1tlMYhpZYax0', value: '185.99', name: 'Quaterly', type: '1 month' }
]

export const SUBSCRIPTION_PLANS = process.env.NODE_ENV === 'production' ?  live_prices : test_prices;

// SMS templates
export const INCORRECT_PASSWORD_SMS_TEMPLATE = () => {
  return `
  It seems the Instagram password you entered is incorrect. Please re-enter your password in your Grow-your-social dashboard for us to proceed.
`;
};

export const TWOFAC_BACKUP_SMS_TEMPLATE = () => {
  return `
  Grow-your-social needs your Instagram backup code to complete the login process. Please enter it in your dashboard. Find the guide here: https://help.instagram.com/1006568999411025
`;
};

export const TWOFAC_CODE_SMS_TEMPLATE = () => {
  return `
  We're almost there! Please enter the two-factor authentication code you received from Instagram in your Grow-your-social dashboard.
`;
};

export const CHECKING_SMS_TEMPLATE = () => {
  return `
  To start your growth on Grow-your-social, please check your Instagram activity for a foreign login request and confirm by clicking 'This was me'.
`;
};

export const ACTIVE_SMS_TEMPLATE = () => {
  return `
  Great news! Your account is now active on Grow-your-social. Expect to see your Instagram growth begin within the next 8 hours!
`;
};

export const CANCELLED_SMS_TEMPLATE = () => {
  return `
  We are sorry to see you go! 😞 Your Grow-your-social subscription has been successfully cancelled.
`;
};

export const TRUSTPILOT_SMS_TEMPLATE = () => {
  return `
  👋We hope you're enjoying Grow-your-social! Mind leaving us a review on Trustpilot? We'll extend your subscription by 7 days if you do so: https://www.trustpilot.com/review/grow-your-social.com
`;
};

export const NOT_CONNECTED_SMS_TEMPLATE = (full_name) => {
  return `
  ${
    full_name && `${full_name}, `
  }Welcome to Grow-your-social! To get started, please connect your Instagram account. Let's start with your growth now!
`;
};

export const RETENTION_SMS_1 = () => {
  return `
  Hi👋 We've noticed you haven't completed your registration at Grow-your-social. Go back to our website and complete it within a minute! It's a service, not a marriage..
`;
};

export const RETENTION_SMS_2 = () => {
  return `
  Hey👋 Complete your Grow-your-social registration today and get an additional 7 days of growth to your first month. Let's start growing your Instagram presence!
`;
};

export const RETENTION_SMS_3 = () => {
  return `
  Get additional 14 days of Instagram growth by completing your Grow-your-social registration within the next day. We are eager to see you! 🥳
`;
};


// email templates
export const INCORRECT_PASSWORD_TEMPLATE = (full_name, username) => {
  // Your password is incorrect
  return `
  <style type="text/css">
  p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times}
  p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times; min-height: 14.0px}
  span.s1 {text-decoration: underline ; color: #2f5496}
</style>
<p class="p1">Dear <b>${username}</b>,</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">we regret to inform you that the password provided for <b>@${username}</b>, to access our service, is incorrect.<span class="Apple-converted-space"> </span></p>
<p class="p1">We kindly ask you to attempt re-logging into your dashboard by following this <a href="https://app.grow-your-social.com" class="s1">link</a>.<span class="Apple-converted-space"> </span></p>
<p class="p1">Once the correct password is provided, our team will proceed to log in to your account within the next 24 hours.</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">Should you require further assistance, please do not hesitate to answer to this e-mail or contact us at <a href="mailto:support@grow-your-social.com">support@grow-your-social.com</a>.</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">Best regards,</p>
<p class="p2"><br></p>
<p class="p1">Grow-Your-Social Team</p>
  `
}

export const TWO_FACTOR_TEMPLATE = (full_name, username) => {
  // 2FA backup codes required
    return `
    <style type="text/css">
  p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times}
  p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times; min-height: 14.0px}
  p.p3 {margin: 0.0px 0.0px 0.0px 36.0px; font: 12.0px Times}
  span.s1 {text-decoration: underline ; color: #2f5496}
  span.s2 {color: #2f5496}
  span.Apple-tab-span {white-space:pre}
</style>
<p class="p2"><br></p>
<p class="p1">Dear <b>@${username}</b>,</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">We regret to inform you that we do not have access to <b>@${username}</b>, because two factor authentication is enabled.</p>
<p class="p1">But that is not a problem! We simply need one of your Backup Codes to login.<br>
</p>
<p class="p1">Here is a step by step guide on where to find them in Instagram:</p>
<p class="p2"><br></p>
<p class="p3"><span class="Apple-tab-span">	</span>•<span class="Apple-tab-span">	</span>Tap or your profile picture in the bottom right to go to your profile.</p>
<p class="p3"><span class="Apple-tab-span">	</span>•<span class="Apple-tab-span">	</span>Tap in the top right, then tap Settings and privacy.</p>
<p class="p3"><span class="Apple-tab-span">	</span>•<span class="Apple-tab-span">	</span>Tap Security, then tap Two-Factor Authentication.</p>
<p class="p3"><span class="Apple-tab-span">	</span>•<span class="Apple-tab-span">	</span>Tap Additional Methods.</p>
<p class="p3"><span class="Apple-tab-span">	</span>•<span class="Apple-tab-span">	</span>Tap Backup Codes.</p>
<p class="p2"><br></p>
<p class="p1">Please provide them using this <a href="https://app.grow-your-social.com" class="s1">link</a><span class="s2"> </span>to your dashboard.</p>
<p class="p1">Our team will attempt to login within 24h. If we need any additional help from your side, we will let you know!<br>
<br>
Should you require further assistance, please do not hesitate to answer to this e-mail or contact us at <a href="mailto:support@grow-your-social.com">support@grow-your-social.com</a>.</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">Best regards,</p>
<p class="p2"><br></p>
<p class="p1">Grow-Your-Social Team</p>
<p class="p2"><br></p>
    `
}

export const NOT_CONNECTED_TEMPLATE = (full_name, username) => {
    //Your account is not connected
    return `
    <style type="text/css">
  p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times}
  p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times; min-height: 14.0px}
  span.s1 {text-decoration: underline ; color: #2f5496}
  span.s2 {color: #2f5496}
</style>
<p class="p2"><br></p>
<p class="p1">Dear <b>${username}</b>,<br>
</p>
<p class="p1"><br>
with this e-mail we want to confirm your order for @<b>${username}</b>.<br>
Thank you for working with us!</p>
<p class="p1"><br>
Important next steps: <br>
Please <b>connect your account</b> by using this <a href="https://app.grow-your-social.com" class="s1">link</a><span class="s2"> </span>or your Dashboard on our website.<br>
</p>
<p class="p1">Once connected we will proceed with the login and get back to you within 24h. <br>
When we login you might see a notification in Instagram informing you about the new login. We kindly ask you to confirm it in order for us to achieve results as soon as possible.</p>
<p class="p1"> </p>
<p class="p1">Furthermore, we would like to emphasize the importance of selecting appropriate targets in your dashboard. Good target accounts are accounts that are similar to yours. Their followers will be most likely to be interested in your content as well.<br>
We recommend entering 10-20 targets initially and periodically adjusting them for optimal growth results.</p>
<p class="p2"><br></p>
<p class="p1"> </p>
<p class="p1">If you want our team to select targets for you, please simply connect your account and answer to this e-mail with “please help me select targets”.<br>
We are committed to providing you with the support you need.</p>
<p class="p1"> <br>
<br>
</p>
<p class="p1">Thank you for working with us!<br>
</p>
<p class="p1">Best regards,</p>
<p class="p2"><br></p>
<p class="p1">Grow-Your-Social Team</p>
    `
}

export const ACTIVE_TEMPLATE = (full_name, username) => {
  //We are ready to go!
    return `
    <style type="text/css">
  p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times}
  p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times; min-height: 14.0px}
  span.s1 {font: 12.0px 'Apple Color Emoji'}
</style>
</p>
<p class="p2"><br></p>
<p class="p1">Dear <b>${username}</b>,</p>
<p class="p2"><br></p>
<p class="p2"><br></p>
<p class="p1">we wanted to let you know that everything has worked smoothly and we already started growing your account. If we need anything from you or have further questions during our collaboration, we will let you know!</p>
<p class="p1"><br>
There are a few more things you can do in your dashboard on our website besides tracking your growth, and we would like to give you more <b>detailed information.<br>
<br>
</b>Note that the information below is not mandatory for you to know, but we want to give you these options in case you want to have more control yourself<span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1"><span class="s1">✅ </span><b>AI Filters:</b></p>
<p class="p1">As you know our AI analyzes the followers of your target accounts before we make them aware of your account. This way you will - in average - receive higher quality followers than your target accounts.</p>
<p class="p1">At the end of this e-mail you will find a list of the default AI filters that we currently use.<br>
In your dashboard you have the option to adjust your filters. <br>
But keep in mind – being too strict can lead to less follower growth.<br>
Our recommendation is to keep filters unchanged, but we want to give you the option to change them if needed.</p>
<p class="p2"><br></p>
<p class="p1"><span class="s1">✅ </span><b>Whitelist:</b></p>
<p class="p1">The whitelist in your dashboard can be used to let our team know you would like to follow someone they have followed permanently.</p>
<p class="p1">By default all users that our team likes and follows are added to a list and everyone on that list will be unfollowed. Please note we only unfollow accounts that we have “followed first”.<br>
Accounts that we have never followed, you do not need to add to the whitelist.<span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1"><span class="s1">✅ </span><b>Blacklist:</b></p>
<p class="p1">The blacklist in your dashboard can be used to let our team know if there is someone you do not want us to like or follow. This can be used if you have any close competitors that we should not like.<br>
<br>
<br>
<br>
Default AI filters used for good growth and quality:<br>
</p>
<p class="p1">- Accounts need to have more than 6 posts.</p>
<p class="p1">- Accounts need to have less than 3000 followings (= other people they follow).</p>
<p class="p1">- Accounts need to have more than 50 followers.</p>
<p class="p1">- Accounts may never be followed twice.</p>
<p class="p1">- Accounts that follow or like you may be liked more often.</p>
<p class="p1">- Accounts that do not follow you may only be liked on one day.</p>
<p class="p1">- Accounts may not have any forbidden words in their name or bio. Contact us to add new words.</p>
<p class="p1">- Accounts are prioritized if they use a common first name in their name.</p>
<p class="p1"><br>
</p>
<p class="p1">Thank you for working with us! We are excited for this partnership!<br>
</p>
<p class="p1">Should you require any further assistance, please do not hesitate to answer to this e-mail or contact us at <a href="mailto:support@grow-your-social.com">support@grow-your-social.com</a>.<br>
<br>
</p>
<p class="p1">Best regards,</p>
<p class="p2"><br></p>
<p class="p1">Grow-Your-Social Team</p>
<p class="p2"><br></p>
<p class="p2"><br></p>
    `
}

export const CHECKING_TEMPLATE = (full_name, username) => {
  //Please click „it was me“
    return `
    <style type="text/css">
  p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times}
  p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Times; min-height: 14.0px}
</style>
</p>
<p class="p1">Dear <b>${username}</b>,</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p1">we wanted to let you know that we already logged in and everything worked perfectly.</p>
<p class="p1">If you open Instagram now you will see a notification informing you about a new login from a new device.<br>
</p>
<p class="p1">Please approve our login by clicking “<b>it was me</b>” on the notification.</p>
<p class="p1">Once approved we will start working within only a few hours.<br>
</p>
<p class="p1">Once this is done our team will send you more information on how to use your new dashboard on our website. We are excited to start!<br>
<br>
</p>
<p class="p1">Should you require further assistance, please do not hesitate to answer to this e-mail or contact us at <a href="mailto:support@grow-your-social.com">support@grow-your-social.com</a>.</p>
<p class="p2"><br></p>
<p class="p2"><span class="Apple-converted-space"> </span></p>
<p class="p2"><br></p>
<p class="p1">Best regards,</p>
<p class="p2"><br></p>
<p class="p1">Grow-Your-Social Team</p>
    `
}