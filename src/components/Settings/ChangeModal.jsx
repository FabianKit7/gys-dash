import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AiFillSave } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoClose, IoEye } from "react-icons/io5";
import { supabase } from "../../supabaseClient";
import AlertModal from "../AlertModal";
import { ChargeBeeCard } from "../../pages/Subscriptions";
import InfoAlert from "./InfoAlert";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { formatDateToTimeAgo } from "../../helpers";

const TABLE_HEAD = ["Created", "Reason", "Status", ""];

const StatusStyle = ({ status }) => {
  console.log("status");
  console.log(status);

  const [bg, setBg] = useState("bg-gray-600 text-white");
  useEffect(() => {
    if (status === "draft") {
      setBg("bg-gray-600 text-white");
    } else if (status === "open") {
      setBg("bg-orange-600 text-white");
    } else if (status === "paid") {
      setBg("bg-green-600 text-white");
    } else if (status === "uncollectible") {
      setBg("bg-red-600 text-white");
    } else if (status === "void") {
      setBg("bg-black text-white");
    }
  }, [status]);

  return (
    <div className={`${bg} py-1 px-3 select-none uppercase rounded-md`}>
      {status}
    </div>
  );
};

export default function ChangeModal(props) {
  const {
    setShowModal,
    modalToShow,
    user,
    setRefresh,
    refresh,
    chargebeeCustomerData,
  } = props;

  return (
    <Modal
      {...props}
      size={`${modalToShow === "invoices" ? "lg" : "md"}`}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {modalToShow === "fullname" && (
        <FullName
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {modalToShow === "email" && (
        <Email
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {modalToShow === "password" && (
        <Password
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {modalToShow === "phone" && (
        <Phone
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {modalToShow === "invoices" && (
        <InvoiceComp
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {modalToShow === "updatePayment" && (
        <UpdatePayment
          setShowModal={setShowModal}
          user={user}
          setRefresh={setRefresh}
          refresh={refresh}
          chargebeeCustomerData={chargebeeCustomerData}
        />
      )}
    </Modal>
  );
}

const UpdatePayment = ({
  setShowModal,
  user,
  setRefresh,
  refresh,
  chargebeeCustomerData,
}) => {
  const [loading, setLoading] = useState(false);
  const [showCardPage, setShowCardPage] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // console.log(errorMsg);
    if (errorMsg) {
      setIsModalOpen(true);
    }
  }, [errorMsg]);

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

      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            {showCardPage && (
              <div
                className="w-[32px] h-[32px] rounded-full grid place-items-center shadow-[0_3px_8px_#0000001a] cursor-pointer bg-[#f8f8f8]"
                onClick={() => setShowCardPage(false)}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 256 512"
                  className="font-semibold text-gray-600"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
                </svg>
              </div>
            )}
            <Modal.Title className="font-bold text-[20px] font-MontserratBold">
              Payment method
            </Modal.Title>
          </div>
          <p className="font-bold text-base text-[#757575] w-full font-MontserratRegular">
            You may cancel during your free trial and won't be billed, no risk.
          </p>
        </div>

        <div
          className={`${
            showCardPage
              ? "opacity-100 pointer-events-all"
              : "opacity-0 pointer-events-none hidden"
          } transition-all mt-3`}
        >
          <ChargeBeeCard
            user={user}
            userResults={{}}
            addCard={true}
            username={user.username}
            setIsModalOpen={setShowModal}
            setErrorMsg={setErrorMsg}
            mobile={false}
            Loading={loading}
            setLoading={setLoading}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </div>

        <div
          className={`${
            showCardPage
              ? "opacity-0 pointer-events-none hidden"
              : "opacity-100 pointer-events-all"
          } transition-all`}
        >
          <form className="flex flex-col mt-5">
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-4">
              {chargebeeCustomerData?.paymentSources?.result?.list.map(
                (data) => {
                  // console.log(data);
                  const card = data.payment_source.card;
                  return (
                    <div
                      key={`billing_card_${card?.last4}`}
                      className={`bg-[#f8f8f8] h-[52px] w-full border p-3 rounded-[10px] outline-none`}
                    >
                      <div className="text-[#000] flex items-center justify-center gap-3">
                        {card?.brand === "visa" && (
                          <img
                            src="/icons/visa.svg"
                            alt="visa"
                            className="w-[36px] h-fit"
                          />
                        )}
                        {card?.brand === "mastercard" && (
                          <img
                            src="/icons/mastercard.svg"
                            alt="visa"
                            className="w-[36px] h-fit"
                          />
                        )}
                        {card?.brand === "maestro" && (
                          <img
                            src="/icons/maestro.svg"
                            alt="visa"
                            className="w-[36px] h-fit"
                          />
                        )}
                        {!["visa", "mastercard", "maestro"].includes(
                          card?.brand
                        ) && <>({card?.brand})</>}
                        <span className="">card ending with {card?.last4}</span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div
              className={`mt-2 text-primary font-bold font-MontserratBold flex items-center justify-center gap-2 rounded-[10px] h-[52px] w-full cursor-pointer`}
              onClick={() => {
                // show card page
                setShowCardPage(true);

                // setIsModalOpen(true);
                // setErrorMsg({ title: 'Alert', message: 'Not available yet. Please contact support' })
              }}
            >
              <span>+ Add a new payment method</span>
            </div>
          </form>

          <button
            type="button"
            className={`bg-primary mt-[65px] text-white font-bold font-MontserratBold flex items-center justify-center gap-2 rounded-[10px] h-[52px] w-full cursor-pointer`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </>
  );
};

const FullName = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(user?.full_name);
  }, [user]);

  const handleSaveAndClose = async () => {
    const data = { full_name: value };
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("auth_user_id", user?.auth_user_id)
      .eq("username", user?.username);

    error && console.log(error);
    setRefresh(!refresh);
    setShowModal(false);
  };

  return (
    <>
      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="flex flex-col">
          <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">
            Change Full Name
          </Modal.Title>
          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
            Update the full name on your Grow-your-social profile.
          </p>
        </div>

        <form className="h-[52px] flex items-center gap-3 mt-5">
          <input
            type="text"
            placeholder="Enter your name here..."
            className={`${
              value ? "border-primary" : "border-[#c4c4c4]"
            } h-full border p-3 rounded-[10px] w-full outline-none`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            className={`${
              value ? "bg-primary" : "bg-[#c4c4c4]"
            } text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-full rounded-[10px] min-w-[132px] w-[132px] cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              handleSaveAndClose("full_name");
            }}
          >
            <AiFillSave size={20} />
            <span>Save</span>
          </button>
        </form>
      </div>
    </>
  );
};

const Email = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState("");
  const [info, setInfo] = useState({ title: "", body: "" });
  const [error, setError] = useState({ message: "" });

  useEffect(() => {
    setValue(user?.email);
  }, [user]);

  useEffect(() => {
    if (info.title) {
      setTimeout(() => {
        setInfo({ title: "", body: "" });
        setShowModal(false);
      }, 7000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        setError({ message: "" });
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleSaveAndClose = async () => {
    if (value && value !== user?.email) {
      const updateAuthUser = await supabase.auth.updateUser({ email: value });
      if (updateAuthUser.error) {
        setError({ message: updateAuthUser.error.message });
        console.log(updateAuthUser.error);
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ email: value })
        .eq("username", user?.username);

      error && console.log(error);
      setInfo({
        title: "Email Confirmation",
        body: "Check your email and click on the confirmation link",
      });
      setRefresh(!refresh);
      return;
    }
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`${
          info.title
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } fixed top-5 left-[50%] translate-x-[-50%]`}
      >
        <InfoAlert message={{ title: info.title, body: info.body }} />
      </div>

      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="flex flex-col">
          <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">
            Change Email
          </Modal.Title>

          <div
            className={`${
              error.message
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            } bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`}
            role="alert"
          >
            {/* <strong className="font-bold">Holy smokes!</strong> */}
            <span className="block sm:inline">{error.message}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setError({ message: "" })}
            >
              <svg
                className="w-6 h-6 text-red-500 fill-current"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>

          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
            Update the email address on your Grow-your-social profile.
          </p>
          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular mt-2">
            Current Email Address
          </p>
          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular mt-2 mb-4 p-[18px]">
            {user?.email}
          </p>
          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
            New Email Address
          </p>
        </div>

        <form className="flex flex-col items-center gap-5 mt-5 ">
          <input
            type="text"
            placeholder="Enter your name here..."
            className={`${
              value ? "border-primary" : "border-[#c4c4c4]"
            } h-[52px] text-center border p-3 rounded-[10px] w-full outline-none`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className={`${
              value ? "bg-primary" : "bg-[#c4c4c4]"
            } text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              handleSaveAndClose();
            }}
          >
            <HiOutlineRefresh size={20} />
            <span>Update Email</span>
          </button>
        </form>
      </div>
    </>
  );
};

const Password = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valueShow, setValueShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [error, setError] = useState({ message: "" });

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        if (error.message === "Success!") {
          setShowModal(false);
        }
        setError({ message: "" });
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleSaveAndClose = async () => {
    if (value === confirm) {
      const { error } = await supabase.auth.updateUser({ password: value });

      if (error) {
        setError({ message: error.message });
        console.log(error);
        return;
      }
      setError({ message: "Success!" });
      setRefresh(!refresh);
    } else {
      setError({ message: "Password must be the same." });
    }
  };

  return (
    <>
      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="flex flex-col">
          <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">
            Change Password
          </Modal.Title>

          <div
            className={`${
              error.message
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            } 
        ${
          error.message === "Success!"
            ? "bg-green-100 border border-green-400 text-green-700"
            : "bg-red-100 border border-red-400 text-red-700"
        } px-4 py-3 rounded relative`}
            role="alert"
          >
            {/* <strong className="font-bold">Holy smokes!</strong> */}
            <span className="block sm:inline">{error.message}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setError({ message: "" })}
            >
              <svg
                className="w-6 h-6 text-red-500 fill-current"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        </div>

        <form className="flex flex-col items-center gap-5 mt-5 ">
          <div className="relative w-full">
            <input
              type={valueShow ? "text" : "password"}
              placeholder="New Password"
              className={`${
                value && value === confirm
                  ? "border-primary"
                  : "border-[#c4c4c4]"
              } h-[52px] border p-3 rounded-[10px] w-full outline-none pr-10`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div
              className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer"
              onClick={() => setValueShow(!valueShow)}
            >
              {valueShow ? <FaEye className="" /> : <FaEyeSlash className="" />}
            </div>
          </div>
          <div className="relative w-full">
            <input
              type={confirmShow ? "text" : "password"}
              placeholder="Confirm Password"
              className={`${
                value && value === confirm
                  ? "border-primary"
                  : "border-[#c4c4c4]"
              } h-[52px] border p-3 rounded-[10px] w-full outline-none pr-10`}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <div
              className="absolute top-[50%] right-3 translate-y-[-50%] cursor-pointer"
              onClick={() => setConfirmShow(!confirmShow)}
            >
              {confirmShow ? (
                <FaEye className="" />
              ) : (
                <FaEyeSlash className="" />
              )}
            </div>
          </div>
          <button
            className={`${
              value && value === confirm ? "bg-primary" : "bg-[#c4c4c4]"
            } text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              handleSaveAndClose();
            }}
          >
            <HiOutlineRefresh size={20} />
            <span>Save</span>
          </button>
        </form>
      </div>
    </>
  );
};

const Phone = ({ setShowModal, user, setRefresh, refresh }) => {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(user?.phone);
  }, [user]);

  const handleSaveAndClose = async () => {
    const data = { phone: value };
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("auth_user_id", user?.auth_user_id)
      .eq("username", user?.username);

    error && console.log(error);
    setRefresh(!refresh);
    setShowModal(false);
  };

  return (
    <>
      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        <div className="flex flex-col">
          <Modal.Title className="font-bold text-[20px] mb-2 font-MontserratBold text-center">
            Change Phone
          </Modal.Title>
          <p className="font-bold text-base text-[#757575] text-center w-full font-MontserratRegular">
            Update the phone number on your Grow-your-social profile.
          </p>
        </div>

        <form className="flex flex-col items-center gap-3 mt-5">
          <input
            type="tel"
            placeholder="e.g: +2348112659304"
            className={`${
              value ? "border-primary" : "border-[#c4c4c4]"
            } h-[52px] border p-3 rounded-[10px] w-full outline-none`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="submit"
            className={`${
              value ? "bg-primary" : "bg-[#c4c4c4]"
            } text-white font-bold font-MontserratBold flex items-center justify-center gap-2 h-[52px] min-h-[52px] rounded-[10px] min-w-[200px] w-[200px] cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              handleSaveAndClose();
            }}
          >
            <HiOutlineRefresh size={20} />
            <span>Update Phone</span>
          </button>
        </form>
      </div>
    </>
  );
};

const InvoiceComp = ({ setShowModal, user, setRefresh, refresh }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const f = async () => {
      const res = await axios.get(
        `${BACKEND_URL}/api/stripe/invoice/${user.customer_id}`
      );
      console.log(res);
      if (res.status === 200) {
        setInvoices(res.data.invoices.data);
      }
    };
    f();
  }, [user]);

  return (
    <>
      <div className="px-2 py-4 md:px-5 lg:p-10">
        <div className="absolute flex justify-end cursor-pointer top-5 right-5">
          <IoClose
            className="text-[30px] text-gray-600"
            onClick={() => setShowModal(false)}
          />
        </div>

        {invoices.map((invoice) => {
          return <div key={`invoice_${invoice.id}`}></div>;
        })}

        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="dmb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Invoices
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  View all invoices generated.
                </Typography>
              </div>
            </div>
            <div className="hidden dflex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<RxMagnifyingGlass className="h-5 w-5" />}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={`${head}_${index}`}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}{" "}
                        {/* {index !== TABLE_HEAD?.length - 1 && (
                          <BsChevronExpand
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        )} */}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(
                  (
                    { id, created, billing_reason, status, hosted_invoice_url },
                    index
                  ) => {
                    const isLast = index === invoices?.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={id}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {formatDateToTimeAgo(new Date(created * 1000))}
                            {/* {created} */}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {billing_reason}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <StatusStyle status={status} />
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="View Invioce">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                // window.location.href = `${hosted_invoice_url}`;
                                window.open(hosted_invoice_url, "_blank");
                              }}
                            >
                              <IoEye className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              Page 1 of 1
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outlined" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
