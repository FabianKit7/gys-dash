/* eslint-disable */
import React, { useEffect, useState } from "react";
import Modal from "react-modal"
import { supabase } from "../supabaseClient";
import { countDays, deleteAccount, getAccount, numFormatter, searchAccount } from "../helpers";
import avatarImg from "../images/avatar.svg"
import { ImBin2 } from "react-icons/im"
import { BsFillPlusSquareFill } from "react-icons/bs"
import ModalAdd from "../components/ModalAdd"

Modal.setAppElement('#root');

export default function Whitelist({ userId }) {
  const [whitelistAccounts, setWhitelistAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [selectAccountName, setSelectedAccountName] = useState("");
  const [searchAccounts, setSearchAccounts] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  // const insertWhitelist = async () => {
  //   setLoading(true);
  //   if (selectAccountName.length > 0) {
  //     const theAccount = await getAccount(selectAccountName);
  //     const { error } = await supabase.from("whitelist").insert({
  //       account: selectAccountName,
  //       followers: theAccount.data[0].follower_count,
  //       avatar: theAccount.data[0].profile_pic_url,
  //       user_id: userId,
  //     });
  //     console.log(
  //       "🚀 ~ file: Whitelist.jsx:33 ~ const{error}=awaitsupabase.from ~ error",
  //       error
  //     );

  //     setAccountName("");
  //     setSelectedAccountName("");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (accountName.length > 0) {
      setLoadingSpinner(true)
      const getData = async () => {
        const data = await searchAccount(accountName);
        setSearchAccounts(data.data[0].users);
        setLoadingSpinner(false)

      };
      getData();
    }
  }, [accountName]);

  useEffect(() => {
    const getWhitelistedAccounts = async () => {
      const { data, error } = await supabase
        .from("whitelist")
        .select()
        .eq("user_id", userId);
      console.log(
        "🚀 ~ file: Whitelist.jsx:55 ~ getWhitelistedAccounts ~ error",
        error
      );
      setWhitelistAccounts(data);
    };

    getWhitelistedAccounts();
  }, [userId, modalIsOpen]);

  const subtitle = "Add users you wish to continue following that were followed by us. We will never unfollow anyone you manually followed."
  const extraSubtitle = "If you wish to continue following a user that we automatically followed for you, add them here and we won’t unfollow them. Remember, we will never unfollow anyone you manually followed before or after using our service - this only applies to users we followed for you."

  return (
    <div>
      <ModalAdd
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        title="Add to a Whitelist"
        subtitle={subtitle}
        extraSubtitle={extraSubtitle}
        setSelectedAccountName={setSelectedAccountName}
        SelectedAccountName={selectAccountName}
      />

      <div className="shadow-targeting my-12">
        {/* nav */}
        <div className="flex justify-between px-8 pt-8">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[32px]">Whitelists</h3>
            <div className="bg-gray20 rounded w-8 h-8 flex justify-center items-center">
              <h2 className="text-white">{whitelistAccounts.length}</h2>
            </div>
          </div>
          <div className="rounded-[4px] bg-[#D9D9D9] p-3 relative w-10 h-10 cursor-pointer" onClick={() => { setIsOpen(!modalIsOpen) }}>
            <BsFillPlusSquareFill className="absolute text-[#8C8C8C] font-semibold" />
          </div>
        </div>
        {/* body */}
        <div className="grid p-5 md:p-8 gap-4">
          {whitelistAccounts.map((item) => {
            // console.log(item);
            return (
              <>
                <div className="rounded-[4px] border-[#E0E0E0] border border-solid flex justify-between p-3">
                  <div className="flex gap-3">
                    <img src={item.avatar || avatarImg} className="h-11 w-11 rounded-full self-center" alt={item.account} crossOrigin="Anonymous" />
                    <div className="flex flex-col">
                      <h1 className="font-bold">@{item.account}</h1>
                      <p>{numFormatter(item.followers)} Followers</p>
                      <p className="md:hidden">{countDays(item.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="hidden md:flex">{countDays(item.created_at)}</p>
                    <div className="rounded-[4px] bg-[#D9D9D9] p-2 md:p-3 relative w-8 h-8 md:w-10 md:h-10 md:mr-5 cursor-pointer">
                      <ImBin2 className="absolute text-[#8C8C8C] font-semibold"
                        onClick={() => deleteAccount(item.id, item.user_id, item.account)}
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>


      {/* <div className="mt-5 w-[500px]">

        <div className="d-flex  border p-3 rounded-4 ">
          <div className="d-flex align-items-center gap-3">
            <h3>Whitelist</h3>
            <h4 className="bg-dark rounded ">
              <Badge bg="Light">{whitelistAccounts.length}</Badge>
            </h4>
          </div>
        </div>

        <div className="mt-5 w-[500px]">
          <Row>
            <Col xs={12} md={8}>
              <Table striped="columns">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Followers</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelistAccounts.map((item) => {
                    return (
                      <tr>
                        <td>
                          <img
                            className="rounded-circle"
                            src={item.avatar}
                            alt={item.account}
                            width={45}
                            height={40}
                            crossOrigin="Anonymous"
                          />{" "}
                          @{item.account}
                        </td>
                        <td>{numFormatter(item.followers)}</td>
                        <td>{countDays(item.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col>
              <div className="d-flex flex-column">
                <h3>Whitelist Accounts</h3>
                <p>The Whitelist</p>

                <InputGroup className="mb-3 mt-3">
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Typeahead
                    onInputChange={(text) => setAccountName(text)}
                    id="pk"
                    onChange={(selected) => {
                      setSelectedAccountName(selected[0]?.username);
                    }}
                    labelKey="username"
                    options={searchAccounts}
                    />{" "}
                <div className="ps-2" >
                    {loadingSpinner && (<Spinner animation="border" /> )}
                </div>
                </InputGroup>
                <Button
                  variant="dark"
                  className="mt-5"
                  onClick={() => insertWhitelist()}
                >
                  {loading ? "Loading..." : "Whitelist Account"}
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div> */}
    </div>
  );
}
