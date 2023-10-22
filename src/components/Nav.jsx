import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
// import sproutyLogo from "../images/sprouty.svg";
import { useClickOutside } from "react-click-outside-hook";
import { FaAngleDown } from "react-icons/fa";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { LOGO, LOGO_WITH_NAME } from "../config";

export default function Nav({ setShowWelcomeModal, userD, admin }) {
  let { username } = useParams();
  const currentUsername = username
  const [parentRef, isClickedOutside] = useClickOutside();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  const [pending] = useState(false)
  const [accounts, setAccounts] = useState([])
  error && console.log("🚀 ~ file: Nav.jsx:9 ~ Nav ~ error", error);

  useEffect(() => {
    if (isClickedOutside) {
      setIsOpen(false)
    };
  }, [isClickedOutside]);

  useEffect(() => {
    const getData = async () => {
      var uEmail;
      if (!userD) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        uEmail = user.email

        const { data, error } = await supabase
          .from("users").select()
          .eq("user_id", user.id)
          .eq('username', currentUsername)
          // .single();
        if (error) {
          console.log(error);
          setError(error);
          return;
        }
        setData(data?.[0]);
      } else {
        // console.log(userD);
        setData(userD);
        uEmail = userD?.email
      }

      const getAllAccounts = await supabase.from('users').select().eq('email', uEmail).order('created_at', { ascending: true })
      setAccounts(getAllAccounts?.data)
    };

    getData();
  }, [currentUsername, userD]);

  return (
    <nav className="mb-[30px]" ref={parentRef}>
      <div
        className="flex justify-between items-center mt-2 md:mt-[20px]"
      >
        <Link to={`${data?.username ? `/dashboard/${data?.username}` : "/"}`} className="navbar-brand" href="#">
          <div className="font-MADEOKINESANSPERSONALUSE text-[20px] md:text-[25px]">
            <img alt="" className="md:hidden w-[36px] h-[36px]" src={LOGO} />
            <img src={LOGO_WITH_NAME} alt="" className="hidden md:inline  w-[270px]" />
          </div>
        </Link>

        <div className="flex items-center">
          {/* {'1' === '1' && */}
          {setShowWelcomeModal && pending &&
            <span className="fill-black stroke-black font-[none] w-[15px] h-[15px] cursor-pointer" onClick={() => setShowWelcomeModal(true)}>
              <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15.0003 28.3333C16.7516 28.3356 18.4861 27.9917 20.1041 27.3215C21.722 26.6513 23.1916 25.6679 24.4283 24.428C25.6683 23.1913 26.6517 21.7217 27.3219 20.1037C27.9921 18.4857 28.3359 16.7513 28.3337 15C28.3359 13.2487 27.992 11.5142 27.3218 9.89626C26.6516 8.27829 25.6683 6.80871 24.4283 5.57197C23.1916 4.33199 21.722 3.34864 20.1041 2.67843C18.4861 2.00822 16.7516 1.66437 15.0003 1.66664C13.2491 1.6644 11.5146 2.00827 9.89662 2.67848C8.27865 3.34869 6.80907 4.33202 5.57234 5.57197C4.33238 6.80871 3.34905 8.27829 2.67884 9.89626C2.00864 11.5142 1.66477 13.2487 1.667 15C1.66473 16.7513 2.00858 18.4857 2.67879 20.1037C3.349 21.7217 4.33235 23.1913 5.57234 24.428C6.80907 25.6679 8.27865 26.6513 9.89662 27.3215C11.5146 27.9917 13.2491 28.3355 15.0003 28.3333V28.3333Z" fill="none" stroke-width="2.5" stroke-linejoin="round"></path>
                <path d="M15 18.0833V15.4166C15.7911 15.4166 16.5645 15.182 17.2223 14.7425C17.8801 14.303 18.3928 13.6783 18.6955 12.9474C18.9983 12.2165 19.0775 11.4122 18.9231 10.6363C18.7688 9.86034 18.3878 9.14761 17.8284 8.5882C17.269 8.02879 16.5563 7.64783 15.7804 7.49349C15.0044 7.33915 14.2002 7.41836 13.4693 7.72111C12.7384 8.02386 12.1136 8.53655 11.6741 9.19435C11.2346 9.85214 11 10.6255 11 11.4166" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 24.0833C15.4427 24.0833 15.8666 23.9077 16.1792 23.5952C16.4917 23.2826 16.6673 22.8587 16.6673 22.4167C16.6673 21.9746 16.4917 21.5507 16.1792 21.2382C15.8666 20.9256 15.4427 20.75 15.0007 20.75C14.5586 20.75 14.1347 20.9256 13.8221 21.2382C13.5096 21.5507 13.334 21.9746 13.334 22.4167C13.334 22.8587 13.5096 23.2826 13.8221 23.5952C14.1347 23.9077 14.5586 24.0833 15.0007 24.0833Z" stroke="none"></path>
              </svg>
            </span>
          }

          <div className="grid place-items-center min-w-[40px] min-h-[40px] w-[40px] h-[40px] overflow-hidden rounded-full bg-[#4DC247]">
            <a size="50" href="https://wa.me/message/NQHPFCGYZWAXJ1" target="_blank" color="#4dc247" id="getbutton-whatsapp" className="w-[30px] h-[30px]" rel="noreferrer">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
                // xmlns: xlink="http://www.w3.org/1999/xlink"
                style={{ width: '100%', height: '100%', fill: 'rgb(255, 255, 255)', stroke: 'none' }}>
                <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"></path>
              </svg>
            </a>
          </div>

          {!admin && <Link className="w-[50px] h-[50px] p-[10px]" to={"/dashboard/" + data?.username + "/manage"}>
            <FiGrid size={30} className="w-[30px] h-[30px]" />
          </Link>}

          {data?.full_name && <div className="flex justify-center items-center md:gap-[10px] p-[10px] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <img
              src={data?.profile_pic_url}
              className="rounded-full w-[32px] h-[32px]"
              alt={data?.username?.charAt(0)?.toUpperCase()}
              loading="lazy"
            />

            <div className="relative flex items-center gap-2 text-lg font-MontserratRegular">
              <p className="font-semibold cursor-pointer text-sm after:ml-[2px] after:text-lg"><span className="hidden text-lg lg:inline font-MontserratSemiBold">@{data?.username}</span></p>
              <FaAngleDown className="hidden lg:block" />

              <ul className={`${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute z-10 bg-white py-2 w-[250px] top-[130%] right-[5%] shadow-[0_0_3px_#00000040] rounded-[10px] font-MontserratBold`}
                style={{
                  transition: "opacity .15s ease-in"
                }}
              >
                <div className="text-[#757575] px-6 mb-2 text-[16px] font-semibold">Accounts</div>

                <div className="max-h-[360px] overflow-auto pb-4 flex flex-col">
                  {accounts.map((account, i) => {
                    return (
                      <Link key={`account_nav_${account?.username}_${i + 1}`} className="font-normal text-sm hover:bg-[#f8f8f8]" to={"/dashboard/" + account?.username}
                        onClick={() => {
                          setIsOpen(!isOpen);
                          setActiveLink("Profile");
                        }}
                      >
                        <li className={`py-2 px-6 flex items-center gap-3 ${currentUsername === account?.username ? "bg-activelink" : ""}`}>
                          <img
                            src={account?.profile_pic_url}
                            className="rounded-full w-[32px] h-[32px]"
                            alt={data?.username?.charAt(0)?.toUpperCase()}
                            loading="lazy"
                          />
                          {account?.username}
                        </li>
                      </Link>
                    )
                  })}
                </div>

                {!admin && <div className="">
                  <div className="text-[#757575] px-6 mb-2 text-[16px] font-semibold">Options</div>

                  <Link className="font-normal text-sm hover:bg-[#f8f8f8] cursor-pointer" to={"/dashboard/" + data?.username + "/manage"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Profile");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3`}>
                      <FiGrid size={32} className="w-[32px] h-[32px]" />
                      Manage Accounts
                    </li>
                  </Link>

                  <Link className="font-normal text-sm hover:bg-[#f8f8f8]" to={"/search/?username=add_account"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Profile");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3`}>
                      <AiOutlinePlus size={32} className="rounded-full w-[32px] h-[32px]" />
                      Add Account
                    </li>
                  </Link>

                  <Link to={`/${data?.username}/settings`} className="font-normal text-sm hover:bg-[#f8f8f8]"
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Settings");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Settings" ? "bg-activelink" : ""}`}>
                      <AiOutlineSetting size={32} className="rounded-full w-[32px] h-[32px]" />
                      Settings
                    </li>
                  </Link>

                  {data?.admin && <Link className="font-normal text-sm hover:bg-[#f8f8f8]" to={"/admin"}
                    onClick={() => {
                      setIsOpen(!isOpen);
                      setActiveLink("Admin");
                    }}
                  >
                    <li className={`py-2 px-6 flex items-center gap-3 ${activeLink === "Admin" ? "bg-activelink" : ""}`}>
                      <MdAdminPanelSettings size={32} className="rounded-full w-[32px] h-[32px]" />
                      Admin
                    </li>
                  </Link>}

                  <li className="py-2 px-6 cursor-pointer hover:bg-[#f8f8f8] flex items-center gap-3"
                    onClick={async () => {
                      setIsOpen(!isOpen);
                      await supabase.auth.signOut();
                      window.onbeforeunload = function () {
                        localStorage.clear();
                      }
                      window.location.pathname = "/login";
                    }}
                  >
                    <FiLogOut size={32} className="rounded-full w-[32px] h-[32px]" />
                    <p className="text-sm font-normal" >
                      Log out
                    </p>
                  </li>
                </div>}
              </ul>
            </div>
          </div>}
        </div>
      </div>
    </nav>
  );
}
