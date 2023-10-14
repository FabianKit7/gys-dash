import { useEffect, useState } from "react";
// import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../helpers";
import { supabase } from "../supabaseClient";
import AlertModal from "./AlertModal";
import PrimaryButton from "./PrimaryButton";
// import { BsFacebook } from "react-icons/bs";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const u = user ? await getUser(user?.id) : null
      if (u?.status === 200) return navigate(`/dashboard/${u?.obj.username}`)
      // console.log(u);
    };

    getData();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return;

    setLoading(true);
    try {
      const authUserObj = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authUserObj?.error) {
        console.log(authUserObj?.error?.message);
        if (authUserObj?.error?.message === 'Invalid login credentials') {
          showErrorAlert(authUserObj?.error)
          // alert(`${authUserObj.error.message}, please check your credentials and try again`);
          setLoading(false);
          return;
        }
        if (authUserObj.error?.message === `Cannot read properties of null (reading 'id')`) {
          // alert('User not found please try again or register')
          setIsModalOpen(true);
          setErrorMsg({ title: 'Login Error', message: 'User not found please try again or register' })
          setLoading(false);
          return;
        } else {
          // alert('An error occurred, please try again')
          setIsModalOpen(true);
          setErrorMsg({ title: 'Login Error', message: 'An error occurred, please try again' })
          setLoading(false);
          return;
        }
      }

      if (authUserObj?.error) {
        setLoading(false);
        return;
      }

      const contd = await regContd(authUserObj?.data?.user)
      if (contd?.status !== 200) {
        showErrorAlert(contd)
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      setIsModalOpen(true);
      setErrorMsg({ title: 'Login Error', message: `An error occured: ${error}` })
      setLoading(false);
      return;
    }
  }

  function showErrorAlert(error) {
    if (error) {
      // alert("Error occurred while signing in with Google, please try again")
      console.log(error);
      setIsModalOpen(true);
      setErrorMsg({ title: 'Login Error', message: error?.message })
    }
  }

  const regContd = async (authUser) => {
    const user = await getUser(authUser?.id)
    if (user) {
      if (user.status === 500) {
        console.log(user.obj);
        alert('an error occured')
        setLoading(false);
        return
      } else {
        navigate(`/dashboard/${user?.obj?.username}`)
        // window.location = `/dashboard/${authUser?.data?.user?.username}`;
      }
      setLoading(false);
      return;
    }
  }

  return (<>
    <AlertModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false) }}
      title={errorMsg?.title}
      message={errorMsg?.message}
    />

    <div id="affiliateScript"></div>
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-5 md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
        <div className="flex flex-col items-center justify-center">
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]">
            <img src="/liftinf-logo-with-name.svg" alt="" className="w-[220px]" />
          </div>
          <hr className="mt-1 md:mb-7 w-full border-primary" />

          <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Welcome Back</h5>
          <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px]">Start growing <span className="font-bold">~1-10k</span> real and targeted Instagram <span className="font-bold">followers</span> every month.</p>
        </div>
        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleLogin}>
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

          <div className="form-outline">
            <input
              type="password"
              id=""
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
              value={password}
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
            /> <br />
            <Link to="/forget-password"><span className="text-black font-MontserratSemiBold font-[600] text-[14px] mt-3">Forgot Password?</span></Link>
          </div>

          <button type="submit" className="mt-6 mb-2">
            <PrimaryButton title={loading ? 'Processing...' : 'Continue'} customClass={'h-[52px] w-72 md:w-80 font-semibold text-[16px]'} />
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-black font-MontserratRegular">
            Don't have an account? <Link to="/SignUp"><span className="font-MontserratSemiBold text-black">Sign Up</span></Link>
          </p>
        </div>
        <br /><br />
      </div>
    </div>
  </>
  );
}
