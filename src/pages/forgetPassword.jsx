import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import PrimaryButton from "../components/PrimaryButton";
import AlertModal from "../components/AlertModal";
import { LOGO_WITH_NAME } from "../config";

export default function ForgetPassword() {
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) return navigate(`/dashboard/${user?.id}`)
        };

        getData();
    }, [navigate]);

    const handleSendResetLink = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!email) return;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://app.grow-your-social.com/reset-password',
        })

        setLoading(false)
        if (error) {
            console.log(error.message);
            if (error?.message === `Cannot read properties of null (reading 'id')`) {
                setIsModalOpen(true);
                setErrorMsg({ title: 'Alert', message: 'User not found please try again or register' })
            } else {
                console.log({ error });
                console.log('message: ', error.message);
                setIsModalOpen(true);
                setErrorMsg({ title: 'Alert', message: 'An error occurred, please try again' })
            }
        } else {
            setPage(1)
        }
    }

    return (<>
        <AlertModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false) }}
            title={errorMsg?.title}
            message={errorMsg?.message}
        />

        <div className="flex flex-col items-center justify-center h-screen">
            <div className="p-5 md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
                <div className="flex flex-col items-center justify-center">
                    <div className="font-MADEOKINESANSPERSONALUSE text-[28px]">
                        <img src={LOGO_WITH_NAME} alt="" className="w-[220px]" />
                    </div>
                    <hr className="mt-1 md:mb-7 w-full border-primary" />
                </div>
                <div className={`${page === 0 ? "opacity-100 h-auto pointer-events-auto" : "opacity-0 h-0 pointer-events-none"} transition-all duration-[0.75]`}>
                    <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Forgot Password?</h5>
                    <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px]">Enter your email address you registered with and you will receive instructions on it to reset your password within minutes.</p>
                    <form action="" className="flex flex-col items-center justify-start"
                        onSubmit={handleSendResetLink}
                    >
                        <div className="mb-3 form-outline font-MontserratRegular">
                            <input
                                type="email"
                                id="form2Example1"
                                className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
                                value={email}
                                placeholder="Email Address"
                                onChange={({ target }) => setEmail(target.value)}
                            />
                        </div>

                        <div className="mt-6 mb-2">
                            <PrimaryButton type="submit" title={loading ? 'Processing...' : 'Send'} customClass={'h-[52px] w-72 md:w-80 font-semibold text-[16px]'} />
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="font-bold text-sm text-[#333]">Go back to <Link to="/SignUp"><span className="text-black">Login</span></Link>
                        </p>
                    </div>
                </div>

                <div className={`${page === 1 ? "opacity-100 h-auto pointer-events-auto" : "opacity-0 h-0 pointer-events-none"} transition-all duration-[0.75]`}>
                    <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Email has been sent!</h5>
                    <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px] mx-auto">The recovery email has been sent out to your registered email address. If there isn't any account associated with provided email. Please try again.</p>

                    <div className="mt-6 mb-2 w-full mx-auto" onClick={() => {
                        // navigate('/')
                        setPage(0)
                    }}>
                        <PrimaryButton title={loading ? 'Processing...' : 'Back'} customClass={'h-[52px] w-full max-w-[250px] mx-auto md:w-72 md:w-80 font-semibold text-[16px]'} />
                    </div>
                </div>

                <br /><br />
            </div>
        </div>
    </>
    );

    // return (<>
    //     <div id="affiliateScript"></div>
    //     <div className="flex flex-col items-center justify-center h-screen">
    //         <div className="p-5 rounded-lg shadow-lg">
    //             <div className="flex flex-col items-center justify-center pb-10">
    //                 {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="Grow-your-social" /> */}
    //                 <div className="font-MADEOKINESANSPERSONALUSE text-[28px]"><strong className="text-[25px] text-left">Grow-your-social</strong></div>
    //                 <hr className="mb-7 w-full border-primary" />

    //                 <h5 className="font-bold text-[2.625rem] text-black font-MADEOKINESANSPERSONALUSE">Forgot Password?</h5>
    //                 <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333] max-w-[320px]">Enter your email address and we will send you instructions to reset your password.</p>
    //             </div>
    //             {page === 0 ?
    //                 <>
    //                     <form action="" className="flex flex-col items-center justify-start" onSubmit={handleSendResetLink}>
    //                         <div className="mb-4 form-outline font-MontserratRegular">
    //                             <input
    //                                 type="email"
    //                                 id="form2Example1"
    //                                 className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
    //                                 value={email}
    //                                 placeholder="Email Address"
    //                                 onChange={({ target }) => setEmail(target.value)}
    //                                 required
    //                             />
    //                         </div>

    //                         <button
    //                             type="submit"
    //                             className="text-white font-MontserratSemiBold text-[16px] mt-[14px] mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-80 font-semibold"
    //                             style={{
    //                                 backgroundColor: '#ef5f3c',
    //                                 color: 'white',
    //                                 boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
    //                             }}
    //                         >
    //                             {loading ? "loading..." : 'Continue'}
    //                         </button>
    //                     </form>

    //                     <div className="text-center font-MontserratSemiBold">
    //                         <p className="font-bold text-sm text-[#333]">
    //                             Go back to <Link to="/SignUp"><span className="text-black">Sign Up</span></Link>
    //                         </p>
    //                     </div>
    //                 </> :
    //                 <p className="font-bold text-sm text-[#333]">
    //                     The instructions to reset your password has been sent to your email address please check.
    //                 </p>
    //             }
    //             <br /><br />
    //         </div>
    //     </div>
    // </>
    // );
}
