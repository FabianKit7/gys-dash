import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import PrimaryButton from "../components/PrimaryButton";
import AlertModal from "../components/AlertModal";
import { LOGO_WITH_NAME } from "../config";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password !== cPassword) {
            setErrorMsg({ title: 'Alert', message: 'Password must be the same' })
            setIsModalOpen(true);
            return;

        }
        setLoading(true)
        const { data, error } = await supabase.auth.updateUser({ password })
        setLoading(false)

        if (error) {
            setErrorMsg({ title: 'Alert', message: 'There was an error updating your password.' })
            setIsModalOpen(true);
            return;
        }
        if (data) {
            setErrorMsg({ title: 'Alert', message: 'Password updated successfully!' })
            setIsModalOpen(true);

        }
        if (data?.user) return navigate(`/login`)
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

                    <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Reset Password</h5>
                    <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px]">Enter your new password below to reset your password.</p>
                </div>
                <form action="" className="flex flex-col items-center justify-start"
                    onSubmit={handleResetPassword}
                >
                    <div className="form-outline mb-3">
                        <input
                            type="password"
                            required
                            className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
                            value={password}
                            placeholder="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        /> <br />
                    </div>

                    <div className="form-outline font-MontserratRegular">
                        <input
                            type="password"
                            required
                            className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
                            value={cPassword}
                            placeholder="Confirm Password"
                            onChange={({ target }) => setCPassword(target.value)}
                        />
                    </div>

                    <div className="mt-6 mb-2">
                        <PrimaryButton type="submit" title={loading ? 'Processing...' : 'Reset'} customClass={'h-[52px] w-72 md:w-80 font-semibold text-[16px]'} />
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-black font-MontserratRegular">
                        Go to <Link to="/SignUp"><span className="font-MontserratSemiBold text-black">Sign Up</span></Link>
                    </p>
                </div>
                <br /><br />
            </div>
        </div>
    </>
    );

    //     return (<>
    //         <div id="affiliateScript"></div>

    //         <div className="flex flex-col items-center justify-center h-screen">
    //             <div className="p-5 rounded-lg shadow-lg">
    //                 <div className="flex flex-col items-center justify-center pb-10">
    //                     {/* <img className="w-48 h-40 mt-10 lg:mt-14" src={sproutyLogo} alt="Grow-your-social" /> */}
    //                     <div className="font-MADEOKINESANSPERSONALUSE text-[28px]"><strong className="text-[25px] text-left">Grow-your-social</strong></div>
    //                     <hr className="mb-7 w-full border-primary" />

    //                     <h5 className="font-bold text-[2.625rem] text-black font-MADEOKINESANSPERSONALUSE">Forgot Password?</h5>
    //                     <p className="text-center text-[0.75rem] font-MontserratRegular text-[#333] max-w-[320px]">Enter your new password below to reset your password.</p>
    //                 </div>
    //                 <form action="" className="flex flex-col items-center justify-start" onSubmit={handleResetPassword}>
    //                     <div className="mb-4 form-outline">
    //                         <input
    //                             type="password"
    //                             id=""
    //                             className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
    //                             value={password}
    //                             placeholder="Password"
    //                             onChange={({ target }) => setPassword(target.value)}
    //                             required
    //                         />
    //                     </div>
    //                     <div className="mb-4 form-outline">
    //                         <input
    //                             type="password"
    //                             id=""
    //                             className="rounded-[10px] py-4 px-4 w-80 text-[1.25rem] bg-transparent border shadow-[inset_0_0px_2px_rgba(0,0,0,0.4)]"
    //                             value={cPassword}
    //                             placeholder="Password"
    //                             onChange={({ target }) => setCPassword(target.value)}
    //                             required
    //                         />
    //                     </div>

    //                     <button
    //                         type="submit"
    //                         className="text-white font-MontserratSemiBold text-[16px] mt-[14px] mb-[12px] rounded-[5px] py-2 px-6 h-[52px] w-80 font-semibold"
    //                         style={{
    //                             backgroundColor: '#ef5f3c',
    //                             color: 'white',
    //                             boxShadow: '0 20px 30px -12px rgb(255 132 102 / 47%)'
    //                         }}
    //                     >
    //                         {loading ? "loading..." : "Continue"}
    //                     </button>
    //                 </form>

    //                 <div className="text-center font-MontserratSemiBold">
    //                     <p className="font-bold text-sm text-[#333]">
    //                         Go back to <Link to="/SignUp"><span className="text-black">Sign Up</span></Link>
    //                     </p>
    //                 </div>
    //                 <br /><br />
    //             </div>
    //         </div>
    //     </>
    //     );
}
