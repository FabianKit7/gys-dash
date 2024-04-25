// using setupIntent;

import Axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { TbRefresh } from "react-icons/tb";
import { RiErrorWarningLine } from "react-icons/ri";
import axios from "axios";
import { MdLogout } from "react-icons/md";
import { useClickOutside } from "react-click-outside-hook";
import AlertModal from "../components/AlertModal";
import { getRefCode, slackSubNotify } from "../helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  BACKEND_URL,
  IS_SMS_ALLOWED,
  LOGO,
  NOT_CONNECTED_SMS_TEMPLATE,
  NOT_CONNECTED_TEMPLATE,
  // PRICE_ID,
  SCRAPER_API_URL,
  SUBSCRIPTION_PLANS,
  X_RAPID_API_HOST,
  X_RAPID_API_KEY,
} from "../config";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import VATSupportedCountries from "../vat_supported_countries..json";
import countryCodes from "../CountryCodes.json";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export default function Subscriptions() {
  var { username } = useParams();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const [errorMsg, setErrorMsg] = useState({
    title: "Alert",
    message: "something went wrong",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod] = useState({ id: 1, name: "card" });
  const [Loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({
    planId: "",
    name: "Monthly",
    type: "1 month",
    value: 74.99,
  });
  const [selectedPlanType, setSelectedPlanType] = useState("1 month");
  const [, setIsIOSorMac] = useState(true);
  const [confirmingSetUpIntent, setConfirmingSetUpIntent] = useState(true);
  const stripe = useStripe();
  const [VATSupportedCountry, setVATSupportedCountry] = useState(null);

  // setVATSupportedCountry
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get(
          "https://ipinfo.io?token=3ca9e388b8033f"
        );
        const { country } = response.data;
        const countryDetail = countryCodes.find((c) => c.code === country);
        const filteredData = VATSupportedCountries.countries.find(
          (country) =>
            country.country.toLowerCase() === countryDetail.name.toLowerCase()
        );
        setVATSupportedCountry(filteredData);
      } catch (error) {
        setVATSupportedCountry(null);
        console.error("Error fetching user country:", error);
      }
    };
    fetchUserCountry();
  }, []);

  // setIsIOSorMac
  useEffect(() => {
    var userAgent = navigator?.userAgent;
    if (userAgent) {
      // console.log("/Macintosh|Mac OS X|iPhone/i.test(userAgent)");
      // console.log(/Macintosh|Mac OS X|iPhone/i.test(userAgent));

      setIsIOSorMac(/Macintosh|Mac OS X|iPhone/i.test(userAgent));
    } else {
      setIsIOSorMac(false);
    }

    return () => {};
  }, []);

  // set default selectedPlan
  useEffect(() => {
    const plan = SUBSCRIPTION_PLANS.find((plan) => plan?.name === "Monthly");
    setSelectedPlan(plan);
  }, []);

  // setIsDesktop
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    // Update the isDesktop state when the window is resized
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768); // Adjust the threshold as needed
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // isClickedOutside
  useEffect(() => {
    if (isClickedOutside) {
      setShowMenu(false);
    }
  }, [isClickedOutside]);

  // setUser
  useEffect(() => {
    const getData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        console.log("no auth user");
        return;
      }

      const { data } = await supabase
        .from("users")
        .select()
        .eq("auth_user_id", authUser?.id)
        .eq("first_account", true)
        .single();

      if (data && username !== data?.username) {
        window.location.href = `/subscriptions/${data?.username}`;
      }

      data && setUser(data);
    };

    getData();
  }, [username]);
  const [userResults, setUserResults] = useState(null);
  const navigate = useNavigate();

  // clearCookies
  useEffect(() => {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies?.length; c++) {
      var d = window.location.hostname.split(".");
      while (d?.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = window.location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p?.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
        // console.log('done');
      }
    }
  }, []);

  const getData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) navigate("/");
    const options = {
      method: "GET",
      url: SCRAPER_API_URL,
      params: { ig: username, response_type: "short", corsEnabled: "true" },
      headers: {
        "X-RapidAPI-Key": X_RAPID_API_KEY,
        "X-RapidAPI-Host": X_RAPID_API_HOST,
      },
    };

    try {
      const response = await Axios.request(options);
      setUserResults(response?.data?.[0]);
    } catch (error) {
      console.log(error);
    }
  }, [navigate, username]);

  // setUserResults
  useEffect(() => {
    getData();
  }, [getData]);

  const [creatingSubscription, setCreatingSubscription] = useState(false);

  // confirm setup_intent_client_secret;
  useEffect(() => {
    const setup_intent_client_secret = new URLSearchParams(
      window.location.search
    ).get("setup_intent_client_secret");
    if (!setup_intent_client_secret) return setConfirmingSetUpIntent(false);

    async function continueToSupabase(userIsNew, subscriptionObj, plan) {
      let data = {
        nameOnCard: user?.nameOnCard || user?.full_name,
        subscription_id: subscriptionObj?.id,
        customer_id: subscriptionObj?.customer,
        current_plan_id: plan,

        username: userResults?.username,
        email: user.email,
        full_name: user.full_name,
        followers: userResults?.follower_count,
        following: userResults?.following_count,
        is_verified: userResults?.is_verified,
        biography: userResults?.biography,
        start_time: getStartingDay(),
        posts: userResults?.media_count,
        subscribed: true,
      };

      if (userIsNew) {
        if (!user) {
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });
          setLoading(false);
          return;
        }

        // console.log({ data });

        const updateUser = await supabase
          .from("users")
          .update(data)
          .eq("id", user.id);
        if (updateUser?.error) {
          console.log(updateUser.error);
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });

          return;
        }
      } else {
        const addAccount = await supabase
          .from("users")
          .insert({ ...data, auth_user_id: user.auth_user_id });
        if (addAccount?.error) {
          console.log(addAccount.error);
          setIsModalOpen(true);
          setErrorMsg({ title: "Alert", message: `Error adding new account` });
        }
      }

      try {
        // process.env.NODE_ENV === "production" &&
        //   (await slackSubNotify(user?.username || user?.email));
        await slackSubNotify(user?.username || user?.email);
      } catch (error) {
        console.log(error);
      }

      let sendEmail = await axios
        .post(`${BACKEND_URL}/api/send_email`, {
          email: user?.email,
          subject: "Your account is not connected",
          htmlContent: NOT_CONNECTED_TEMPLATE(user?.full_name, user?.username),
        })
        .catch((err) => err);
      if (sendEmail.status !== 200) {
        console.log(sendEmail);
      }

      if (!IS_SMS_ALLOWED && user?.phone) {
        try {
          const url = `${BACKEND_URL}/api/send_sms`;
          const sms_data = {
            recipient: user?.phone?.toString()?.replace(/\s/g, ""),
            content: NOT_CONNECTED_SMS_TEMPLATE(user?.full_name),
          };
          process.env.NODE_ENV === "production" &&
            (await axios.post(url, sms_data));
        } catch (error) {}
      }

      const ref = getRefCode();
      if (ref) {
        navigate(`/thankyou?ref=${ref}`);
      } else {
        navigate(`/thankyou`);
      }
      setLoading(false);
    }

    const fetch = async () => {
      if (!stripe || !username) {
        return;
      }

      if (!userResults) return;
      if (
        !(
          creatingSubscription &&
          navigate &&
          selectedPlan &&
          stripe &&
          user &&
          userResults &&
          username
        )
      ) {
        // console.log(
        //   creatingSubscription,
        //   navigate,
        //   selectedPlan,
        //   stripe,
        //   user,
        //   userResults,
        //   username
        // );
        // return;
      }

      const clientSecret = new URLSearchParams(window.location.search).get(
        "setup_intent_client_secret"
      );

      if (!clientSecret) {
        return setConfirmingSetUpIntent(false);
      }

      // if (creatingSubscription) return;

      // console.log("setup_intent_client_secret suc!");
      const paymentIntent = await stripe.retrieveSetupIntent(clientSecret);
      if (!paymentIntent) return;
      // .then(({ paymentIntent }) => {
      // console.log(paymentIntent?.setupIntent?.status);
      let count = 0;
      switch (paymentIntent?.setupIntent?.status) {
        case "succeeded":
          if (count > 0) return;
          count += 1;
          setCreatingSubscription(true);
          let c = localStorage.getItem("count");
          if (c) {
            localStorage.removeItem("count");
            return;
          }
          localStorage.setItem("count", count);
          console.log("setupIntent passed!");
          const payment_method = paymentIntent.setupIntent.payment_method;

          try {
            await axios.post(
              `${BACKEND_URL}/api/stripe/attach_payment_method_to_customer`,
              { customer_id: user?.customer_id, pm_id: payment_method }
            );
          } catch (error) {
            console.log("attach_payment_method_to_customer error");
            console.log(error.message);
            console.log(error);
            console.log(error.message);
          }

          const planId = new URLSearchParams(
            window.location.search
          ).get("planId");

          // try {
          let createSubscription = await axios.post(
            `${BACKEND_URL}/api/stripe/create_subscription`,
            {
              name: user?.full_name,
              username,
              email: user?.email,
              paymentMethod: payment_method,
              // price: PRICE_ID,
              price: planId,
            }
          );
          // .catch((err) => {
          //   console.error(err);
          //   return err;
          // });

          if (createSubscription.status === 500) {
            setIsModalOpen(true);
            setErrorMsg({
              title: "Alert",
              message:
                createSubscription?.data?.message ??
                "Failed to create subscription. Please contact support",
            });
            return setConfirmingSetUpIntent(false);
          }
          const userIsNew = true;
          await continueToSupabase(
            userIsNew,
            createSubscription.data.subscription,
            selectedPlan.planId
          );
          // } catch (error) {
          //   // alert(error?.message);
          //   setIsModalOpen(true);
          //   setErrorMsg({ title: "Alert", message: error.message });
          //   return setConfirmingSetUpIntent(false);
          // }
          setConfirmingSetUpIntent(false);
          break;
        case "processing":
          console.log("Your payment is processing.");
          break;
        case "requires_payment_method":
          console.log("Your payment was not successful, please try again.");
          // alert("Your payment was not successful, please try again.");
          if (
            window.confirm("Your payment was not successful, please try again")
          ) {
            navigate(`/subscriptions/${user?.username}`);
          }
          break;
        default:
          console.log("Something went wrong.");
          // alert("Something went wrong");
          if (window.confirm("Something went wrong")) {
            navigate(`/subscriptions/${user?.username}`);
          }
          break;
      }
      // });
    };
    if (!user) return;
    fetch();
  }, [
    creatingSubscription,
    navigate,
    selectedPlan,
    stripe,
    user,
    userResults,
    username,
  ]);

  if (confirmingSetUpIntent) {
    return (
      <div className="">
        <AlertModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            window.location.href = `/subscriptions/${user?.username}`;
          }}
          title={errorMsg?.title}
          message={errorMsg?.message}
        />

        <div className="skeleton-container">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
        <p className="text-center text-lg mt-3 animate-pulse">
          Please be patient while we processes your subscription...
        </p>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={errorMsg?.title}
        message={errorMsg?.message}
      />
      <div id="affiliateScript"></div>
      {/* <CrispChat /> */}

      <div className="text-[#757575] relative bg-[#f8f8f8]">
        <div className="max-w-[1600px] mx-auto">
          <div className="hidden lg:block absolute top-[14px] right-[14px] z-[1] cursor-pointer bg-white rounded-full pl-4">
            <div
              className="flex items-center gap-3"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              <span className=""> {user?.full_name} </span>
              <div
                className={`${
                  showMenu && " border-red-300"
                } border-2 rounded-full`}
              >
                <div
                  className={`w-[32px] h-[32px] rounded-full bg-primary/90 text-white grid place-items-center`}
                >
                  <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">
                    {user?.full_name && user?.full_name?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* mobile start */}
          <div className="lg:hidden">
            <div
              className="fixed h-[65px] top-0 left-0 z-[50] bg-white flex items-center justify-between w-full px-5 py-4 gap-2 font-[600] font-MontserratRegular shadow-[0_2px_4px_#00000026]"
              onClick={() => {
                showMenu && setShowMenu(false);
              }}
            >
              <div className="flex">
                <img alt="" className="w-[36px] h-[36px]" src={LOGO} />
              </div>
              <div
                className={`${
                  showMenu && " border-red-300"
                } border-2 rounded-full`}
              >
                <div
                  className={`w-[32px] h-[32px] rounded-full bg-primary/90 text-white grid place-items-center cursor-pointer`}
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                >
                  <span
                    className={`text-[22px] pointer-events-none select-none font-[400] uppercase`}
                  >
                    {user?.full_name && user?.full_name?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-[65px] mb-[150px]">
              <div className="bg-white lg:hidden">
                <div className="flex flex-col gap-[1px]">
                  <div className="border-l-8 border-l-primary/90 border-b h-[54px] pr-[20px] pl-3 flex items-center justify-between w-full bg-[#f8f8f8]">
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={userResults?.profile_pic_url}
                        alt=""
                        className="w-[38px] h-[38px] rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="text-[12px] -mb-1">Account:</div>
                        <div className="text-[14px] text-black font-bold font-MontserratSemiBold">
                          @{userResults?.username}
                        </div>
                      </div>
                    </div>

                    <TbRefresh
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/search`);
                      }}
                    />
                  </div>

                  {/* <div className="border-l-8 border-l-primary/90 border-b h-[54px] pr-[20px] pl-3 flex items-center justify-between w-full bg-[#f8f8f8]">
                    <div className="flex items-center gap-[10px]">
                      <div className="flex flex-col">
                        <div className="text-[12px] -mb-1">Plan:</div>
                        <div className="text-[14px] text-black font-bold font-MontserratSemiBold">
                          Monthly Plan
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="flex flex-col items-center justify-between gap-4 mt-4 w-full">
                    {SUBSCRIPTION_PLANS.filter(
                      (plan) => plan.type === selectedPlanType
                    ).map((plan) => (
                      <div
                        key={`sub_plan-${plan?.name}`}
                        className={`flex-1 cursor-pointer hover:shadow-sm rounded-[10px] group relative ${
                          plan?.name === "Monthly" && "mt-2"
                        }`}
                        onClick={() => {
                          setSelectedPlan(plan);
                        }}
                      >
                        {plan?.name === "Monthly" && (
                          <div className="absolute top-0 -mt-2 left-1/2 -translate-x-1/2 rounded-full px-4 bg-green-600/90 text-white text-xs">
                            Popular
                          </div>
                        )}
                        <div
                          className={`min-w-[200px] py-3 text-center text-sm text-white rounded-full bg-black group-hover:bg-primary ${
                            plan?.name === selectedPlan?.name && "bg-primary/90"
                          }`}
                        >
                          {plan?.name}
                        </div>
                        <div className="text-center font-bold mt-2">
                          ${" "}
                          <span className="">
                            {plan?.value?.replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pt-4 pb-5 bg-white">
                <h1 className="text-black text-[20px] font-bold font-MontserratSemiBold">
                  {" "}
                  Start 7-Day-Free-Trial
                </h1>
                <p className="mt-1 mb-3 text-black text-[14px] font-normal">
                  Start Risk Free - Your card will only be charged after your
                  Free Trial. Cancel anytime. Start Grow Real & Targeted
                  Followers Every Month. Enjoy high quality analytics and
                  tracking.
                </p>

                {/* <div className="mb-[11px] flex gap-[10px] h-[80px] items-center">
                  <div
                    className={`flex-1 bg-[#f8f8f8] rounded-[6px] cursor-pointer h-full relative transition-all duration-100 ease-in ${
                      paymentMethod.name === "card" && ""
                    }`}
                    onClick={() => {
                      setPaymentMethod({ id: 1, name: "card" });
                    }}
                  >
                    <span
                      className={`${
                        paymentMethod.name === "card"
                          ? "top-[13px] left-[10px] w-[22px] h-[18px] translate-x-0 translate-y-0"
                          : "h-[25.5px] w-[32px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      }
                        absolute transition-all duration-200 ease-in fill-black font-[none]`}
                    >
                      <svg
                        viewBox="0 0 28 28"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 7C0 6.07174 0.368749 5.1815 1.02513 4.52513C1.6815 3.86875 2.57174 3.5 3.5 3.5H24.5C25.4283 3.5 26.3185 3.86875 26.9749 4.52513C27.6313 5.1815 28 6.07174 28 7V15.75H0V7ZM20.125 8.75C19.8929 8.75 19.6704 8.84219 19.5063 9.00628C19.3422 9.17038 19.25 9.39294 19.25 9.625V11.375C19.25 11.6071 19.3422 11.8296 19.5063 11.9937C19.6704 12.1578 19.8929 12.25 20.125 12.25H23.625C23.8571 12.25 24.0796 12.1578 24.2437 11.9937C24.4078 11.8296 24.5 11.6071 24.5 11.375V9.625C24.5 9.39294 24.4078 9.17038 24.2437 9.00628C24.0796 8.84219 23.8571 8.75 23.625 8.75H20.125ZM0 19.25V21C0 21.9283 0.368749 22.8185 1.02513 23.4749C1.6815 24.1313 2.57174 24.5 3.5 24.5H24.5C25.4283 24.5 26.3185 24.1313 26.9749 23.4749C27.6313 22.8185 28 21.9283 28 21V19.25H0Z"
                          _ngcontent-esd-c92=""
                        ></path>
                      </svg>
                    </span>

                    <div
                      className={`${
                        paymentMethod.name === "card"
                          ? "opacity-100 translate-y-0 text-black"
                          : "opacity-0 translate-y-full"
                      }
                        absolute bottom-[10px] left-[10px] w-full h-[18px] text-[14px] font-[500] transition-all duration-200 ease-in fill-black font-[none]`}
                    >
                      Payment Options
                    </div>
                  </div>

                  <div
                    className={`flex-1 bg-[#f8f8f8] rounded-[6px] cursor-pointer h-full relative transition-all duration-100 ease-in ${
                      paymentMethod.name === "external_pay" &&
                      "border-black border-2"
                    }`}
                    onClick={() => {
                      setPaymentMethod({ id: 1, name: "external_pay" });
                    }}
                  >
                    <span
                      className={`${
                        paymentMethod.name === "external_pay"
                          ? "top-[13px] left-[10px] translate-x-0 translate-y-0"
                          : "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                      }
                        absolute transition-all duration-200 ease-in fill-black font-[none]`}
                    >
                      <img
                        src={`${
                          isIOSorMac
                            ? "/icons/apple_pay-icon.png"
                            : "/icons/gpay.png"
                        }`}
                        alt=""
                        className={`${
                          paymentMethod.name === "external_pay"
                            ? "h-[23.7px]"
                            : "h-[37px]"
                        }`}
                      />
                    </span>

                    <div
                      className={`${
                        paymentMethod.name === "external_pay"
                          ? "opacity-100 translate-y-0 text-black"
                          : "opacity-0 translate-y-full"
                      }
                        absolute bottom-[10px] left-[10px] w-[22px] h-[18px] text-[14px] font-[500] transition-all duration-200 ease-in fill-black font-[none]`}
                    >
                      {`${isIOSorMac ? "ApplePay" : "GooglePay"}`}
                    </div>
                  </div>
                </div> */}

                <div
                  className={`${
                    paymentMethod.name === "card"
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none hidden"
                  } transition-all duration-150 ease-in mt-4`}
                >
                  {!isDesktop && (
                    <ChargeBeeCard
                      planId={selectedPlan.planId}
                      user={user}
                      VATSupportedCountry={VATSupportedCountry}
                      userResults={userResults}
                      username={username}
                      setIsModalOpen={setIsModalOpen}
                      setErrorMsg={setErrorMsg}
                      mobile={true}
                      Loading={Loading}
                      setLoading={setLoading}
                      selectedPlan={selectedPlan}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full min-h-[85px] p-5 text-[14px] bg-white">
              {paymentMethod.name === "card" ? (
                <div className="">
                  <button
                    className={`${
                      Loading
                        ? "bg-primary/90 cursor-wait"
                        : "bg-black cursor-pointer"
                    } w-full h-[50px] rounded-full text-white flex items-center justify-center gap-2`}
                    type="submit"
                    form="cardForm"
                    // onClick={() => { }}
                  >
                    <div className="">
                      {Loading ? "Loading..." : "Start My Growth"}
                    </div>
                  </button>
                  <div className="mt-2 text-center text-black">
                    ${selectedPlan?.value?.toString()?.replace(".", ",")}{" "}
                    {selectedPlan.name === "Monthly"
                      ? "per month, billed monthly."
                      : "billed every 3 months."}{" "}
                    <br /> Cancel any time, no risk.
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  {!isDesktop && (
                    <ExternalPayComponent
                      selectedPlan={selectedPlan}
                      user={user}
                      userResults={userResults}
                      setIsModalOpen={setIsModalOpen}
                      setErrorMsg={setErrorMsg}
                      setLoading={setLoading}
                      isDesktop={isDesktop}
                    />
                  )}
                  {/* <button
                    className="cursor-pointer w-full h-[50px] rounded-[10px] bg-[#ffc439] text-white flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      setErrorMsg({
                        title: "Alert",
                        message: "external_pay not available yet!",
                      });
                    }}
                  >
                    <img
                      src={"/icons/paypal-btn.svg"}
                      alt=""
                      className="h-[25px]"
                    />
                  </button> */}

                  {/* <div id="express-checkout-element"></div> */}

                  <div className="mt-2 text-center text-black">
                    {`Choose Your Plan After Your 7 Day Free Trial. $${selectedPlan?.value
                      ?.toString()
                      ?.replace(".", ",")} ${
                      selectedPlan.name === "Monthly"
                        ? "per month, billed monthly."
                        : "billed every 3 months."
                    } Cancel any time, no risk.`}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* mobile end */}

          <div className="">
            <div
              className={`${
                !showMenu && "opacity-0 pointer-events-none hidden"
              } absolute top-0 left-0 w-full h-screen z-10`}
            >
              <div
                className="absolute top-0 left-0 w-full h-screen bg-black/0 z-[99] cursor-pointer"
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              ></div>

              <div
                className={`${
                  !showMenu && "opacity-0 pointer-events-none hidden"
                } absolute top-0 lg:top-14 z-[99] left-5 lg:left-[unset] right-5 bg-white w-[calc(100%-40px)] lg:w-[350px] lg:max-w-[400px] rounded-[10px] shadow-[0_5px_10px_#0a17530d] transition-all duration-150 ease-in`}
                ref={parentRef}
                tabIndex={0}
              >
                <div className="flex items-center gap-3 p-5">
                  <div className="w-[50px] h-[50px] rounded-full bg-primary/90 text-white grid place-items-center">
                    <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">
                      {user?.full_name && user?.full_name?.charAt(0)}
                    </span>
                  </div>
                  <div className="">
                    <div className="text-black font-bold font-MontserratSemiBold text-[14px]">
                      {user?.full_name}
                    </div>
                    <div className="text-[12px]">{user?.email}</div>
                  </div>
                </div>

                <div
                  className="border-t border-[#f8f8f8] flex items-center gap-3 h-[53px] text-black px-5 cursor-pointer hover:bg-blue-gray-100"
                  onClick={async () => {
                    setShowMenu(!showMenu);
                    await supabase.auth.signOut();
                    window.onbeforeunload = function () {
                      localStorage.clear();
                    };
                    window.location.pathname = "/login";
                  }}
                >
                  <MdLogout size={22} /> <span className="">Logout</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <Content
                user={user}
                userResults={userResults}
                navigate={navigate}
                setIsModalOpen={setIsModalOpen}
                setErrorMsg={setErrorMsg}
                username={username}
                Loading={Loading}
                setLoading={setLoading}
                isDesktop={isDesktop}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                selectedPlanType={selectedPlanType}
                setSelectedPlanType={setSelectedPlanType}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Content = ({
  user,
  VATSupportedCountry,
  userResults,
  navigate,
  setIsModalOpen,
  setErrorMsg,
  username,
  Loading,
  setLoading,
  isDesktop,
  selectedPlan,
  setSelectedPlan,
  selectedPlanType,
}) => {
  const amount = parseFloat(selectedPlan?.value?.toString().replace(".", ""));
  const [showCreaditCardInput, setShowCreaditCardInput] = useState(true);
  const featureA = [
    "400+ Real Monthly Followers",
    "Get Higher Engagement on Posts",
    "Grow 250% Faster",
    "Fully Customized Targeting",
    "Real & Organic Growth",
    "Instagram Support & Consulting",
    "Growth Analytics",
    "Instant Setup",
    "7 Day free trial",
  ];
  const featureB = [
    "Up to 1000+ Real Monthly Followers",
    "Reach Explore Page",
    "Grow 500% Faster",
    "Fully Customized Targeting",
    "Real & Organic Growth",
    "Dedicated Account Manager",
    "Growth Analytics",
    "Instant Setup",
    "7 Day free trial",
  ];

  const [paymentRequest, setPaymentRequest] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements || !isDesktop) return;

    setPaymentRequest(null);

    async function continueToSupabase(userIsNew, subscriptionObj, plan) {
      let data = {
        nameOnCard: user?.nameOnCard || user?.full_name,
        subscription_id: subscriptionObj?.id,
        customer_id: subscriptionObj?.customer,
        current_plan_id: plan,

        username: userResults?.username,
        email: user.email,
        full_name: user.full_name,
        followers: userResults?.follower_count,
        following: userResults?.following_count,
        is_verified: userResults?.is_verified,
        biography: userResults?.biography,
        start_time: getStartingDay(),
        posts: userResults?.media_count,
        subscribed: true,
      };

      if (userIsNew) {
        if (!user) {
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });
          setLoading(false);
          return;
        }

        // console.log({ data });

        const updateUser = await supabase
          .from("users")
          .update(data)
          .eq("id", user.id);
        if (updateUser?.error) {
          console.log(updateUser.error);
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });

          return;
        }
      } else {
        const addAccount = await supabase
          .from("users")
          .insert({ ...data, auth_user_id: user.auth_user_id });
        if (addAccount?.error) {
          console.log(addAccount.error);
          setIsModalOpen(true);
          setErrorMsg({ title: "Alert", message: `Error adding new account` });
        }
      }

      try {
        process.env.NODE_ENV === "production" &&
          (await slackSubNotify(user?.username || user?.email));
      } catch (error) {
        console.log(error);
      }

      let sendEmail = await axios
        .post(`${BACKEND_URL}/api/send_email`, {
          email: user?.email,
          subject: "Your account is not connected",
          htmlContent: NOT_CONNECTED_TEMPLATE(user?.full_name, user?.username),
        })
        .catch((err) => err);
      if (sendEmail.status !== 200) {
        console.log(sendEmail);
      }

      if (IS_SMS_ALLOWED && user?.phone) {
        try {
          const url = `${BACKEND_URL}/api/send_sms`;
          const sms_data = {
            recipient: user?.phone?.toString()?.replace(/\s/g, ""),
            content: NOT_CONNECTED_SMS_TEMPLATE(user?.full_name),
          };
          await axios.post(url, sms_data);
        } catch (error) {
          console.log(`failed to send sms: ${error.message}`);
        }
      }

      const ref = getRefCode();
      if (ref) {
        navigate(`/thankyou?ref=${ref}`);
      } else {
        navigate(`/thankyou`);
      }
      setLoading(false);
    }

    const pr = stripe.paymentRequest({
      currency: "usd",
      country: "US",
      // disableWallets: ["link", "applePay", "browserCard", "googlePay"],
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        label: selectedPlan.name,
        amount,
      },
    });
    pr.canMakePayment().then((result) => {
      // console.log("pr");
      // console.log(pr);
      if (result) {
        // console.log("result");
        // console.log(result);
        setPaymentRequest(pr);
      }

      pr.on("paymentmethod", async (e) => {
        // const { clientSecret } = await fetch(
        //   `${BACKEND_URL}/api/stripe/create_payment_intent`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "content-type": "application/json",
        //     },
        //     body: JSON.stringify({ amount }),
        //   }
        // ).then((result) => result.json());

        var userIsNew = true;

        let createSubscription = await axios
          .post(`${BACKEND_URL}/api/stripe/create_subscription`, {
            name: user?.nameOnCard || user?.full_name,
            username,
            email: user?.email,
            paymentMethod: e?.paymentMethod?.id,
            price: selectedPlan?.planId,
            customer_id: user?.customer_id,
          })
          .catch((err) => {
            console.error(err);
            return err;
          });

        // const clientSecret =
        //   createSubscription?.data?.subscription?.latest_invoice?.payment_intent
        //     ?.client_secret;

        // console.log("createSubscription");
        // console.log(createSubscription);
        // console.log(clientSecret);

        if (!createSubscription?.data) {
          setIsModalOpen(true);
          setErrorMsg({
            title: "Failed to create subscription",
            message: `An error occured: ${createSubscription?.response?.data?.message}`,
          });
          setLoading(false);
          return;
        }

        if (createSubscription?.data?.clientSecret) {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            createSubscription?.data?.clientSecret,
            {
              payment_method: e.paymentMethod.id,
            },
            {
              handleActions: false,
            }
          );
          if (error) {
            e.complete("fail");
            return;
          }
          if (paymentIntent.status === "requires_action") {
            stripe.confirmCardPayment(createSubscription?.data?.clientSecret);
          }

          if (
            paymentIntent.status === "succeeded" &&
            createSubscription?.data?.message === "Subscription successful!"
          ) {
            await continueToSupabase(
              userIsNew,
              createSubscription.data.subscription,
              selectedPlan.planId
            );
            setLoading(false);

            if (userResults?.name === "INVALID_USERNAME") {
              console.log("INVALID_USERNAME");
              setIsModalOpen(true);
              setErrorMsg({
                title: "Alert",
                message: "An error has occured, please try again",
              });
              setLoading(false);
              return;
            }

            if (user) {
              try {
                if (e?.paymentMethod?.id) {
                }
              } catch (error) {
                // setError(error.message);
                setIsModalOpen(true);
                setErrorMsg({
                  title: "Failed to create subscription",
                  message: `An error occured: ${error.message}`,
                });
              }
            } else {
              setIsModalOpen(true);
              setErrorMsg({
                title: "Authentication Error",
                message: "You have to login to continue",
              });
            }
          } else {
            console.log("createSubscription error");
            console.log(createSubscription);

            setIsModalOpen(true);
            setErrorMsg({
              title: "Failed to create subscription",
              message: "An error occured while creating your subscription",
            });
          }
        } else {
          await continueToSupabase(
            userIsNew,
            createSubscription.data.subscription,
            selectedPlan.planId
          );
          setLoading(false);
        }
        e.complete("success");
      });
    });
  }, [
    elements,
    stripe,
    isDesktop,
    selectedPlan,
    amount,
    user,
    userResults,
    setLoading,
    setIsModalOpen,
    setErrorMsg,
    navigate,
    username,
  ]);

  return (
    <>
      <div className="h-[calc(100vh-75px)] lg:h-screen mt-[75px] lg:mt-0 lg:py-[20px] lg:px-[100px] bg-[#f8f8f8]">
        <div className="w-full max-w-full lg:max-w-[960px] xl:max-w-[1070px] h-[789px] overflow-auto my-auto 2xl:grid max-h-full lg:mx-auto relative">
          <div className="mb-4 hidden lg:flex items-center gap-2 font-[600] font-MontserratRegular">
            <div className="">Select Your Account</div>
            <div className="">{`>`}</div>
            <div className="text-primary">Complete Setup</div>
            <div className="">{`>`}</div>
            <div className="">Enter Dashboard</div>
          </div>

          <div className="flex-col justify-between hidden h-full px-5 pb-4 lg:flex lg:justify-start lg:items-center text-start lg:px-0">
            <div className="flex flex-col w-full gap-5 lg:flex-row">
              <div className="basis-[45%] grow-[3] rounded-[20px] flex gap-5 flex-col">
                <div className="rounded-[20px]">
                  <div className="text-start w-full h-[110px] shadow-[0_5px_10px_#0a17530d] rounded-[20px] py-[25px] px-4 lg:px-[50px] relative flex items-center justify-between bg-white">
                    <div className="w-full max-w-[420px] relative overflow-hidden flex items-center text-start py-5 pr-[30px]">
                      <div className="flex items-center w-full gap-4 ">
                        <div className="h-[60px] relative">
                          <img
                            src={userResults?.profile_pic_url}
                            alt=""
                            className="w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-full"
                          />
                          <img
                            src="/icons/instagram.svg"
                            alt=""
                            className="absolute -bottom-1 -right-1 border-2 w-[22px] h-[22px] rounded-full"
                          />
                        </div>
                        <div className="">
                          <div className="font-bold text-black-r">
                            {userResults?.username}
                          </div>
                          <div className="">{userResults?.full_name}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="w-[40px] h-[40px] rounded-[10px] grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-white text-[#242424]"
                      onClick={() => {
                        navigate(`/search`);
                      }}
                    >
                      <TbRefresh className="font-semibold" />
                    </div>
                  </div>

                  <div className="py-2 pb-3 px-2 lg:px-[20px] mt-5 rounded-bl-[20px] rounded-br-[20px] shadow-[0_5px_10px_#0a17530d] bg-white">
                    <div className="flex items-center justify-between gap-4 mt-4">
                      {SUBSCRIPTION_PLANS.filter(
                        (plan) => plan.type === selectedPlanType
                      ).map((plan) => (
                        <div
                          key={`sub_plan-${plan?.name}`}
                          className={`flex-1 cursor-pointer hover:shadow-sm rounded-[10px] group relative`}
                          onClick={() => {
                            setSelectedPlan(plan);
                          }}
                        >
                          {plan?.name === "Monthly" && (
                            <div className="absolute top-0 -mt-2 left-1/2 -translate-x-1/2 rounded-full px-4 bg-green-600/90 text-white text-xs">
                              Popular
                            </div>
                          )}
                          <div
                            className={`py-3 text-center text-sm text-white rounded-full bg-black group-hover:bg-primary ${
                              plan?.name === selectedPlan?.name &&
                              "bg-primary/90"
                            }`}
                          >
                            {plan?.name}
                          </div>
                          <div className="text-center font-bold mt-2">
                            ${" "}
                            <span className="">
                              {plan?.value?.replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-auto basis-[100%] rounded-[20px] py-10 px-4 lg:px-[50px] shadow-[0_5px_10px_#0a17530d] bg-[#ffffff]">
                  <div className="">
                    <div className="flex items-center gap-3">
                      {/* {showCreaditCardInput && (
                        <div
                          className="w-[32px] h-[32px] rounded-full grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-[#f8f8f8]"
                          onClick={() => {
                            setShowCreaditCardInput(false);
                          }}
                        >
                          <FaAngleLeft className="font-semibold text-gray-600" />
                        </div>
                      )} */}
                      <h1 className="text-[20px] lg:text-[20px] font-bold text-black font-MontserratBold">
                        Payment method
                      </h1>
                    </div>
                    <p className="pt-2 pb-4 text-sm font-MontserratRegular text-start">
                      You may cancel during your free trial and won't be billed,
                      no risk.
                    </p>

                    {!showCreaditCardInput && (
                      <div className="flex flex-col gap-4 mb-4">
                        <div
                          className="cursor-pointer w-full h-[60px] rounded-[8px] bg-black text-white flex items-center justify-center gap-2"
                          onClick={() => {
                            setShowCreaditCardInput(true);
                          }}
                        >
                          <span className="w-[28px] h-[28px] rounded-[8px] fill-white">
                            <svg
                              viewBox="0 0 28 28"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path d="M0 7C0 6.07174 0.368749 5.1815 1.02513 4.52513C1.6815 3.86875 2.57174 3.5 3.5 3.5H24.5C25.4283 3.5 26.3185 3.86875 26.9749 4.52513C27.6313 5.1815 28 6.07174 28 7V15.75H0V7ZM20.125 8.75C19.8929 8.75 19.6704 8.84219 19.5063 9.00628C19.3422 9.17038 19.25 9.39294 19.25 9.625V11.375C19.25 11.6071 19.3422 11.8296 19.5063 11.9937C19.6704 12.1578 19.8929 12.25 20.125 12.25H23.625C23.8571 12.25 24.0796 12.1578 24.2437 11.9937C24.4078 11.8296 24.5 11.6071 24.5 11.375V9.625C24.5 9.39294 24.4078 9.17038 24.2437 9.00628C24.0796 8.84219 23.8571 8.75 23.625 8.75H20.125ZM0 19.25V21C0 21.9283 0.368749 22.8185 1.02513 23.4749C1.6815 24.1313 2.57174 24.5 3.5 24.5H24.5C25.4283 24.5 26.3185 24.1313 26.9749 23.4749C27.6313 22.8185 28 21.9283 28 21V19.25H0Z"></path>
                            </svg>
                          </span>
                          <div className="">Card / Debit Card</div>
                        </div>
                        {/* <div
                          className="cursor-pointer w-full h-[60px] rounded-[8px] bg-[#ffc439] text-white flex items-center justify-center gap-2"
                          onClick={() => {
                            setIsModalOpen(true);
                            setErrorMsg({
                              title: "Alert",
                              message: "external_pay not available yet!",
                            });
                          }}
                        >
                          <img
                            src={"/icons/external_pay-btn.svg"}
                            alt=""
                            className="h-[25px]"
                          />
                        </div> */}
                        {paymentRequest ? (
                          <>
                            {isDesktop && (
                              <PaymentRequestButtonElement
                                options={{ paymentRequest }}
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-red-600 hidden">
                            Sorry, it seams your device does GooglePay
                          </p>
                        )}
                      </div>
                    )}

                    <div
                      className={`${
                        !showCreaditCardInput
                          ? "opacity-0 pointer-events-none hidden"
                          : "opacity-100"
                      } transition-all duration-150 ease-out`}
                    >
                      {isDesktop && (
                        <ChargeBeeCard
                          planId={selectedPlan.planId}
                          user={user}
                          VATSupportedCountry={VATSupportedCountry}
                          userResults={userResults}
                          username={username}
                          setIsModalOpen={setIsModalOpen}
                          setErrorMsg={setErrorMsg}
                          Loading={Loading}
                          setLoading={setLoading}
                          selectedPlan={selectedPlan}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="basis-[60%] grow-[4] rounded-[20px] shadow-[0_5px_10px_#0a17530d] p-4 lg:p-[50px_50px_50px] bg-white relative">
                <div className="w-full h-full overflow-auto">
                  <span className="text-[14px] py-[5px] px-3 mb-3 rounded-[8px] text-primary bg-primary/30">
                    {selectedPlan.name === "Monthly"
                      ? "Get 1000+ followers"
                      : "Get 400+ followers"}
                  </span>
                  <div className="text-[20px] lg:text-[26px] font-bold text-black font-MontserratBold">
                    Choose Your Plan After Your 7 Day Free Trial
                  </div>
                  {/* <p className="text-[14px] mt-2 mb-5">
                    It's time to get the real exposure you've been waiting for.
                    After signing up, you will be introduced to your personal
                    account manager and start growing in under 2 minutes.
                  </p> */}
                  <p className="text-[14px] mt-2 mb-5">
                    {selectedPlan.name === "Monthly"
                      ? "Your payment method will only be charged after your trial ends. Start working with us today and let us prove to you that it works!"
                      : "Great for personal accounts, businesses and upcoming influencers looking for organic growth."}
                  </p>
                  <div className="text-[72px] leading-[70px] text-black font-bold font-MontserratBold">
                    ${selectedPlan?.value?.toString()?.replace(".", ",")}
                  </div>
                  <p className="text-[14px] mb-5">
                    Billed{" "}
                    {selectedPlan.name === "Monthly" ? "monthly" : "quarterly"},
                    after 7 day free trial.
                  </p>

                  <div className="flex flex-col gap-4 text-base text-black">
                    {(selectedPlan.name === "Monthly"
                      ? featureB
                      : featureA
                    ).map((feature, idx) => {
                      return (
                        <div
                          key={`feature_${idx}`}
                          className="flex items-center gap-2"
                        >
                          <BallEl />
                          <p className="">{feature}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStartingDay = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  return today;
};

export const ChargeBeeCard = ({
  planId,
  user,
  addCard,
  setIsModalOpen,
  setErrorMsg,
  Loading,
  setLoading,
}) => {
  const [, setProcessingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const [addressElementState, setAddressElementState] = useState(null);
  const [paymentElementState, setPaymentElementState] = useState(null);

  // display card elements
  useEffect(() => {
    const addressEl = document.querySelector("#address-element");
    if (!elements || !addressEl || addressElementState || paymentElementState)
      return;
    const options = { mode: "billing" };
    const paymentElementOptions = {
      layout: "tabs",
      // layout: 'accordion',
    };
    const addressElement = elements.create("address", options);
    // console.log();
    // addressElement.
    const paymentElement = elements.create("payment", paymentElementOptions);
    setAddressElementState(addressElement);
    setPaymentElementState(paymentElement);
    addressElement.mount("#address-element");

    paymentElement.mount("#payment-element");
  }, [addressElementState, elements, clientSecret, paymentElementState]);
  const [vatDetails, setVatDetails] = useState({ company_name: "", id: "" });
  const [showCollectVATDetails, setShowCollectVATDetails] = useState(false);

  // create_setupIntent and setClientSecret
  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const setup_intent_client_secret = new URLSearchParams(
        window.location.search
      ).get("setup_intent_client_secret");
      if (setup_intent_client_secret) return;

      let setupIntentRes = await axios
        .post(`${BACKEND_URL}/api/stripe/create_setupIntent`, {
          name: user?.full_name || user?.username,
          email: user?.email,
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });

      if (setupIntentRes?.clientSecret) {
        var clientSecret = setupIntentRes.clientSecret;
        var customer = setupIntentRes?.customer;
        setClientSecret(clientSecret);
        if (customer) {
          const d = {
            customer_id: customer.id,
          };
          await supabase
            .from("users")
            .update(d)
            .eq("auth_user_id", user?.auth_user_id);
        }
      }
    };
    const confirm__SetUp = new URLSearchParams(window.location.search).get(
      "setup_intent_client_secret"
    );
    if (confirm__SetUp) return;
    fetch();
  }, [user]);
  //   setLoading(true);
  //   if (user) {
  //     const cardElement = elements.getElement(CardElement);

  //     if (cardElement) {
  //       try {
  //         const { error, paymentMethod } = await stripe.createPaymentMethod({
  //           type: "card",
  //           card: cardElement,
  //         });
  //         if (error) {
  //           // setError(error.message);
  //           setIsModalOpen(true);
  //           setErrorMsg({
  //             title: "Failed to create subscription",
  //             message: `An error occured: ${error.message}`,
  //           });
  //           setLoading(false);
  //           return;
  //         }

  //         // console.log("paymentMethod");
  //         console.log(paymentMethod);
  //         if (paymentMethod?.id) {
  //           let updateCustomerPaymentMethodRes = await axios
  //             .post(
  //               `${BACKEND_URL}/api/stripe/attach_payment_method_to_customer`,
  //               { customer_id: user?.customer_id, pm_id: paymentMethod?.id }
  //             )
  //             .then((response) => response.data)
  //             .catch((error) => {
  //               console.log("attach_payment_method_to_customer error");
  //               console.log(error);
  //               return error;
  //             });
  //           if (updateCustomerPaymentMethodRes?.id) {
  //             alert("Updated successfully!");
  //             setRefresh(!refresh);
  //             setLoading(false);
  //             setIsModalOpen(false);
  //           } else {
  //             console.log(
  //               "Error add card:",
  //               updateCustomerPaymentMethodRes?.raw.message
  //             );
  //             // alert('An error occurred, please try again or contact support')
  //             setIsModalOpen(true);
  //             setErrorMsg({
  //               title: "Failed to adding card",
  //               message: `An error occurred: ${updateCustomerPaymentMethodRes?.raw.message}`,
  //             });
  //           }
  //         }
  //       } catch (error) {
  //         // setError(error.message);
  //         setIsModalOpen(true);
  //         setErrorMsg({
  //           title: "Failed to create subscription",
  //           message: `An error occured: ${error.message}`,
  //         });
  //       }
  //     }
  //   } else {
  //     setIsModalOpen(true);
  //     setErrorMsg({
  //       title: "Authentication Error",
  //       message: "You have to login to continue",
  //     });
  //   }
  //   setLoading(false);
  // };

  // const handleCardPay = async () => {
  //   if (addCard) {
  //     await handleAddCard();
  //     return;
  //   }

  //   // if (process.env.NODE_ENV !== 'production') {
  //   //   let data = {
  //   //     username: userResults?.username,
  //   //     email: user.email,
  //   //     full_name: user.full_name,
  //   //     followers: userResults?.follower_count,
  //   //     following: userResults?.following_count,
  //   //     is_verified: userResults?.is_verified,
  //   //     biography: userResults?.biography,
  //   //     start_time: getStartingDay(),
  //   //     posts: userResults?.media_count,
  //   //     subscribed: true
  //   //   }
  //   //   await supabase
  //   //     .from("users")
  //   //     .update(data).eq('id', user.id);
  //   //   navigate(`/thankyou`);
  //   //   return;
  //   // }

  //   setLoading(true);
  //   if (userResults?.name === "INVALID_USERNAME") {
  //     console.log("INVALID_USERNAME");
  //     setIsModalOpen(true);
  //     setErrorMsg({
  //       title: "Alert",
  //       message: "An error has occured, please try again",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   if (user) {
  //     var userIsNew = true;
  //     const cardElement = elements.getElement(CardElement);
  //     const addressElement = elements.getElement(AddressElement);

  //     console.log("addressElement");
  //     console.log(addressElement);

  //     try {
  //       const { error, paymentMethod } = await stripe.createPaymentMethod({
  //         type: "card",
  //         card: cardElement,
  //       });
  //       if (error) {
  //         // setError(error.message);
  //         setIsModalOpen(true);
  //         setErrorMsg({
  //           title: "Failed to create subscription",
  //           message: `An error occured: ${error.message}`,
  //         });
  //         setLoading(false);
  //         return;
  //       }
  //       // console.log("paymentMethod");
  //       // console.log(paymentMethod);
  //       if (paymentMethod?.id) {
  //         let createSubscription = await axios
  //           .post(`${BACKEND_URL}/api/stripe/create_subscription`, {
  //             name: nameOnCard || user?.full_name,
  //             username,
  //             email: user?.email,
  //             paymentMethod: paymentMethod.id,
  //             // price: PRICE_ID,
  //             price: selectedPlan.planId,
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //             return err;
  //           });

  //         const clientSecret =
  //           createSubscription?.data?.subscription?.latest_invoice
  //             ?.payment_intent?.client_secret;
  //         // const clientSecret =
  //         // "seti_1OXOrZGqRSmA1tlMcn9B1zex_secret_PM75vgXO8fylqSBp9YTfmABzz9Ywzlw";

  //         console.log("createSubscription card");
  //         console.log(createSubscription);
  //         console.log("clientSecret");
  //         console.log(clientSecret);

  //         if (!createSubscription?.data) {
  //           setIsModalOpen(true);
  //           setErrorMsg({
  //             title: "Failed to create subscription",
  //             message: `An error occured: ${createSubscription?.response?.data?.message}`,
  //           });
  //           setLoading(false);
  //           return;
  //         }

  //         if (clientSecret) {
  //           const confirm = await stripe.confirmCardPayment(clientSecret);
  //           console.log("confirmCardPayment");
  //           console.error(confirm);
  //           if (confirm.error) {
  //             if (
  //               confirm.error.message ===
  //               `A payment method of type card was expected to be present, but this PaymentIntent does not have a payment method and none was provided. Try again providing either the payment_method or payment_method_data parameters.`
  //             ) {
  //               setIsModalOpen(true);
  //               setErrorMsg({
  //                 title: "Failed to create subscription",
  //                 message: `An error occured: please check if you have enough fund on your card`,
  //               });
  //               setLoading(false);
  //               return;
  //             } else {
  //               setIsModalOpen(true);
  //               setErrorMsg({
  //                 title: "Failed to create subscription",
  //                 message: `An error occured: ${confirm.error.message}`,
  //               });
  //               setLoading(false);
  //               return;
  //             }
  //           }

  //           if (
  //             confirm?.paymentIntent?.status === "succeeded" &&
  //             createSubscription?.data?.message === "Subscription successful!"
  //           ) {
  //             await continueToSupabase(
  //               userIsNew,
  //               createSubscription.data.subscription,
  //               selectedPlan.planId
  //             );
  //             setLoading(false);
  //           } else {
  //             console.log("createSubscription error");
  //             console.log(createSubscription);
  //             setIsModalOpen(true);
  //             setErrorMsg({
  //               title: "Failed to create subscription",
  //               message: "An error occured while creating your subscription",
  //             });
  //           }
  //         } else {
  //           setLoading(false);
  //           alert("clientSecret not found!");
  //           return;
  //           await continueToSupabase(
  //             userIsNew,
  //             createSubscription.data.subscription,
  //             selectedPlan.planId
  //           );
  //           setLoading(false);
  //         }
  //       }
  //     } catch (error) {
  //       // setError(error.message);
  //       setIsModalOpen(true);
  //       setErrorMsg({
  //         title: "Failed to create subscription",
  //         message: `An error occured: ${error.message}`,
  //       });
  //     }
  //   } else {
  //     setIsModalOpen(true);
  //     setErrorMsg({
  //       title: "Authentication Error",
  //       message: "You have to login to continue",
  //     });
  //   }
  //   setLoading(false);
  // };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log("submitError:", submitError);
      alert(submitError.type + ": " + submitError.message);
      setLoading(false);
      return;
    }

    try {
      const addressElement = elements.getElement("address");
      var value = null;
      if (addressElement) {
        var aeobj = await addressElement.getValue();
        value = aeobj.value;
      }
      if (value.address.postal_code) {
        let updateCustomerAddress = await axios.post(
          `${BACKEND_URL}/api/stripe/updateCustomerAddress`,
          {
            customer_id: user?.customer_id,
            email: user?.email,
            address: value.address,
          }
        );
        console.log("updateCustomerAddress");
        console.log(updateCustomerAddress);
      }
    } catch (error) {
      console.log("failed to update customer address");
      console.log(error);
      console.log(error.message);
    }

    try {
      if (value?.address?.country) {
        //         import VATSupportedCountries from "../vat_supported_countries..json";
        // import countryCodes from "../CountryCodes.json";
        const country = countryCodes.find(
          (countryCode) => countryCode.code === value?.address?.country
        );

        const VATSupportedCountry = VATSupportedCountries.countries.find(
          (sCountry) => sCountry.country === country.name
        );

        console.log("VATSupportedCountry");
        console.log(VATSupportedCountry);
        let updateCustomerTax = await axios.post(
          `${BACKEND_URL}/api/stripe/updateCustomerTax`,
          {
            customer_id: user?.customer_id,
            email: user?.email,
            tax_id: vatDetails.id,
            company_name: vatDetails.company_name,
            country_enum: VATSupportedCountry?.enum,
          }
        );
        console.log("updateCustomerTax");
        console.log(updateCustomerTax);
      }
    } catch (error) {
      console.log("failed to update customer address");
      console.log(error);
      console.log(error.message);
    }

    // setLoading(false);
    // return;

    setProcessingPayment(true);

    const { error } = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url:
          process.env.NODE_ENV === "production"
            ? `https://app.grow-your-social.com/subscriptions/${user?.username}?planId=${planId}`
            : `http://localhost:3000/subscriptions/${user?.username}?planId=${planId}`,
      },
    });

    setLoading(false);
    if (error) {
      setIsModalOpen(true);
      setErrorMsg({
        title: "Failed",
        message: error?.type + ": " + error?.message,
      });
    }

    setProcessingPayment(false);
  };

  // async function continueToSupabase(userIsNew, subscriptionObj, plan) {
  //   let data = {
  //     nameOnCard,
  //     subscription_id: subscriptionObj?.id,
  //     customer_id: subscriptionObj?.customer,
  //     current_plan_id: plan,

  //     username: userResults?.username,
  //     email: user.email,
  //     full_name: user.full_name,
  //     followers: userResults?.follower_count,
  //     following: userResults?.following_count,
  //     is_verified: userResults?.is_verified,
  //     biography: userResults?.biography,
  //     start_time: getStartingDay(),
  //     posts: userResults?.media_count,
  //     subscribed: true,
  //   };

  //   if (userIsNew) {
  //     if (!user) {
  //       setIsModalOpen(true);
  //       setErrorMsg({
  //         title: "Alert",
  //         message: `Error updating user's details`,
  //       });
  //       setLoading(false);
  //       return;
  //     }

  //     // console.log({ data });

  //     const updateUser = await supabase
  //       .from("users")
  //       .update(data)
  //       .eq("id", user.id);
  //     if (updateUser?.error) {
  //       console.log(updateUser.error);
  //       setIsModalOpen(true);
  //       setErrorMsg({
  //         title: "Alert",
  //         message: `Error updating user's details`,
  //       });

  //       return;
  //     }
  //   } else {
  //     const addAccount = await supabase
  //       .from("users")
  //       .insert({ ...data, auth_user_id: user.auth_user_id });
  //     if (addAccount?.error) {
  //       console.log(addAccount.error);
  //       setIsModalOpen(true);
  //       setErrorMsg({ title: "Alert", message: `Error adding new account` });
  //     }
  //   }

  // try {
  //   process.env.NODE_ENV === "production" &&
  //     (await slackSubNotify(user?.username || user?.email));
  // } catch (error) {
  //   console.log(error);
  // }

  //   let sendEmail = await axios
  //     .post(`${BACKEND_URL}/api/send_email`, {
  //       email: user?.email,
  //       subject: "Your account is not connected",
  //       htmlContent: NOT_CONNECTED_TEMPLATE(user?.full_name, user?.username),
  //     })
  //     .catch((err) => err);
  //   if (sendEmail.status !== 200) {
  //     console.log(sendEmail);
  //   }

  // try {
  //   if (IS_SMS_ALLOWED && user?.phone) {
  //     const url = `${BACKEND_URL}/api/send_sms`;
  //     const sms_data = {
  //       recipient: user?.phone?.toString()?.replace(/\s/g, ""),
  //       content: NOT_CONNECTED_SMS_TEMPLATE(user?.full_name),
  //     };
  //     await axios.post(url, sms_data);
  //   }
  // } catch (error) {
  //   console.log(`failed to send sms: ${error.message}`);
  // }

  //   const ref = getRefCode();
  //   if (ref) {
  //     navigate(`/thankyou?ref=${ref}`);
  //   } else {
  //     navigate(`/thankyou`);
  //   }
  //   setLoading(false);
  // }

  // const elementOptions = {
  //   style: {
  //     base: {
  //       iconColor: "#c4f0ff",
  //       color: "#000",
  //       fontWeight: "500",
  //       fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
  //       fontSize: "16px",
  //       fontSmoothing: "antialiased",
  //       ":-webkit-autofill": {
  //         color: "#fce883",
  //       },
  //       "::placeholder": {
  //         color: "#87BBFD",
  //       },
  //     },
  //     invalid: {
  //       iconColor: "#f00",
  //       color: "#f00",
  //     },
  //   },
  // };

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (Loading) {
            // alert('Please wait');
            setIsModalOpen(true);
            setErrorMsg({ title: "Processing...", message: "Please wait" });
            return;
          }
          await handleSubmit();
        }}
        id="cardForm"
        className=""
      >
        <div id="payment-element"></div>
        <div id="address-element"></div>
        <div className="mt-0 md:mt-4">
          {/* {VATSupportedCountry && ( */}
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name=""
              id=""
              onChange={(e) => {
                if (e.target.checked) {
                  setShowCollectVATDetails(true);
                } else {
                  setShowCollectVATDetails(false);
                }
              }}
            />
            <div className="">Sign up as a company</div>
          </div>
          {/*  )} */}

          {showCollectVATDetails && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                VAT details <RiErrorWarningLine className="rotate-180" />
              </div>

              <div className="mt-2 border border-gray-400 rounded-md">
                <div className="border-b border-gray-400 h-[50px] flex items-center px-3">
                  <input
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="Company name"
                    value={vatDetails.company_name}
                    onChange={(e) => {
                      setVatDetails({
                        ...vatDetails,
                        company_name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="h-[50px] flex items-center px-3">
                  <input
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder={`EU VAT number (optional)`}
                    value={vatDetails.id}
                    onChange={(e) => {
                      setVatDetails({
                        ...vatDetails,
                        id: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className={`${addCard ? "block" : "hidden lg:block"}`}>
        <button
          className={`${
            Loading
              ? "bg-primary/90 cursor-wait"
              : "bg-black hover:bg-black cursor-pointer"
          } text-white font-MontserratSemiBold text-[.8rem] xl:text-[1.125rem] ${
            addCard ? "mt-[65px]" : "mt-5"
          } w-full py-4 rounded-full font-[600] mb-4`}
          onClick={() => {
            if (Loading) {
              setIsModalOpen(true);
              setErrorMsg({ title: "Processing...", message: "Please wait" });
              return;
            }
            // await handleCardPay(setLoading, userResults, setIsModalOpen, setErrorMsg, user, cardRef, username, navigate, nameOnCard);
            // handleCardPay();
            handleSubmit();
          }}
        >
          <span>
            {" "}
            {Loading
              ? "Processing..."
              : `${addCard ? "Add Payment Method" : "Start My Growth"}`}{" "}
          </span>
        </button>
        {/* {showCardComponent && <></>} */}
        {Loading && (
          <div className="flex items-center justify-center gap-2 py-3">
            <AiOutlineLoading3Quarters className="animate-spin" />
            <p className="font-[500] text-xs md:text-sm font-MontserratSemiBold text-[#333] animate-pulse">
              We're processing your request, please wait...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const BallEl = () => {
  return (
    <span className="w-[20px] h-[20px] green-checkbox fill-primary sroke-green font-[none]">
      <svg
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        _ngcontent-gsj-c72=""
        aria-hidden="true"
      >
        <rect
          opacity="0.2"
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="9.5"
          _ngcontent-gsj-c72=""
        ></rect>
        <rect
          x="4.5"
          y="4.5"
          width="11"
          height="11"
          rx="5.5"
          _ngcontent-gsj-c72=""
        ></rect>
      </svg>
    </span>
  );
};

const ExternalPayComponent = ({
  selectedPlan,
  user,
  userResults,
  setIsModalOpen,
  setErrorMsg,
  setLoading,
  isDesktop,
}) => {
  const amount = parseFloat(selectedPlan?.value?.toString().replace(".", ""));
  const navigate = useNavigate();
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripe || isDesktop || !selectedPlan?.name) return;

    async function continueToSupabase(userIsNew, subscriptionObj, plan) {
      let data = {
        nameOnCard: user?.nameOnCard || user?.full_name,
        subscription_id: subscriptionObj?.id,
        customer_id: subscriptionObj?.customer,
        current_plan_id: plan,

        username: userResults?.username,
        email: user.email,
        full_name: user.full_name,
        followers: userResults?.follower_count,
        following: userResults?.following_count,
        is_verified: userResults?.is_verified,
        biography: userResults?.biography,
        start_time: getStartingDay(),
        posts: userResults?.media_count,
        subscribed: true,
      };

      if (userIsNew) {
        if (!user) {
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });
          setLoading(false);
          return;
        }

        // console.log({ data });

        const updateUser = await supabase
          .from("users")
          .update(data)
          .eq("id", user.id);
        if (updateUser?.error) {
          console.log(updateUser.error);
          setIsModalOpen(true);
          setErrorMsg({
            title: "Alert",
            message: `Error updating user's details`,
          });

          return;
        }
      } else {
        const addAccount = await supabase
          .from("users")
          .insert({ ...data, auth_user_id: user.auth_user_id });
        if (addAccount?.error) {
          console.log(addAccount.error);
          setIsModalOpen(true);
          setErrorMsg({ title: "Alert", message: `Error adding new account` });
        }
      }

      try {
        process.env.NODE_ENV === "production" &&
          (await slackSubNotify(user?.username || user?.email));
      } catch (error) {
        console.log(error);
      }

      let sendEmail = await axios
        .post(`${BACKEND_URL}/api/send_email`, {
          email: user?.email,
          subject: "Your account is not connected",
          htmlContent: NOT_CONNECTED_TEMPLATE(user?.full_name, user?.username),
        })
        .catch((err) => err);
      if (sendEmail.status !== 200) {
        console.log(sendEmail);
      }

      if (!IS_SMS_ALLOWED && user?.phone) {
        try {
          const url = `${BACKEND_URL}/api/send_sms`;
          const sms_data = {
            recipient: user?.phone?.toString()?.replace(/\s/g, ""),
            content: NOT_CONNECTED_SMS_TEMPLATE(user?.full_name),
          };
          await axios.post(url, sms_data);
        } catch (error) {}
      }

      const ref = getRefCode();
      if (ref) {
        navigate(`/thankyou?ref=${ref}`);
      } else {
        navigate(`/thankyou`);
      }
      setLoading(false);
    }

    setPaymentRequest(null);

    const pr = stripe.paymentRequest({
      currency: "usd",
      country: "US",
      // disableWallets: ["link", "applePay", "browserCard", "googlePay"],
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        label: selectedPlan.name,
        amount,
      },
    });
    pr.canMakePayment().then((result) => {
      // console.log("pr mobile");
      // console.log(pr);
      // console.log("result1");
      // console.log(result);
      if (result) {
        // console.log("result2");
        // console.log(result);
        setPaymentRequest(pr);
      }

      pr.on("paymentmethod", async (e) => {
        var userIsNew = true;

        let createSubscription = await axios
          .post(`${BACKEND_URL}/api/stripe/create_subscription`, {
            name: user?.nameOnCard || user?.full_name,
            username: user?.username,
            email: user?.email,
            paymentMethod: e?.paymentMethod?.id,
            price: selectedPlan?.planId,
            customer_id: user?.customer_id,
          })
          .catch((err) => {
            console.error(err);
            return err;
          });

        // const clientSecret =
        //   createSubscription?.data?.subscription?.latest_invoice?.payment_intent
        //     ?.client_secret;

        // console.log("createSubscription");
        // console.log(createSubscription);
        // console.log(clientSecret);

        if (!createSubscription?.data) {
          setIsModalOpen(true);
          setErrorMsg({
            title: "Failed to create subscription",
            message: `An error occured: ${createSubscription?.response?.data?.message}`,
          });
          setLoading(false);
          return;
        }

        if (createSubscription?.data?.clientSecret) {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            createSubscription?.data?.clientSecret,
            {
              payment_method: e.paymentMethod.id,
            },
            {
              handleActions: false,
            }
          );
          if (error) {
            e.complete("fail");
            return;
          }
          if (paymentIntent.status === "requires_action") {
            stripe.confirmCardPayment(createSubscription?.data?.clientSecret);
          }

          if (
            paymentIntent.status === "succeeded" &&
            createSubscription?.data?.message === "Subscription successful!"
          ) {
            await continueToSupabase(
              userIsNew,
              createSubscription.data.subscription,
              selectedPlan.planId
            );
            setLoading(false);

            if (userResults?.name === "INVALID_USERNAME") {
              console.log("INVALID_USERNAME");
              setIsModalOpen(true);
              setErrorMsg({
                title: "Alert",
                message: "An error has occured, please try again",
              });
              setLoading(false);
              return;
            }

            if (user) {
              try {
                if (e?.paymentMethod?.id) {
                }
              } catch (error) {
                // setError(error.message);
                setIsModalOpen(true);
                setErrorMsg({
                  title: "Failed to create subscription",
                  message: `An error occured: ${error.message}`,
                });
              }
            } else {
              setIsModalOpen(true);
              setErrorMsg({
                title: "Authentication Error",
                message: "You have to login to continue",
              });
            }
          } else {
            console.log("createSubscription error");
            console.log(createSubscription);

            setIsModalOpen(true);
            setErrorMsg({
              title: "Failed to create subscription",
              message: "An error occured while creating your subscription",
            });
          }
        } else {
          await continueToSupabase(
            userIsNew,
            createSubscription.data.subscription,
            selectedPlan.planId
          );
          setLoading(false);
        }
        e.complete("success");
      });
    });
  }, [
    amount,
    navigate,
    isDesktop,
    selectedPlan,
    setErrorMsg,
    setIsModalOpen,
    stripe,
    user,
    userResults,
    setLoading,
  ]);

  return (
    <>
      {paymentRequest ? (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : (
        <p className="text-red-600">
          Sorry, it seams your device does GooglePay
        </p>
      )}
    </>
  );
};
