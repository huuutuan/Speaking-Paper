import React from 'react'
import './TopContainer.css'
import SearchBox from '../SearchBox/SearchBox'
import { assets } from '../../assets/assets'

// import Logo from './assets/logo.png'

const TopContainer = () => {
  
  return (
    <div className='top-container flex flex-row items-center'>
          <img src={assets.logo} alt="" className='logo w-40 h-20'/>
          <div className='search basis-3/6 ml-10'>
            <SearchBox />
          </div>
          <div className='right-top basis-1/6'>
            <div className='weather'>a</div>
            <div className='setting'></div>
          </div>
    </div>
  )
}

export default TopContainer