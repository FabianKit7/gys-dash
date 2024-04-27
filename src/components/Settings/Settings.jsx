import React, { useEffect, useState } from "react";
import { FaTimes, FaTimesCircle } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Nav from "../Nav";
import ChangeModal from "./ChangeModal";
import axios from "axios";
import InfiniteRangeSlider from "../InfiniteRangeSlider";
import { BACKEND_URL } from "../../config";
import { cancelSubscription, reActivateSubscription } from "../../helpers";
import AlertModal from "../AlertModal";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && !(data[p] === undefined || data[p] == null)) {
      str.push(
        encodeURIComponent(p) +
          "=" +
          (data[p] ? encodeURIComponent(data[p]) : "")
      );
    }
  }
  return str.join("&");
};

export default function Settings() {
  let { username } = useParams();
  const currentUsername = username;
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState({
    title: "Alert",
    message: "something went wrong",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState();
  const [userWithSub, setUserWithSub] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalToShow, setModalToShow] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [userToCancel, setUserToCancel] = useState(null);
  const [reActivateModal, setReActivateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [chargebeeCustomerData, setChargebeeCustomerData] = useState();
  const [showRangeSlider, setShowRangeSlider] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showActivateSub, setShowActivateSub] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/login");
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("username", currentUsername)
        .eq("email", user.email);
      if (error) {
        error && console.log(error);
        alert("An error occurred, reloading the page or contact support.");
        return;
      }
      const currentUser = data?.[0];
      const getAllAccounts = await supabase
        .from("users")
        .select()
        .eq("email", user.email);
      setUserWithSub(getAllAccounts?.data.find((user) => user.subscribed));
      setAccounts(getAllAccounts?.data);
      if (!currentUser?.subscribed) {
        // window.location.pathname = `subscriptions/${data[0].username}`;
        setUser(data?.find((user) => user?.username === currentUsername));
        setShowActivateSub(true);
      } else {
        setUser(data?.find((user) => user?.username === currentUsername));

        if (!currentUser?.customer_id) return;

        const retrieve_customer_data = {
          customerId: currentUser?.customer_id,
        };
        setShowRangeSlider(true);
        let chargebeeCustomerData = await axios
          .post(
            `${BACKEND_URL}/api/stripe/retrieve_customer`,
            urlEncode(retrieve_customer_data)
          )
          .then((response) => response.data)
          .catch((err) => {
            console.log(err);
          });
        setShowRangeSlider(false);

        // console.log(chargebeeCustomerData);
        if (chargebeeCustomerData?.card) {
          setChargebeeCustomerData(chargebeeCustomerData);
        }
      }
    };

    getData();
  }, [currentUsername, navigate, refresh]);

  // console.log({user});
  // console.log(chargebeeCustomerData);

  return (
    <>
      {showActivateSub && (
        <ActivateSubModal
          showActivateSub={showActivateSub}
          setShowActivateSub={setShowActivateSub}
          user={user}
          userWithSub={userWithSub}
        />
      )}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={errorMsg?.title}
        message={errorMsg?.message}
      />

      <div className="max-w-[1400px] mx-auto">
        <Nav />

        <div className="mt-4">
          <div
            className="flex justify-between items-center rounded-[10px] h-[84px] px-5 md:px-[30px] mb-10"
            style={{
              boxShadow: "0 0 3px #00000040",
            }}
          >
            <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black">
              Profile settings
            </h1>

            <div
              className="flex items-center gap-2 text-base cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <h3>Close</h3>
              <FaTimes size={18} />
            </div>
          </div>

          <div className="md:px-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">
                Full Name
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">{user?.full_name}</div>
                <div
                  className="text-black cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh);
                    setModalToShow("fullname");
                  }}
                >
                  Change
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">Email</div>
              <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                <div className="text-[#757575]">{user?.email}</div>
                <div
                  className="text-black cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh);
                    setModalToShow("email");
                  }}
                >
                  Change
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">
                Password
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">************</div>
                <div
                  className="text-black cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh);
                    setModalToShow("password");
                  }}
                >
                  Change
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">
                Phone number
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">{user?.phone}</div>
                <div
                  className="text-black cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh);
                    setModalToShow("phone");
                  }}
                >
                  Change
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">
                Subscription
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-[#757575]">
                  {user?.status.toLowerCase() === "cancelled"
                    ? "Cancelled"
                    : "Active"}
                </div>
                {user?.status.toLowerCase() === "cancelled" ? (
                  <div
                    className="text-black cursor-pointer"
                    onClick={() => setReActivateModal(true)}
                  >
                    Re-activate
                  </div>
                ) : (
                  <div
                    className="text-black cursor-pointer"
                    // onClick={() => setCancelModal(true)}
                    onClick={() => {
                      if (!user.subscribed) return;
                      setUserToCancel(user);
                      setCancelModal(true);
                    }}
                  >
                    Cancel
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
              <div className="mb-2 border-b md:mb-0 md:border-b-0">
                Invoices
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div
                  className="text-black cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setRefresh(!refresh);
                    setModalToShow("invoices");
                  }}
                >
                  See All
                </div>
              </div>
            </div>
          </div>
        </div>

        {chargebeeCustomerData ? (
          <div className="my-8">
            <div
              className="flex justify-between items-center rounded-[10px] h-[84px] px-5 md:px-[30px] mb-10"
              style={{
                boxShadow: "0 0 3px #00000040",
              }}
            >
              <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black">
                Payment and Billing Settings
              </h1>
            </div>

            {/* payment and billing settings */}
            <div className="md:px-10">
              <div className="flex flex-col md:flex-row justify-between md:items-center md:h-[70px] text-[18px] mb-3 md:mb-0">
                <div className="mb-2 border-b md:mb-0 md:border-b-0">
                  Credit Card
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <div className="text-[#757575] flex items-center gap-3">
                    {chargebeeCustomerData?.card?.card_type === "visa" && (
                      <img
                        src="/icons/visa.svg"
                        alt="visa"
                        className="w-[36px] h-fit"
                      />
                    )}
                    {chargebeeCustomerData?.card?.card_type ===
                      "mastercard" && (
                      <img
                        src="/icons/mastercard.svg"
                        alt="visa"
                        className="w-[36px] h-fit"
                      />
                    )}
                    {chargebeeCustomerData?.card?.card_type === "maestro" && (
                      <img
                        src="/icons/maestro.svg"
                        alt="visa"
                        className="w-[36px] h-fit"
                      />
                    )}
                    {!["visa", "mastercard", "maestro"].includes(
                      chargebeeCustomerData?.card?.card_type
                    ) && <>({chargebeeCustomerData?.card?.card_type})</>}
                    <span className="">
                      card ending with {chargebeeCustomerData?.card?.last4}
                    </span>
                  </div>
                  <div
                    className="text-black cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setRefresh(!refresh);
                      setModalToShow("updatePayment");
                    }}
                  >
                    Update
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>{showRangeSlider && <InfiniteRangeSlider />}</>
        )}

        <div className="my-8">
          <div
            className="flex flex-col md:flex-row justify-between items-center rounded-[10px] md:h-[84px] py-3 md:py-0 px-5 md:px-[30px] mb-10"
            style={{
              boxShadow: "0 0 3px #00000040",
            }}
          >
            <h1 className="font-black font-MontserratBold text-[18px] md:text-[26px] text-black">
              Accounts
            </h1>
            <Link
              to={`/search/?username=add_account`}
              className="px-[32px] md:h-[52px] py-2 md:py-0 text-sm md:text-base mt-2 md:mt-0 w-full md:w-fit grid place-items-center whitespace-nowrap rounded-[10px] bg-black text-white font-bold"
            >
              Add Account
            </Link>
          </div>

          {/* payment and billing settings */}
          <div className="md:px-[40px] flex flex-col gap-[40px]">
            {accounts.map((account) => {
              // console.log(account);
              return (
                <div
                  key={`account_${account?.username}`}
                  className="flex flex-col justify-between md:flex-row"
                >
                  <div className="border-b mb-2 pb-1 md:mb-0 md:border-b-0 flex items-center gap-2 md:gap-4 lg:gap-[30px]">
                    <div className="relative">
                      <img
                        src={account?.profile_pic_url}
                        alt={`@${account?.username}`}
                        className="min-w-[50px] min-h-[50px] w-[50px] h-[50px] lg:min-w-[107px] lg:min-h-[107px] lg:w-[107px] lg:h-[107px] rounded-full"
                      />
                      <div
                        className={`hidden lg:block absolute -bottom-[2px] -right-[2px] border-[5px] w-[32px] h-[32px] rounded-full ${
                          account.subscribed ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></div>
                    </div>
                    <div className="lg:text-[24px] w-full">
                      <div className="flex justify-between w-full gap-1 md:justify-start">
                        <Link to={`/${account.username}/settings`}>
                          @{account?.username}
                        </Link>{" "}
                        <span className="font-bold text-green-600">
                          {user?.status.toLowerCase() === "active" &&
                            user?.status}
                        </span>
                      </div>
                      <div className="">
                        <img
                          src="/instagram.svg"
                          alt=""
                          className="my-[3px] md:my-[5px] lg:my-[7px] mr-[8px] w-[16px] h-[16px] lg:w-[28px] lg:h-[28px] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <div
                      className="px-3 lg:px-[13px] py-3 lg:py-0 lg:h-[52px] grid place-items-center whitespace-nowrap rounded-[10px] bg-[#c4c4c4] text-white font-bold cursor-pointer"
                      onClick={() => {
                        if (!account.subscribed) return;
                        setUserToCancel(account);
                        setCancelModal(true);
                      }}
                    >
                      <BsTrash3
                        size={24}
                        className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ChangeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          setShowModal={setShowModal}
          showModal={showModal}
          modalToShow={modalToShow}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
          chargebeeCustomerData={chargebeeCustomerData}
        />

        {/* 
        <div className={`${cancelModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen grid place-items-center`} style={{
          transition: "opacity .15s ease-in"
        }}
        >
          <div className="fixed top-0 left-0 grid w-full h-screen bg-black/40 place-items-center" onClick={() => setCancelModal(false)}></div>
          <div className="bg-white to-black py-4 md:py-7 md:pt-12 px-5 md:px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular rounded-[10px]">
            <FaTimesCircle className="absolute flex flex-col items-center top-3 right-3"
              onClick={() => {
                setCancelModal(false)
              }} />
            <h1 className="text-[1rem] md:text-lg font-bold text-center font-MontserratSemiBold text-[#333]">Submit your cancellation request</h1>
            <div className="text-[.8rem] md:text-base">
              <p className="text-center">
                All cancellations requests have to be processed by our support team. Please request a cancellation and provide us with your reason for cancelling by emailing <a href={`mailto:${EMAIL}`} className="text-blue-500">{EMAIL}</a>. We appreciate your feedback and are always looking to improve
              </p>
              <br />
              <p className="text-center">
                Our expert account managers are always on standby and ready to help. If you are not getting results, or need help, schedule a time to speak with our expert team who can help you reach your full instagram growth potential.
              </p>
            </div>
            <a href={`mailto:${EMAIL}`} className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center text-[1rem] md:text-lg gap-3">
              <BsFillEnvelopeFill />
              Send an email
            </a>
          </div>
        </div> */}

        <div
          className={`${
            cancelModal
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } fixed top-0 left-0 w-full h-screen grid place-items-center`}
          style={{
            transition: "opacity .15s ease-in",
          }}
        >
          <div
            className="fixed top-0 left-0 grid w-full h-screen bg-black/40 place-items-center"
            onClick={() => setCancelModal(false)}
          ></div>
          <div className="bg-white to-black py-4 md:py-7 md:pt-12 px-5 md:px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular rounded-[10px]">
            <FaTimesCircle
              className="absolute flex flex-col items-center cursor-pointer top-3 right-3"
              onClick={() => {
                setCancelModal(false);
              }}
            />
            <h1 className="text-[1.5rem] md:text-lg font-bold text-center font-MontserratSemiBold text-[#333]">
              Are you sure you want to cancel your subscription for @
              {userToCancel?.username}? Please contact your account manager
              before you cancel and give us a chance to improve.
            </h1>
            <p
              className="mt-2 text-[1.5rem] md:text-lg font-bold text-center font-MontserratSemiBold text-red-600"
              id="cancelMsg"
            ></p>

            <div className="flex justify-center gap-4">
              <a href="mailto:support@grow-your-social.com" className="w-full">
                <button
                  className="mt-8 m-auto py-3 rounded-[10px] font-MontserratRegular px-10 bg-primary text-white flex justify-center items-center text-[1rem] md:text-lg gap-3 w-full"
                  onClick={() => {
                    setCancelModal(false);
                  }}
                >
                  {/* <BsFillEnvelopeFill /> */}
                  Send An Email
                </button>
              </a>
              <button
                className="mt-8 m-auto w-full py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center text-[1rem] md:text-lg gap-3 transition-all"
                onClick={async () => {
                  setTimeout(async () => {
                    const user = userToCancel;
                    if (!user)
                      return alert(
                        "No account selected! Please try again or contact support."
                      );

                    const buttons = document.querySelectorAll("button");
                    buttons.forEach((button) => {
                      button.disabled = true;
                    });
                    const loadingdots = document.querySelector("#loadingdots");
                    loadingdots.style.display = "block";
                    const res = await cancelSubscription(user);
                    loadingdots.style.display = "none";
                    const cancelMsgElement =
                      document.querySelector("#cancelMsg");
                    cancelMsgElement.textContent = res.message;

                    console.log("res");
                    console.log(res);
                    console.log(res?.status);

                    if (res.status === 200) {
                      const updateUser = await supabase
                        .from("users")
                        .update({ status: "cancelled", subscribed: false })
                        .eq("id", user.id);
                      if (updateUser?.error) {
                        console.log(updateUser.error);
                        setIsModalOpen(true);
                        setErrorMsg({
                          title: "Alert",
                          message: `Error updating user's details`,
                        });
                      }
                    }

                    setTimeout(() => {
                      window.location.reload();
                      // setCancelModal(false);
                    }, 2000);
                  }, 1000);
                }}
              >
                {/* <BsFillEnvelopeFill /> */}
                Yes{" "}
                <span
                  id="loadingdots"
                  className="font-black tracking-widest animate-pulse"
                  style={{ display: "none" }}
                >
                  ...
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${
            reActivateModal
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } fixed top-0 left-0 w-full h-screen grid place-items-center`}
          style={{
            transition: "opacity .15s ease-in",
          }}
        >
          <div
            className="fixed top-0 left-0 grid w-full h-screen bg-black/40 place-items-center"
            onClick={() => setReActivateModal(false)}
          ></div>
          <div className="bg-white to-black py-4 md:py-7 md:pt-12 px-5 md:px-10 relative max-w-[300px] md:max-w-[500px] lg:max-w-[600px] font-MontserratRegular rounded-[10px]">
            <FaTimesCircle
              className="absolute flex flex-col items-center cursor-pointer top-3 right-3"
              onClick={() => {
                setReActivateModal(false);
              }}
            />
            <h1 className="text-[1.5rem] md:text-lg font-bold text-center font-MontserratSemiBold text-[#333]">
              Are you sure you want to re-activate your subscription?
            </h1>
            <p
              className="mt-2 text-[1.5rem] md:text-lg font-bold text-center font-MontserratSemiBold text-red-600"
              id="reActivateMsg"
            ></p>

            <div className="flex justify-center gap-4">
              <button
                className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-red-500 text-white flex justify-center items-center text-[1rem] md:text-lg gap-3"
                onClick={() => {
                  setReActivateModal(false);
                }}
              >
                {/* <BsFillEnvelopeFill /> */}
                Close
              </button>
              <button
                className="mt-8 m-auto w-fit py-3 rounded-[10px] font-MontserratRegular px-10 bg-blue-500 text-white flex justify-center items-center text-[1rem] md:text-lg gap-3 transition-all"
                onClick={async () => {
                  if (!user?.customer_id) {
                    setReActivateModal(false);
                  }

                  const loadingdots = document.querySelector("#loadingdots");
                  loadingdots.style.display = "block";
                  const res = await reActivateSubscription(user);
                  loadingdots.style.display = "none";
                  const reActivateMsgElement =
                    document.querySelector("#reActivateMsg");
                  reActivateMsgElement.textContent = res.message;

                  if (res.status === 200) {
                    const updateUser = await supabase
                      .from("users")
                      .update({ status: "checking" })
                      .eq("id", user.id);
                    if (updateUser?.error) {
                      console.log(updateUser.error);
                      setIsModalOpen(true);
                      setErrorMsg({
                        title: "Alert",
                        message: `Error updating user's details`,
                      });
                    }
                  }

                  setTimeout(() => {
                    setReActivateModal(false);
                  }, 2000);
                }}
              >
                {/* <BsFillEnvelopeFill /> */}
                Yes{" "}
                <span
                  id="loadingdots"
                  className="font-black tracking-widest animate-pulse"
                  style={{ display: "none" }}
                >
                  ...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ActivateSubModal = ({
  showActivateSub,
  setShowActivateSub,
  user,
  userWithSub,
}) => {
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    title: "",
    message: "",
  });

  const handleOpen = async () => {
    if (processing) return;

    if (!user.first_account) {
      window.location.href = `/`;
    } else {
      // setShowActivateSub(!showActivateSub)
      await supabase.auth.signOut();
      window.location.href = `/`;
    }
  };

  const handleReactivate = async () => {
    setProcessing(true);

    if (processing) return;

    const res = await reActivateSubscription(user);
    const reActivateMsgElement = document.querySelector("#reActivateMsg");
    reActivateMsgElement.textContent = res.message;

    // console.log("res.status");
    // console.log(res.status);

    if (res.status === 200) {
      const updateUser = await supabase
        .from("users")
        .update({
          status: "checking",
          subscribed: true,
          subscription_id: res.subscription_id,
        })
        .eq("id", user.id);
      if (updateUser?.error) {
        setProcessing(false);
        console.log(updateUser.error);
        setErrorMsg({
          title: "Alert",
          message: `Error updating user's details`,
        });
      }
    }
    setTimeout(() => {
      setShowActivateSub(!showActivateSub);
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      {/* <div className="fixed top-0 left-0 w-full h-screen bg"></div> */}
      <Dialog open={showActivateSub} handler={handleOpen} className="min-w-[75%] md:min-w-[40%]">
        <DialogHeader>Re-activate your subscription.</DialogHeader>
        <DialogBody>
          <strong>@{user?.username}</strong> your account do not have an active
          subscription. Please reactive your subscription if you wish to
          continue.
        </DialogBody>
        {processing && (
          <DialogBody className="animate-pulse text-primary">
            processing...
          </DialogBody>
        )}
        {errorMsg.message && (
          <DialogBody className="text-red-600">
            <h3 className="font-bold">{errorMsg.title}</h3>
            <p>{errorMsg.message}</p>
          </DialogBody>
        )}
        <DialogFooter className="flex items-center gap-3">
          {userWithSub && !userWithSub?.first_account && (
            <Button
              variant="text"
              color="red"
              onClick={() => {
                window.location.href = `/${userWithSub?.username}/settings`;
              }}
              className="mr-1"
              disabled={processing}
            >
              <span>switch to @{userWithSub?.username}</span>
            </Button>
          )}
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
            disabled={processing}
          >
            <span>{user?.first_account ? "Logout" : "Switch account"}</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            disabled={processing}
            onClick={handleReactivate}
          >
            <span>Re-active</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
