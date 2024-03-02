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
    </div>
  );
}
