import React, { useEffect, useState } from 'react';
import Header from './components/header';
// import { Chargebee } from '../../dashboard';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { countDays } from '../../helpers';
import copy from 'copy-to-clipboard';
import {
  ChangeStatusModal,
  calculateLast7DaysGrowth,
  statuses,
} from './ManagePage';
import { FaInstagram, FaSms, FaTimes } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import { GiFlameSpin } from 'react-icons/gi';
import {
  ACTIVE_SMS_TEMPLATE,
  BACKEND_URL,
  CANCELLED_SMS_TEMPLATE,
  CHECKING_SMS_TEMPLATE,
  INCORRECT_PASSWORD_SMS_TEMPLATE,
  LOGO,
  NOT_CONNECTED_SMS_TEMPLATE,
  RETENTION_SMS_1,
  RETENTION_SMS_2,
  RETENTION_SMS_3,
  TRUSTPILOT_SMS_TEMPLATE,
  TWOFAC_BACKUP_SMS_TEMPLATE,
  TWOFAC_CODE_SMS_TEMPLATE,
} from '../../config';
import axios from 'axios';
import { useClickOutside } from 'react-click-outside-hook';

export default function Retention() {
  const navigate = useNavigate();
  const [fetchingUser, setFetchingUser] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionName, setSectionName] = useState('active');
  const [sectionTotal, setSectionTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState();
  const [showChargebee, setShowChargebee] = useState(false);
  const [users, setUsers] = useState([]);
  const [refreshUsers, setRefreshUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ sectionName: '', value: '' });
  const [showCheckActiveUsersModal, setSetshowCheckActiveUsersModal] =
    useState(false);

  // verity user
  useEffect(() => {
    const getData = async () => {
      const authUserRes = await supabase.auth.getUser();
      if (authUserRes.error) return navigate('/login');
      const authUser = authUserRes?.data?.user;
      const getSuperUser = await supabase
        .from('users')
        .select()
        .eq('email', authUser.email);
      const superUser = getSuperUser?.data?.[0];
      if (!superUser || !superUser?.admin) return navigate('/login');
      setFetchingUser(false);
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      if (!sectionName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', sectionName.toLocaleLowerCase())
        .limit(3000);
      error && console.log(error);
      if (error) return;

      setUsers([]);
      setSectionTotal(0);
      setTimeout(() => {
        setUsers(data);
        setSectionTotal(data?.length);
        setLoading(false);
      }, 500);
    };
    fetch();
  }, [sectionName, refreshUsers]);

  // growthDifference
  useEffect(() => {
    if (users.length > 0) {
      users.forEach(async (user) => {
        const resData = await supabase
          .from('sessions')
          .select()
          .eq('username', user?.username);
        resData.error && console.log(resData.error);
        var d = resData?.data?.[0]?.data;
        // console.log(d);
        const growthDifference = calculateLast7DaysGrowth(d);
        // console.log(growthDifference);
        var v;
        if (growthDifference) {
          v = `
          <div class="${
            growthDifference > 0
              ? 'text-primary/90'
              : `${
                  parseInt(growthDifference) === 0
                    ? 'text-[#000]'
                    : 'text-[#E9C81B]'
                }`
          } font-black">${growthDifference}</div>
          `;
        } else {
          v = `
          <div class="text-[#000] font-black">N/A</div>
          `;
        }
        document.getElementById(
          `last_7_days_growth_${user?.username}`
        ).innerHTML = v;
      });
    }
  }, [users]);

  if (fetchingUser) {
    return <>Loading...</>;
  }

  return (
    <div className="font-MontserratRegular max-w-[1600px] mx-auto">
      {showCheckActiveUsersModal && (
        <div className="fixed top-0 left-0 w-full h-screen bg-transparent z-[99999]">
          <div
            className="absolute top-0 left-0 h-full w-full z-[2] bg-black/50 cursor-pointer"
            onClick={() => {
              setSetshowCheckActiveUsersModal(false);
            }}
          ></div>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 h-full min-w-[320px] z-[3] bg-white shadow-2xl rounded-2xl p-4">
            <CheckActiveUsers />
          </div>
        </div>
      )}

      {/* {showChargebee && (
        <Chargebee
          k={selectedUser?.id}
          user={selectedUser}
          setShowChargebee={setShowChargebee}
        />
      )} */}
      {showChargebee && (
        <SendSMSModal
          k={selectedUser?.id}
          user={selectedUser}
          setShowChargebee={setShowChargebee}
        />
      )}
      <Header
        setUsers={setUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setLoading={setLoading}
      />

      <div className="mt-[30px] h-[59px] w-fit rounded-[10px] bg-[#000000] text-[25px] font-bold font-MontserratBold text-white px-4 flex justify-center items-center relative">
        <div
          className="flex items-center justify-center capitalize cursor-pointer select-none"
          onClick={() => {
            setSetshowCheckActiveUsersModal(true);
          }}
        >
          Check Active users
        </div>
      </div>

      <div className="mt-[30px] h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] px-5 flex items-center gap-2">
        {statuses.map((status) => {
          return (
            <div
              key={`retention_page-${status}`}
              className="h-[59px] rounded-[10px] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex justify-center items-center relative"
            >
              <div
                className="flex items-center justify-center capitalize cursor-pointer select-none"
                onClick={() => {
                  setSectionName(status);
                }}
              >
                {status}
                {status === sectionName && (
                  <span className="px-[15px] h-[37px] rounded-[10px] text-center text-white bg-primary select-none ml-5">
                    {sectionTotal}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <img src={LOGO} alt="Loading" className="w-10 h-10 animate-spin" />
        </div>
      )}

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
              return 'Loading';
            }

            return (
              <tr
                key={`${user?.username}_${index + 1}_row`}
                className="rounded-[10px] bg-[#F8F8F8] h-[64px] w-full"
              >
                <td>
                  <img
                    src={user?.profile_pic_url}
                    alt=""
                    className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4"
                  />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative cursor-pointer max-w-[180px] break-words"
                      onClick={() => {
                        copy(user?.username, {
                          debug: true,
                          message: 'Press #{key} to copy',
                        });
                        setMessage({
                          sectionName: `username-${user?.username}`,
                          value: 'copied',
                        });
                        setTimeout(() => {
                          setMessage({ sectionName: '', value: '' });
                        }, 1000);
                      }}
                    >
                      @{user?.username}
                      {message.sectionName === `username-${user?.username}` && (
                        <div className="absolute font-bold text-black">
                          {message.value}
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.instagram.com/${user?.username}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaInstagram size={16} color="red" />
                    </a>
                  </div>
                </td>
                <td>
                  <div className="max-w-[200px] break-words">
                    <a href={`mailto:${user?.email}`} className="">
                      {user?.email}
                    </a>
                  </div>
                </td>
                <td>{user?.followers}</td>
                <td>{user?.following}</td>
                <td>
                  <div id={`last_7_days_growth_${user?.username}`}>N/A</div>
                </td>
                <td>
                  <div>
                    {user?.session_updated_at
                      ? countDays(user?.session_updated_at)
                      : 'N/A'}
                  </div>
                </td>
                <td>
                  <div
                    className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowChargebee(true);
                    }}
                  >
                    {/* <img
                      src="/icons/monetization.svg"
                      alt=""
                      className="w-[18px] h-[18px]"
                    /> */}
                    <FaSms fill="white" className="w-[18px] h-[18px]" />
                  </div>
                </td>
                <td>
                  <Link
                    to={`/dashboard/${user?.username}?uuid=${user?.user_id}`}
                    target="_blank"
                    className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black"
                  >
                    <img
                      src="/icons/user-settings.svg"
                      alt=""
                      className="w-[18px] h-[18px]"
                    />
                  </Link>
                </td>
                <td>
                  <div className="relative w-full">
                    <ChangeStatusModal
                      user={user}
                      refreshUsers={refreshUsers}
                      setRefreshUsers={setRefreshUsers}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const CheckActiveUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ sectionName: '', value: '' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'active'.toLocaleLowerCase())
        .limit(3000);
      error && console.log(error);
      if (error) return;

      setUsers(data);
      setLoading(false);

      var count = 0;
      while (count < data.length) {
        const user = data[count];
        const customer_id = user.customer_id;
        const baseUrl = BACKEND_URL;
        if (customer_id) {
          let subscription = await axios
            .post(`${baseUrl}/api/subscription_list`, {
              customer_id: customer_id,
            })
            .then((response) => response.data);
          const status =
            subscription?.status === 'active' &&
            subscription?.due_invoices_count > 0
              ? `Invoice Due ( ${subscription?.due_invoices_count} )`
              : subscription?.status;
          const el = document.getElementById(
            `chargebee_status_${user.username}`
          );
          if (el) {
            el.textContent = status;
          }
          // newList.push({ ...data, sub_status: status })
        }
        count++;
      }
    };
    fetch();
  }, []);

  const hangleSearch = async () => {
    document.getElementById(`cau_u_${searchTerm}`).style.backgroundColor =
      'yellow';
    document.getElementById(`cau_${searchTerm}`).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    setTimeout(() => {
      document.getElementById(`cau_u_${searchTerm}`).style.backgroundColor =
        'transparent';
    }, 2000);
  };

  const cancelUser = async (user) => {
    const baseUrl = BACKEND_URL;
    if (loading || !user) return;

    setLoading(true);
    var subscription_id = user?.subscription_id;
    if (!subscription_id && user?.customer_id) {
      const url = `${BACKEND_URL}/api/subscription_list`;
      let subscription = await axios
        .post(url, { customer_id: user?.customer_id })
        .then((response) => response.data);
      console.log(subscription);
      if (subscription?.id) {
        subscription_id = subscription?.id;
      }
    }
    if (!subscription_id) {
      alert('Subscription id not found!');
      setLoading(false);
      return;
    }

    console.log(user?.customer_id);
    console.log(subscription_id);

    // TODO cancel user in chargebee then supabase
    let cancelRes = await axios
      .post(`${baseUrl}/api/stripe/cancel_subscription`, {
        subscription_id: subscription_id,
      })
      .catch((err) => err);
    if (cancelRes.status !== 200) {
      console.log(cancelRes);
    }
    // cancel user in supabase
    const res = await supabase
      .from('users')
      .update({ status: 'cancelled' })
      .eq('email', user?.email)
      .eq('username', user?.username);
    if (res?.error) {
      console.log(res);
      alert('an error occurred!');
    }

    // remove the user from list.
    const userRow = document.getElementById(`cau_${user.username}`);
    if (userRow) {
      userRow.style.display = 'none';
    }

    setLoading(false);
  };

  return (
    <div className="relative h-full overflow-auto">
      <form
        className="fixed z-[999999] w-full bg-white px-4 top-3 left-0 min-h-[30px] border-b-3"
        onSubmit={(e) => {
          e.preventDefault();
          hangleSearch();
        }}
      >
        <div className="flex items-center px-2 py-4 bg-white border rounded-xl">
          @
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            type="search"
            className="w-full border-none outline-none"
            placeholder="Search by username"
          />
        </div>
      </form>

      <div className="min-h-[60px]"></div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999999999]">
        {loading && (
          <div className="flex items-center justify-center">
            <img src={LOGO} alt="Loading" className="w-10 h-10 animate-spin" />
          </div>
        )}
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
              return 'Loading';
            }

            return (
              <tr
                key={`${user?.username}_${index + 1}_row`}
                id={`cau_${user.username}`}
                className="rounded-[10px] bg-[#F8F8F8] h-[64px] w-full"
              >
                <td>
                  <img
                    src={user?.profile_pic_url}
                    alt=""
                    className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4"
                  />
                </td>
                <td>
                  <div
                    id={`cau_u_${user.username}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="relative cursor-pointer max-w-[180px] break-words"
                      onClick={() => {
                        copy(user?.username, {
                          debug: true,
                          message: 'Press #{key} to copy',
                        });
                        setMessage({
                          sectionName: `username-${user?.username}`,
                          value: 'copied',
                        });
                        setTimeout(() => {
                          setMessage({ sectionName: '', value: '' });
                        }, 1000);
                      }}
                    >
                      @{user?.username}
                      {message.sectionName === `username-${user?.username}` && (
                        <div className="absolute font-bold text-black">
                          {message.value}
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.instagram.com/${user?.username}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaInstagram size={16} color="red" />
                    </a>
                  </div>
                </td>
                <td>
                  <div className="max-w-[200px] break-words">
                    <a href={`mailto:${user?.email}`} className="">
                      {user?.email}
                    </a>
                  </div>
                </td>
                <td id={`chargebee_status_${user.username}`}></td>
                <td>
                  <div>
                    <FaTimes
                      color="red"
                      className="flex items-center justify-center w-full cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to set this user to cancel?'
                          )
                        ) {
                          cancelUser(user);
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const SendSMSModal = ({ k, user, setShowChargebee }) => {
  const [parentRef, isClickedOutside] = useClickOutside();
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState({ state: false, type: '' });
  const types = [
    {
      name: 'Incorrect Password SMS',
      template: INCORRECT_PASSWORD_SMS_TEMPLATE(),
    },
    {
      name: 'Twofactor Backup SMS',
      template: TWOFAC_BACKUP_SMS_TEMPLATE(),
    },
    {
      name: 'Twofactor Code SMS',
      template: TWOFAC_CODE_SMS_TEMPLATE(),
    },
    {
      name: 'Checking SMS',
      template: CHECKING_SMS_TEMPLATE(),
    },
    {
      name: 'Active SMS',
      template: ACTIVE_SMS_TEMPLATE(),
    },
    {
      name: 'Cancelled SMS',
      template: CANCELLED_SMS_TEMPLATE(),
    },
    {
      name: 'Trustpilot SMS',
      template: TRUSTPILOT_SMS_TEMPLATE(),
    },
    {
      name: 'Not Connected SMS',
      template: NOT_CONNECTED_SMS_TEMPLATE(user?.full_name),
    },
    {
      name: 'Retention #1 SMS',
      template: RETENTION_SMS_1(),
    },
    {
      name: 'Retention #2 SMS',
      template: RETENTION_SMS_2(),
    },
    {
      name: 'Retention #3 SMS',
      template: RETENTION_SMS_3(),
    },
  ];

  useEffect(() => {
    if (isClickedOutside) {
      setShowChargebee(false);
    }
  }, [isClickedOutside, setShowChargebee]);

  const handleSendSMS = async (template_name, template) => {
    if (processing.state) return;
    setProcessing({ state: true, type: template_name });
    const url = `${BACKEND_URL}/api/send_sms`;

    console.log(user?.phone?.toString()?.replace(/\s/g, ''));

    const data = {
      recipient: user?.phone?.toString()?.replace(/\s/g, ''),
      content: template,
    };
    const resp = await axios.post(url, data);

    setProcessing({ state: false, type: '' });
    setMessage(resp?.data?.message || 'something went wrong');
    setTimeout(() => {
      setMessage('');
    }, 3000);

    // console.log('resp');
    // console.log(resp);
  };

  return (
    <div
      key={k}
      className="fixed top-0 left-0 z-50 grid w-full h-screen place-items-center bg-black/70"
    >
      <div
        className="bg-white w-[300px] md:w-[500px] min-h-[400px] max-h-[80%] my-auto overflow-y-auto md:min-w-[400px] py-4 rounded-xl relative"
        ref={parentRef}
      >
        <div
          className={`${
            message ? 'h-[120px]' : 'h-0'
          } w-[250px] transition-all duration-300 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold bg-white rounded-lg shadow-2xl grid place-items-center`}
        >
          {message}
        </div>

        <div className="flex justify-between px-6 py-2 border-b">
          <div className="text-lg font-bold">Send sms</div>
          <FaTimes
            className="cursor-pointer"
            onClick={() => setShowChargebee(false)}
          />
        </div>
        <div className="flex flex-col gap-4 px-6 mt-4">
          <div className="flex flex-col justify-between gap-10 border-b md:flex-row">
            <div className="">USERNAME:</div>
            <div className="">{user?.username}</div>
          </div>
          <br />
          {types.map((type) => (
            <div className="flex flex-col justify-between gap-10 border-b pb-2 md:flex-row md:items-center">
              <div className="">{type.name}</div>
              <div
                className={`bg-primary rounded-full text-white flex items-center gap-2 w-[100px] px-4 py-2 ${
                  processing.state ? 'cursor-wait' : 'cursor-pointer'
                }`}
                onClick={() => handleSendSMS(type.name, type.template)}
              >
                {processing.state && processing.type === type.name ? (
                  <span className="animate-spin">
                    <GiFlameSpin />
                  </span>
                ) : (
                  <span>send</span>
                )}
                <LuSend />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
