import React, { useState } from "react";
import { title } from "../ui/title";
import { subtitle } from "../ui/subtitle";
import GraphComponent from "./components/Graph";
import Search from "./Search";

export default function App() {
  return (
    <div className="h-[100vh] w-[100vw] bg-black bg-grid-white/[0.2] relative flex flex-col items-center justify-center">
      <div
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,1) 100%)",
        }}
        className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      ></div>
      <div className="w-full h-full flex flex-col justify-center text-center md:justify-start items-center">
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Enter Your Sender Address Here:
      </p>
      <Search />
      </div>
    </div>
    // <div className='flex flex-col items-center  h-[100vh] w-[100vw] py-4 gap-6 '>
    // <h1 className={`${title()} m-4`}>
    //   Enter Your Sender Address Here:
    // </h1>
    // <Search />
    // </div>
  );
}
