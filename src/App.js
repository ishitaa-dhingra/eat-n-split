import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

//--------------------------->here we used onclick as props because only html elements have that property therefore we cant assign that in the <Button> tag in the app

export default function App() {
  const [Friends, setFriends] = useState(initialFriends);
  const [ShowAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist
          friends={Friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {ShowAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {ShowAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onsplit={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Friendlist({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isselected = selectedFriend && selectedFriend.id === friend.id;
  return (
    <li className={isselected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name}are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isselected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id} `,
      balance: 0,
    };
    onAddFriend(newFriend);

    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <label>📸Image URL </label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onsplit }) {
  const [bill, setbill] = useState("");
  const [paidbyuser, setpaidbyuser] = useState("");
  const paidbyfriend = bill ? bill - paidbyuser : "";
  const [whoispaying, setwhoispaying] = useState("user");

  function handlesubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyuser) return;
    onsplit(whoispaying === "user" ? paidbyfriend : -paidbyuser);
  }
  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>Split A Bill With {selectedFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />
      <label>🕴️Your expense</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={
          (e) =>
            setpaidbyuser(
              Number(e.target.value) > bill
                ? paidbyuser
                : Number(e.target.value)
            )
          //-------------------->in this value increases only until when the diff becomes 0
        }
      />

      <label>🧑‍🤝‍👩{selectedFriend.name}'s expense</label>
      <input type="text" value={paidbyfriend} />

      <label>🤑Who is playing the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setwhoispaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
