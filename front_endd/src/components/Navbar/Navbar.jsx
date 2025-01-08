import React from 'react'
import './Navbar.css'
import {FontAwesomeIcon  }from '@fortawesome/react-fontawesome'
import {faGripLinesVertical, faBars} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <div className='navbar flex items-center text-white gap-6 ml-28'>
        <div className='size-12 justify-center flex items-center hover:bg-slate-500'>
          <FontAwesomeIcon icon= {faBars} className='' size='lg' />
        </div>
        <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/home"}> Khám Phá</Link>
        
        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Khám phá</li></a> */}

        <FontAwesomeIcon icon={faGripLinesVertical} />
      <ul className='navbar-menu text-white flex gap-8 h-12 items-center text-center text-base font-normal '>
        <li>
          <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/thoi_sus"}>Thời Sự</Link>
        </li>
        <li>
          <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/goc_nhins"}>Góc nhìn</Link>
        </li>
        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Tin tức</li></a> */}
        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Góc nhìn</li></a> */}
        <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/tin_the_giois"}>Tin Thế Giới</Link>

        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Tin thế giới</li></a> */}
        <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/giai_tris"}>Giải Trí</Link>

        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Giải trí</li></a> */}
        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Khám phá</li></a> */}
        <Link className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full' to={"/duong_bo_los"}>Đừng bỏ lỡ</Link>

        {/* <a href="#"> <li className='relative after:absolute after:bg-stone-100 after:h-1 after:w-0 after:left-0 after:-bottom-2 after:rounded-xl after:duration-300 hover:after:w-full'>Đừng bỏ lỡ</li></a> */}
      </ul>
    </div>
  )
}

export default Navbar