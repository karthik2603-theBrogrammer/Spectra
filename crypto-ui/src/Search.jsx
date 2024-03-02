import React, { useState } from "react";
import { title } from "../ui/title";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";

export default function Search() {
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setLoading(true);
    if (search === null) {
      setLoading(false);
      return;
    }
    navigate(`/graph/${search}`);
  };
  return (
    <div className="flex flex-col items-center py-4 gap-6 ">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <Input
          type="text"
          color="secondary"
          label="Address 0x12"
          placeholder="Enter Your Sender Address:"
          className="w-[300px]"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          color="secondary"
          variant="shadow"
          isLoading={loading}
          onClick={() => handleSubmit()}
        >
          Submit!
        </Button>
      </div>
      <div className="flex flex-col gap-3 items-center justify-center text-black my-6 px-5 text-center">
        <h1 className="text-xl md:text-3xl text-gray-500 ">
          Steps To Catch Your First Hacker:
        </h1>
        <hr />
        <hr />

        <div className="text-left flex flex-col gap-3 text-gray-400 my-7">
          <div className="justify-center">
            <span className="text-2xl text-gray-500">#1</span> Get access to a Wallet ID you want to start exploring 
          </div>
          <hr />
          <div>
            <span className="text-2xl text-gray-500">#2</span> Enter the Wallet ID in the search bar above
          </div>
          <hr />
          <div>
            <span className="text-2xl text-gray-500">#3</span> The wallets that have any transactions with the entered wallet will show up as a tree
          </div>
          <hr />

          <div>
            <span className="text-2xl text-gray-500">#4</span>  To explore any other node, simple double click the required node
          </div>
          <hr />

          <div>
            <span className="text-2xl text-gray-500">#5</span> If any tranactions exist, it will be summarized into the tree and will be shown
          </div>
          <hr />

          <div>
            <span className="text-2xl text-gray-500">#6</span> Click the node to find more info about the wallet        </div>
        </div>
        <hr />
      </div>
      <div className="flex flex-col items-center justify-center w-fit px-2 my-4 gap-y-3">
        <p className="text-center"> 🥳 That's it! Explore the nodes as you wish.</p>
        <div className="flex flex-col md:flex-row ">
          <code className=" text-center">To see the tree for any wallet</code>
          <code className=" text-center">/graph/[wallet-id]</code>
        </div>
      </div>
    </div>
  );
}
