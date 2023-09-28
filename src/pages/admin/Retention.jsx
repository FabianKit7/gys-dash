import React, { useEffect, useState } from 'react'
import Header from './components/header'
import { Chargebee } from '../../dashboard'
import { supabase } from '../../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { countDays } from '../../helpers'
import copy from 'copy-to-clipboard';
import { ChangeStatusModal, calculateLast7DaysGrowth, statuses } from './ManagePage'
import { FaInstagram, FaTimes } from 'react-icons/fa'
import { BACKEND_URL, LOGO } from '../../config'
import axios from 'axios'

export default function Retention() {
  const navigate = useNavigate();
  const [fetchingUser, setFetchingUser] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionName, setSectionName] = useState('active')
  const [sectionTotal, setSectionTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState()
  const [showChargebee, setShowChargebee] = useState(false)
  const [users, setUsers] = useState([])
  const [refreshUsers, setRefreshUsers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ sectionName: '', value: '' })
  const [showCheckActiveUsersModal, setSetshowCheckActiveUsersModal] = useState(false)

  // verity user
  useEffect(() => {
    const getData = async () => {
      const authUserRes = await supabase.auth.getUser()
      if (authUserRes.error) return navigate("/login")
      const authUser = authUserRes?.data?.user
      const getSuperUser = await supabase.from('users').select().eq("email", authUser.email)
      const superUser = getSuperUser?.data?.[0]
      if (!superUser || !superUser?.admin) return navigate("/login")
      setFetchingUser(false)
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      if (!sectionName) return;
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("status", sectionName.toLocaleLowerCase())
        .limit(3000)
      error && console.log(error);
      if (error) return;

      setUsers([]);
      setSectionTotal(0)
      setTimeout(() => {
        setUsers(data);
        setSectionTotal(data?.length)
        setLoading(false)
      }, 500);
    }
    fetch()
  }, [sectionName, refreshUsers])

  // growthDifference
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(async user => {
        const resData = await supabase
          .from('sessions')
          .select()
          .eq('username', user?.username)
        resData.error && console.log(resData.error);
        var d = resData?.data?.[0]?.data
        // console.log(d);
        const growthDifference = calculateLast7DaysGrowth(d)
        // console.log(growthDifference);
        var v;
        if (growthDifference) {
          v = `
          <div class="${growthDifference > 0 ? "text-primary/90" : `${parseInt(growthDifference) === 0 ? "text-[#000]" : "text-[#E9C81B]"}`} font-black">${growthDifference}</div>
          `
        } else {
          v = `
          <div class="text-[#000] font-black">N/A</div>
          `
        }
        document.getElementById(`last_7_days_growth_${user?.username}`).innerHTML = v
      })
    }
  }, [users])

  if (fetchingUser) {
    return (<>
      Loading...
    </>)
  }

  return (
    <div className="font-MontserratRegular max-w-[1600px] mx-auto">
      {showCheckActiveUsersModal && <div className="fixed top-0 left-0 w-full h-screen bg-transparent z-[99999]">
        <div className="absolute top-0 left-0 h-full w-full z-[2] bg-black/50 cursor-pointer" onClick={() => { setSetshowCheckActiveUsersModal(false) }}></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 h-full min-w-[320px] z-[3] bg-white shadow-2xl rounded-2xl p-4">
          <CheckActiveUsers />
        </div>
      </div>}

      {showChargebee && <Chargebee k={selectedUser?.id} user={selectedUser} setShowChargebee={setShowChargebee} />}
      <Header
        setUsers={setUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setLoading={setLoading}
      />

      <div className="mt-[30px] h-[59px] w-fit rounded-[10px] bg-[#000000] text-[25px] font-bold font-MontserratBold text-white px-4 flex justify-center items-center relative">
        <div className="flex items-center justify-center capitalize cursor-pointer select-none"
          onClick={() => { setSetshowCheckActiveUsersModal(true) }}>Check Active users
        </div>
      </div>

      <div className="mt-[30px] h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] px-5 flex items-center gap-2">
        {statuses.map(status => {
          return (
            <div key={`retention_page-${status}`} className="h-[59px] rounded-[10px] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex justify-center items-center relative">
              <div className="flex items-center justify-center capitalize cursor-pointer select-none" onClick={() => { setSectionName(status) }}>{status}
                {status === sectionName && <span className="px-[15px] h-[37px] rounded-[10px] text-center text-white bg-primary select-none ml-5">{sectionTotal}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {loading && <div className="flex items-center justify-center">
        <img src={LOGO} alt="Loading" className="w-10 h-10 animate-spin" />
      </div>}

      <table className="mt-[30px] w-full table-auto border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th></th>
            <th>Account</th>
            <th>Email</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Last 7 Days Growth</th>
            <th>Updated</th>
            <th colSpan={3}>
              <div className="text-center">Actions</div>
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => {
            if (!user) {
              return ("Loading")
            }

            return (
              <tr key={`${user?.username}_${index + 1}_row`} className='rounded-[10px] bg-[#F8F8F8] h-[64px] w-full'>
                <td>
                  <img src={user?.profile_pic_url} alt="" className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4" />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="relative cursor-pointer max-w-[180px] break-words"
                      onClick={() => {
                        copy(user?.username, {
                          debug: true,
                          message: 'Press #{key} to copy',
                        })
                        setMessage({ sectionName: `username-${user?.username}`, value: 'copied' })
                        setTimeout(() => {
                          setMessage({ sectionName: '', value: '' })
                        }, 1000);
                      }}
                    >@{user?.username}
                      {message.sectionName === `username-${user?.username}` && <div className="absolute font-bold text-black">{message.value}</div>}
                    </div>

                    <a href={`https://www.instagram.com/${user?.username}/`} target='_blank' rel="noreferrer" >
                      <FaInstagram size={16} color="red" />
                    </a>
                  </div>
                </td>
                <td>
                  <div className="max-w-[200px] break-words">
                    <a href={`mailto:${user?.email}`} className="">{user?.email}</a>
                  </div>
                </td>
                <td>{user?.followers}</td>
                <td>{user?.following}</td>
                <td>
                  <div id={`last_7_days_growth_${user?.username}`}>N/A
                  </div>
                </td>
                <td>
                  <div>
                    {user?.session_updated_at ? countDays(user?.session_updated_at) : "N/A"}
                  </div>
                </td>
                <td>
                  <div className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowChargebee(true)
                    }}>
                    <img src="/icons/monetization.svg" alt="" className="w-[18px] h-[18px]" />
                  </div>
                </td>
                <td>
                  <Link to={`/dashboard/${user?.username}?uuid=${user?.user_id}`} target='_blank' className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black">
                    <img src="/icons/user-settings.svg" alt="" className="w-[18px] h-[18px]" />
                  </Link>
                </td>
                <td>
                  <div className="relative w-full">
                    <ChangeStatusModal user={user} refreshUsers={refreshUsers} setRefreshUsers={setRefreshUsers} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const CheckActiveUsers = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ sectionName: '', value: '' })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("status", 'active'.toLocaleLowerCase())
        .limit(3000)
      error && console.log(error);
      if (error) return;

      setUsers(data);
      setLoading(false)

      var count = 0;
      while (count < data.length) {
        const user = data[count];
        const chargebee_customer_id = user.chargebee_customer_id;
        const baseUrl = BACKEND_URL
        if (chargebee_customer_id) {
          let subscription = await axios.post(`${baseUrl}/api/subscription_list`,
            { customer_id: chargebee_customer_id })
            .then((response) => response.data)
          const status = (subscription?.status === 'active' && subscription?.due_invoices_count > 0) ?
            `Invoice Due ( ${subscription?.due_invoices_count} )` : subscription?.status
          const el = document.getElementById(`chargebee_status_${user.username}`)
          if (el) {
            el.textContent = status;
          }
          // newList.push({ ...data, sub_status: status })
        }
        count++
      }
    }
    fetch()
  }, [])

  const hangleSearch = async () => {
    document.getElementById(`cau_u_${searchTerm}`).style.backgroundColor = 'yellow';
    document.getElementById(`cau_${searchTerm}`).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => {
      document.getElementById(`cau_u_${searchTerm}`).style.backgroundColor = 'transparent'
    }, 2000)
  }

  const cancelUser = async (user) => {
    const baseUrl = BACKEND_URL
    if (loading || !user) return

    setLoading(true)
    var chargebee_subscription_id = user.chargebee_subscription_id
    if (!chargebee_subscription_id && user?.chargebee_customer_id) {
      const url = `${BACKEND_URL}/api/subscription_list`
      let subscription = await axios.post(url,
        { customer_id: user?.chargebee_customer_id })
        .then((response) => response.data)
      console.log(subscription)
      if (subscription?.id) {
        chargebee_subscription_id = subscription?.id
      }
    }
    if (!chargebee_subscription_id) {
      alert("Subscription id not found!");
      setLoading(false)
      return
    }

    console.log(user?.chargebee_customer_id);
    console.log(chargebee_subscription_id);

    // TODO cancel user in chargebee then supabase
    let cancelRes = await axios.post(`${baseUrl}/api/cancel_subscription_for_customer`,
      {
        subscription_id: chargebee_subscription_id
      }).catch(err => err)
    if (cancelRes.status !== 200) {
      console.log(cancelRes);
    }
    // cancel user in supabase
    const res = await supabase
      .from("users")
      .update({ status: 'cancelled' })
      .eq('email', user?.email)
      .eq('username', user?.username);
    if (res?.error) {
      console.log(res);
      alert('an error occurred!')
    }

    // remove the user from list.
    const userRow = document.getElementById(`cau_${user.username}`)
    if (userRow) {
      userRow.style.display = 'none';
    }
    
    setLoading(false)
  }

  return (<div className='relative h-full overflow-auto'>
    <form className="fixed z-[999999] w-full bg-white px-4 top-3 left-0 min-h-[30px] border-b-3" onSubmit={(e) => { e.preventDefault(); hangleSearch() }}>
      <div className="flex items-center px-2 py-4 bg-white border rounded-xl">
        @<input
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value) }}
          type="search"
          className="w-full border-none outline-none"
          placeholder='Search by username' />
      </div>
    </form>

    <div className="min-h-[60px]"></div>

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999999999]">
      {loading && <div className="flex items-center justify-center">
        <img src={LOGO} alt="Loading" className="w-10 h-10 animate-spin" />
      </div>}
    </div>

    <table className="mt-[5px] w-full table-auto border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th></th>
          <th>Account</th>
          <th>Email</th>
          <th>Status</th>
          <th>
            <div className="text-center">Actions</div>
          </th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => {
          if (!user) {
            return ("Loading")
          }

          return (
            <tr key={`${user?.username}_${index + 1}_row`} id={`cau_${user.username}`} className='rounded-[10px] bg-[#F8F8F8] h-[64px] w-full'>
              <td>
                <img src={user?.profile_pic_url} alt="" className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4" />
              </td>
              <td>
                <div id={`cau_u_${user.username}`} className="flex items-center gap-2">
                  <div className="relative cursor-pointer max-w-[180px] break-words"
                    onClick={() => {
                      copy(user?.username, {
                        debug: true,
                        message: 'Press #{key} to copy',
                      })
                      setMessage({ sectionName: `username-${user?.username}`, value: 'copied' })
                      setTimeout(() => {
                        setMessage({ sectionName: '', value: '' })
                      }, 1000);
                    }}
                  >@{user?.username}
                    {message.sectionName === `username-${user?.username}` && <div className="absolute font-bold text-black">{message.value}</div>}
                  </div>

                  <a href={`https://www.instagram.com/${user?.username}/`} target='_blank' rel="noreferrer" >
                    <FaInstagram size={16} color="red" />
                  </a>
                </div>
              </td>
              <td>
                <div className="max-w-[200px] break-words">
                  <a href={`mailto:${user?.email}`} className="">{user?.email}</a>
                </div>
              </td>
              <td id={`chargebee_status_${user.username}`}></td>
              <td>
                <div>
                  <FaTimes color='red' className="flex items-center justify-center w-full cursor-pointer" onClick={() => {
                    if (window.confirm("Are you sure you want to set this user to cancel?")) {
                      cancelUser(user);
                    }
                  }} />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>)
}