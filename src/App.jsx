import { Routes, Route, useLocation } from "react-router-dom";
import Search from "./pages/Search";
import Dashboard from "./components/Dashboard";
// import Subscriptions from "./pages/Subscriptions";
import Subscriptions from "./pages/Subscriptions_new";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
// import Home from "./components/Home";
import Settings from "./components/Settings/Settings";
import Admin from "./components/Admin/Admin";
// import Nav from "./components/Nav";
import { useEffect } from "react";
// import DashboardApp from "./dashboard";
import Edit from "./dashboard/edit";
// import AdminLogin from "./dashboard/adminLogin";
import ForgetPassword from "./pages/forgetPassword";
import ResetPassword from "./pages/resetPassword";
import Chat from "./pages/chat";
import Tap from "@tapfiliate/tapfiliate-js";
import Thankyou from "./pages/Thankyou";
import { useState } from "react";
import ManageAccounts from "./pages/ManageAccounts";
import ManagePage from "./pages/admin/ManagePage";
import Retention from "./pages/admin/Retention";
import FreeTrialAllowed from "./pages/admin/FreeTrialAllowed";
// import EmailUnsubscribe from "./pages/Unsubscribe";
// import { getCookie } from "./helpers";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BACKEND_URL, STRIPE_PUBLISHABLE_KEY } from "./config";
import axios from "axios";
import { supabase } from "./supabaseClient";

// console.log("STRIPE_PUBLISHABLE_KEY");
// console.log(STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function App() {
  // const pathname = window.location.pathname;
  const location = useLocation();
  useEffect(() => {
    // const clickId = getCookie('_vid_t')
    // console.log(clickId);
    Tap.init(
      process.env.REACT_APP_TAPFILIATE_ACCOUNT_ID, // your account ID
      { integration: "javascript" }, // createOptions with cookie domain set to your main domain
      // createCallback function
      function () {
        // console.log('Tracking code initialized');
      },
      { cookie_domain: ".grow-your-social.com", always_callback: true }, // detectOptions with always_callback set to true to ensure detectCallback is always called
      function (error, result) {
        // console.log("error: ", error);
        // console.log('Click tracked successfully');
        // console.log("result: ", result);
        // You can set the click ID to a cookie here if necessary
      } // detectCallback function
    );
  }, []);

  const [addPadding, setAddPadding] = useState(true);
  useEffect(() => {
    if (location.pathname.includes("/search") || location.pathname.startsWith("/subscriptions")) {
      setAddPadding(false);
    }else{
      setAddPadding(true);
    }
  }, [location]);

  const [clientSecret, setClientSecret] = useState("");
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    const _getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from("users")
        .select()
        .eq("auth_user_id", authUser?.id)
        .eq("first_account", true)
        .single();
      setUser(data);
    };
    _getUser();
  }, []);

  // setClientSecret
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const fetch = async () => {
      if (!location.pathname.startsWith("/subscriptions")) return;

      let setupIntentRes = await axios
        .post(`${BACKEND_URL}/api/stripe/create_setupIntent`, {
          name: user?.full_name || user?.username,
          email: user?.email,
          username: user?.username
        })
        .then((response) => response.data);
      // .catch((err) => {
      //   console.log(err);
      // });

      // console.log("setupIntentRes");
      // console.log(setupIntentRes);

      if (setupIntentRes) {
        setClientSecret(setupIntentRes.clientSecret);
      }
    };
    fetch();
  }, [location, user]);

  const appearance = {
    // theme: 'stripe',
    theme: "flat",
    variables: {
      colorPrimaryText: "#fff",
      colorPrimary: "#EF5F3C",
      // fontFamily: 'Ideal Sans, system-ui, sans-serif',
      // colorBackground: '#ffffff',
    },
  };
  const options = {
    // mode: 'subscription',
    // amount: 9999,
    // currency: 'usd',
    clientSecret,
    appearance,
  };

  return (
    <div className="bg-[#F8F8F8]">
      {/* <div className="max-w-[1600px] mx-auto p-5 font-MontserratRegular"> */}
      <div
        className={`${
          addPadding ? "p-4 md:p-5 max-w-[1400px] mx-auto" : "p-0"
        } font-MontserratRegular`}
      >
        {/* <nav>slkdfjl</nav> */}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route index element={<Login />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/unsubscribe" element={<EmailUnsubscribe />} /> */}
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/forget-password" exact element={<ForgetPassword />} />
          <Route path="/reset-password" exact element={<ResetPassword />} />
          <Route
            path="/subscriptions/:username"
            element={
              <>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={options}>
                    <Subscriptions />
                  </Elements>
                )}
              </>
            }
          />
          <Route path="/:username/settings" exact element={<Settings />} />
          <Route path="/thankyou" exact element={<Thankyou />} />
          <Route path="/dashboard/:username" exact element={<Dashboard />} />
          <Route
            path="/dashboard/:username/manage"
            exact
            element={<ManageAccounts />}
          />

          <Route path="/admin" exact element={<Admin />} />
          <Route path="/admin/manage" exact element={<ManagePage />} />
          <Route
            path="/admin/freeTrialAllowed"
            exact
            element={<FreeTrialAllowed />}
          />
          <Route path="/admin/retention" exact element={<Retention />} />

          <Route path="/chat/:username" exact element={<Chat />} />
          {/* <Route path="/dashboard" exact element={<DashboardApp />} /> */}
          <Route path="/dashboard/edit/:username" exact element={<Edit />} />
          {/* <Route path="/dashboard/login" exact element={<AdminLogin />} /> */}

          <Route path="*" exact element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
