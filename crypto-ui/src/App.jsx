import React, { useState } from 'react'
import { title } from '../ui/title';
import { subtitle } from '../ui/subtitle';
import GraphComponent from './components/Graph';
import Search from './Search';

export default function App() {
  

  return (
    <div className='flex flex-col items-center  h-[100vh] w-[100vw] py-4 gap-6 '>
      <h1 className={`${title()} m-4`}>
        Enter Your Sender Address Here:
      </h1>
      <Search />
    </div>
  )
}
