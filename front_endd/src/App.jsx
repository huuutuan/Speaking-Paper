import React from 'react'
import Navbar from './components/Navbar/Navbar'
import TopContainer from './components/TopContainer/TopContainer'
import Widget from './components/Widget/Widget'
import Feed from './components/Feed/Feed'
import SearchBox from './components/SearchBox/SearchBox'
import { Route, Routes } from 'react-router-dom'
import Feed1 from './pages/feed1/Feed1'
import Home from './pages/Home/Home'
import TopicFeed from './pages/chanel/topic/TopicFeed'
import News from './pages/news/News'
import ThoiSu from './pages/chanel/topic/ThoiSu'
import GocNhin from './pages/chanel/topic/GocNhin'
import TinTheGioi from './pages/chanel/topic/TinTheGioi'
import GiaiTri from './pages/chanel/topic/GiaiTri'
import DungBolo from './pages/chanel/topic/DungBolo'
import TtsApi from './components/TTSApi/TtsApi'


const App = () => {
  
  

  return (
    <div className='app'>
      <div className='header flex-col bg-zinc-800 sticky top-0 z-50 w-full border-b-2 border-solid border-b-cyan-50 border-opacity-10 '>
        <TopContainer />
        <Navbar />
      </div>
      
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/feed1' element={<Feed1/>}></Route>
        <Route path='/news' elememt={<News />}>
          <Route path=':topic'>
            <Route path=':id' element={<News />}> </Route>
          </Route>
        </Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/thoi_sus' element={<ThoiSu />}></Route>
        <Route path='/goc_nhins' element={<GocNhin />}></Route>
        <Route path='/tin_the_giois' element={<TinTheGioi />}></Route>
        <Route path='/giai_tris' element={<GiaiTri />}></Route>
        <Route path='/duong_bo_los' element={<DungBolo />}></Route>
        <Route path='/tts' element={<TtsApi />}></Route>
        {/* <Route path=''></Route> */}

      </Routes>
    </div>
  )
}

export default App