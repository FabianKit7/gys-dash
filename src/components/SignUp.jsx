import React, { useEffect, useState } from "react";
// import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getRefCode } from "../helpers";
import { supabase } from "../supabaseClient";
import AlertModal from "./AlertModal";
import PrimaryButton from "./PrimaryButton";
import * as PhoneNumber from "libphonenumber-js";
// import { BsFacebook } from "react-icons/bs";
import countryCodes from "../CountryCodes.json"
import axios from "axios";
import TinyFlag from "tiny-flag-react";
import { LOGO_WITH_NAME } from "../config";

function isValidPhoneNumber(phoneNumber, countryCode) {
  try {
    const parsedNumber = PhoneNumber.parse(phoneNumber, countryCode);
    return PhoneNumber.isValidNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState({});
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [searchCountryTerm, setSearchCountryTerm] = useState('')
  const [showCountriesList, setShowCountriesList] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get('https://ipinfo.io?token=3ca9e388b8033f');
        const { country } = response.data;
        setCountryCode(countryCodes.find(c => c.code === country));
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, []);


  const handleSignUp = async (e) => {
    e.preventDefault()
    var formattedPhone=phone
    if(phone){
      const phoneIsValid = isValidPhoneNumber((`${countryCode.dial_code}${phone}`), countryCode.code);
      if (!phoneIsValid) {
        setIsModalOpen(true);
        setErrorMsg({
          title: `Invalid phone number: `, message: `Phone number not valid for ${countryCode.name}`
        })
        return;
      }
      const phoneNumber = PhoneNumber.parsePhoneNumber(`${countryCode.dial_code}${phone}`)
      formattedPhone = phoneNumber.formatInternational()
    }

    if (loading) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log(error?.message);
      // alert(error?.message);
      setIsModalOpen(true);
      setErrorMsg({ title: 'Registration Error', message: error?.message })
      setLoading(false);
      return;
    }

    const contd = await regContd(data?.user, formattedPhone)
    if (contd?.status !== 200) {
      // alert(contd?.message)
      setIsModalOpen(true);
      setErrorMsg({ title: 'Registration Error', message: contd?.message })
    }
    setLoading(false);
  };

  // async function handleOAuthSignIn(provider) {
  //   const { error } = await supabase.auth.signInWithOAuth({ provider })
  //   if (error) {
  //     // alert("Error occurred while signing in with Google, please try again")
  //     console.log(error);
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: error?.message })
  //   }

  //   const getUser = await supabase.auth.getUser()

  //   if (getUser?.error) {
  //     console.log(error?.message);
  //     // alert(error?.message);
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: getUser?.error?.message })
  //     setLoading(false);
  //     return;
  //   }

  //   const contd = await regContd(getUser?.data?.user)
  //   if (contd?.status !== 200) {
  //     // alert(contd.message)
  //     setIsModalOpen(true);
  //     setErrorMsg({ title: 'Registration Error', message: contd?.message })
  //   }
  //   setLoading(false);
  // }

  const regContd = async (authUser, phone) => {
    if (authUser) {
      const { error } = await supabase
        .from("users")
        .insert({
          auth_user_id: authUser?.id,
          full_name: fullName,
          phone: phone || '',
          email: email?.toLowerCase(),
          username: ''
        });
      if (error) {
        console.log(error);
        setLoading(false);
        alert('User record not recorded, try again or contact support');
        return { status: 500, message: "User record not recorded" }
      } else {
        const ref = getRefCode()
        if (ref) {
          navigate(`/search?ref=${ref}`)
        } else {
          navigate("/search")
        }
        return { status: 200, message: "success" }
      }
    } else {
      return { status: 500, message: "User not found" }
    }
  }

  return (<>
    <AlertModal
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false) }}
      title={errorMsg?.title}
      message={errorMsg?.message}
    />

    <div className="md:flex flex-col items-center justify-center h-screen py-4 md:py-0">
      <div className="md:p-10 md:shadow-lg rounded-[10px] w-full md:w-[458px]">
        <div className="flex flex-col items-center justify-center">
          <div className="font-MADEOKINESANSPERSONALUSE text-[28px]">
            <img src={LOGO_WITH_NAME} alt="" className="w-[220px]" />
          </div>
          <hr className="mt-1 md:mb-7 w-full border-primary" />

          <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratSemiBold mt-[30px]">Partner With Us</h5>
          <p className="text-center text-[0.8rem] mt-2 mb-6 font-MontserratRegular text-black max-w-[320px]">Join more than <span className="font-bold">3,000</span> users that trust Grow-your-social to grow on Instagram. <br className="md:hidden" /> Create an account.</p>
        </div>

        <form action="" className="flex flex-col items-center justify-start" onSubmit={handleSignUp}>
          <div className="mb-3 form-outline">
            <input
              type="text"
              id=""
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
              value={fullName}
              placeholder="Full Name"
              required
              onChange={({ target }) => setFullName(target.value)}
            />
          </div>


          <div className="flex items-center justify-between gap-3 mb-3 w-72 md:w-80">
            <div className="w-[30%] h-[52px] rounded-[5px] px-4 border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] grid place-items-center">
              <div className="relative">
                <div className="cursor-pointer flex items-center justify-evenly gap-2" onClick={() => {
                  setShowCountriesList(!showCountriesList)
                }}>
                  <div className="w-4 h-auto">
                    <TinyFlag
                      country={countryCode?.code || ''}
                      alt={`${countryCode?.namee || ''} Flag`}
                      fallbackImageURL={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${countryCode?.code || ''}.svg`}
                    />
                  </div>
                  <div className="text-xs">
                    {countryCode.dial_code}
                  </div>
                </div>

                <div className={`${showCountriesList ? "pointer-events-auto h-auto opacity-100" : "pointer-events-none h-0 opacity-0"} absolute z-50 bg-white shadow-2xl top-full left-0 max-h-[40vh] rounded-lg pb-1 overflow-hidden transition-all`}>
                  <div className="h-[20%]">
                    <input
                      type="search"
                      placeholder="Search by Country"
                      className="h-[40px] rounded-lg my-3 mx-2 p-2 outline-none border border-gray-500" onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          setSearchCountryTerm('')
                        }

                        setTimeout(() => {
                          setSearchCountryTerm(e.target.value)
                        }, 1000);
                      }} />
                  </div>

                  <div className="max-h-[250px] h-[250px] overflow-auto">
                    {countryCodes.filter(c => c.name.toLowerCase().startsWith(searchCountryTerm.toLowerCase())).map(country => <div key={`country_code-${country.name}`}
                      className="flex gap-3 p-2 cursor-pointer hover:bg-blue-100/50 "
                      onClick={() => {
                        setCountryCode(country);
                        setShowCountriesList(false)
                      }}>
                      <div className="min-w-[35%] flex items-center gap-1">
                        <TinyFlag
                          country={country?.code || ''}
                          alt={`${country?.namee || ''} Flag`}
                          fallbackImageURL={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${country?.code || ''}.svg`}
                        />
                        <div className="">({country.dial_code})</div>
                      </div>
                      <div className="w-full">{country.name}</div>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[52px] rounded-[5px] px-4 border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] flex items-center disableInc">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                id=""
                className="outline-none border-none w-full"
                value={phone}
                placeholder="Phone Number (Optional)"
                // required
                onChange={({ target }) => setPhone(target.value)}
              />
            </div>
          </div>


          <div className="mb-3 form-outline">
            <input
              type="email"
              id=""
              className="rounded-[5px] h-[52px] px-4 w-72 md:w-80 text-[1rem] bg-transparent border shadow-[inset_0_0px_1px_rgba(0,0,0,0.4)] outline-none"
              value={email}
              placeholder="Email Address"
              required
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
              required
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          {/* <button
            type="submit"
            className="text-white font-MontserratSemiBold text-[16px] mt-6 mb-2 rounded-[5px] h-[52px] px-4 w-72 md:w-80 font-semibold"
            style={{
              backgroundColor: '#ef5f3c',
              color: 'white',
              boxShadow: '0 10px 30px -12px rgb(255 132 102 / 47%)'
            }}
          >
            {loading ? 'Processing...' : 'Sign Up Now'}
          </button> */}
          <button type="submit" className="mt-6 mb-2">
            <PrimaryButton title={loading ? 'Processing...' : 'Sign Up Now'} customClass={'h-[52px] w-72 md:w-80 font-semibold text-[16px]'} />
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-black font-MontserratRegular">
            Already have an account? <Link to="/login"><span className="font-MontserratSemiBold text-black">Sign in</span></Link>
          </p>
        </div>
      </div>
      <br />
      <br />
    </div>
  </>
  );
}
