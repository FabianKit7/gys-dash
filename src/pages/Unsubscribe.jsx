import React from "react";
// import { RxCaretRight } from "react-icons/rx"
// import CrispChat from "./CrispChat";
// import Nav from "./Nav";
// import SearchBox from "./search/SearchBox";
// import OnboardingSearchBox from "./search/OnboardingSearchBox";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useState } from "react";
// import { MdLogout } from "react-icons/md";
import { useClickOutside } from "react-click-outside-hook";
// import { LOGO } from "../config";
import PrimaryButton from "../components/PrimaryButton";
// import { Spinner } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";

export default function EmailUnsubscribe() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUsername = urlParams.get("username");
    const [user, setUser] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [parentRef, isClickedOutside] = useClickOutside();

    useEffect(() => {
        if (isClickedOutside) {
            // setShowMenu(false)
        };
    }, [isClickedOutside]);

    useEffect(() => {
        const getData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const { data } = await supabase
                .from("users")
                .select()
                .eq("user_id", user.id);
            setUser(data?.[0]);
        };

        getData();
    }, []);

    // console.log(user);

    return (<>
        <div id="affiliateScript"></div>
        {/* <CrispChat /> */}

        <div className="text-[#757575] relative">
            <div className="max-w-[1600px] mx-auto">
                {/* <div className="hidden lg:block absolute top-[14px] right-[14px] z-[1] cursor-pointer">
                    <div className="flex items-center gap-3" onClick={() => {
                        setShowMenu(!showMenu);
                    }}>
                        <span className=""> {user?.full_name} </span>
                        <div className={`${showMenu && ' border-red-300'} border-2 rounded-full`}>
                            <div className={`w-[32px] h-[32px] rounded-full bg-primary/90 text-white grid place-items-center`}>
                                <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden bg-white fixed top-0 left-0 z-[5] flex items-center justify-between w-full px-5 py-4 gap-2 font-[600] font-MontserratRegular shadow-[0_2px_4px_#00000026]" onClick={() => {
                    showMenu && setShowMenu(false);
                }}>
                    <div className="flex">
                        <img alt="" className="w-[36px] h-[36px]" src={LOGO} />
                    </div>
                    <div className={`${showMenu && ' border-red-300'} border-2 rounded-full`}>
                        <div className={`w-[32px] h-[32px] rounded-full bg-primary/90 text-white grid place-items-center cursor-pointer`} onClick={() => {
                            setShowMenu(!showMenu);
                        }}>
                            <span className={`text-[22px] pointer-events-none select-none font-[400] uppercase`}>{user?.full_name && (user?.full_name)?.charAt(0)}</span>
                        </div>
                    </div>
                </div>

                <div className={`${!showMenu && 'opacity-0 pointer-events-none hidden'} absolute top-0 left-0 w-full h-screen z-10`}>
                    <div className="absolute top-0 left-0 z-10 w-full h-screen cursor-pointer bg-black/0" onClick={() => {
                        setShowMenu(!showMenu);
                    }}></div>
                    <div className={`${!showMenu && 'opacity-0 pointer-events-none hidden'} absolute top-0 lg:top-14 z-10 left-5 lg:left-[unset] right-5 bg-white w-[calc(100%-40px)] lg:w-[350px] lg:max-w-[400px] rounded-[10px] shadow-[0_5px_10px_#0a17530d] transition-all duration-150 ease-in`} ref={parentRef} tabIndex={0}>
                        <div className="flex items-center gap-3 p-5">
                            <div className="w-[50px] h-[50px] rounded-full bg-primary/90 text-white grid place-items-center">
                                <span className="text-[22px] pointer-events-none select-none font-[400] uppercase">{user?.full_name && (user?.full_name)?.charAt(0)}</span>
                            </div>
                            <div className="">
                                <div className="text-black font-bold font-MontserratSemiBold text-[14px]">{user?.full_name}</div>
                                <div className="text-[12px]">{user?.email}</div>
                            </div>
                        </div>

                        <div className="border-t border-[#f8f8f8] flex items-center gap-3 h-[53px] text-black px-5 cursor-pointer hover:bg-blue-gray-100" onClick={async () => {
                            setShowMenu(!showMenu)
                            await supabase.auth.signOut();
                            window.onbeforeunload = function () {
                                localStorage.clear();
                            }
                            window.location.pathname = "/login";
                        }}>
                            <MdLogout size={22} /> <span className="">Logout</span>
                        </div>
                    </div>
                </div> */}

                <div className="h-[calc(100vh-75px)] lg:h-screen mt-[75px] lg:mt-0 lg:py-[60px] 2xl:py-[100px] lg:px-[100px] bg-[#f8f8f8]">
                    <div className="w-full max-w-full lg:max-w-[960px] xl:max-w-[1070px] h-[789px] my-auto 2xl:grid max-h-full lg:mx-auto relative rounded-[20px] shadow-[0_5px_10px_#0a17530d] bg-white">
                        {/* <div className="absolute -top-10 left-0 hidden lg:flex items-center gap-2 font-[600] font-MontserratRegular">
                            <div className="text-primary">Select Your Account</div>
                            <div className="">{`>`}</div>
                            <div className="">Complete Setup</div>
                            <div className="">{`>`}</div>
                            <div className="">Enter Dashboard</div>
                        </div> */}

                        <div className="flex flex-col justify-between h-full px-5 pb-4 lg:justify-center lg:items-center text-start lg:text-center lg:px-0">
                            <div className="block lg:flex flex-col lg:justify-center lg:items-center pb-[80px]">
                                <h1 className='font-bold text-black font-MontserratBold text-[26px] pb-3'>Unsubscribe</h1>
                                {/* <p className='text-[0.875rem] font-MontserratRegular lg:px-[100px]'>Find your Instagram account and start growing followers with <br className='hidden lg:block' /> Grow-your-social</p> */}

                                <div className="flex flex-col justify-between mt-3 lg:block">
                                    <div className="flex flex-col items-center justify-between h-full w-full lg:h-fit lg:w-[411px] relative" ref={parentRef}>
                                        <div className={`w-full lg:w-[411px] h-[62px] transition-all duration-300 ease-in`}>
                                            <div className={`p-5 h-full flex items-center border border-black text-black rounded-[10px]`}>
                                                <input
                                                    type="text"
                                                    className="w-full outline-none placeholder-black/75"
                                                    placeholder="@username"
                                                    // value={''}
                                                    // ref={}
                                                    onChange={(e) => {
                                                        // setDebouncedQuery(e.target.value);
                                                        // setShowResultModal(true)
                                                    }}
                                                // onFocus={() => {
                                                //   setShowResultModal(true)
                                                // }}
                                                />
                                                {/* <div className="relative flex items-center justify-center">
                                                    <span className="mt-1">{loading && (<>
                                                        <Spinner animation="border" />
                                                    </>)}</span>
                                                    {input && <TiTimes className='cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' onClick={() => { setDebouncedQuery(''); setSearchedAccounts([]) }} />}
                                                </div> */}
                                            </div>
                                        </div>

                                        <button className={` hidden lg:block mt-[40px] w-full lg:w-[350px] h-[60px] py-[15px] rounded-[10px] text-[1.125rem] font-semibold text-white`}
                                            // onClick={() => { (selected && !processing) && handleSubmit() }}
                                        >
                                            <PrimaryButton title={processing ? 'Processingt…' : 'Unsubscribe'} customClass={`h-[52px] w-72 md:w-80 font-semibold text-[16px] ${processing && 'animate-pulse'} bg-primary ${processing && 'cursor-wait bg-primary/70'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="fixed left-0 w-full px-5 bottom-6">
                                <button className={`bg-primary lg:hidden w-full lg:w-[350px] h-[50px] py-[15px] rounded-[10px] text-[.8rem] font-semibold text-white ${processing && 'cursor-wait bg-primary/70'}`}
                                    // onClick={() => { (selected && !processing) && handleSubmit() }}
                                >
                                    {processing ? <span className="animate-pulse">Processing…</span> : <div className='flex items-center justify-center gap-2'>Unsubscribe<FaAngleRight size={20} /></div>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
