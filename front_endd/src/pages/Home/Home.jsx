import React, { useEffect, useState } from 'react'
import Feed from '../../components/Feed/Feed'
import Carousel from '../../components/CarouselNews/Carousel';
import axios from 'axios';
import NewBox from '../../components/NewBox/NewBox';
import { useParams } from 'react-router-dom';
// import MainFeed from '../../components/MainFeed/MainFeed';

const Home = () => {
  // const [currentIndex, setCurrentIndex] = useState(1);
  // const [page, setPage] = useState(1);
	// const [news, setNews] = useState([]);
  
  
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState(false);

  const url = `http://localhost:3000/api/news/getNewsHome`;
  
  // const fetchNews = async () => {
  //   try {
  //     await axios.get(`${url}?page=${page}`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setNews((preNews) => [...preNews, ...response.data.a]);
  //     })
  //   } catch (error) {
  //     setError(error)
  //   }
  // }
  
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.get(`${url}?page=${page}`)
      .then((response) => {
        // console.log(response.data.a);
        console.log(response.data);
        
        setNews((prevNews) => [...prevNews, ...response.data.a])
        // console.log(news.length);
        
      })
    } catch (error) {
      setError(error)
    } 
  }
  useEffect(() => {
    fetchNews();
  },[page]);
  const handleScroll = () => {
      // console.log(`innerH: ${window.innerHeight},scrollTop: ${window.scrollY} ,offsetH: ${document.body.scrollHeight}`);
      
      if ((window.innerHeight + window.scrollY + 1) >= document.body.scrollHeight) {
        console.log('Scrolled to the bottom!');
        // console.log(news.length);
        
        setPage((prevPage) => prevPage +1);
      }
      // fetchNews();
      // console.log("ádfas");
      
    }
    useEffect(() => {
      // console.log(news.length);
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [loading])

  return (
    // <div className='grid gap-3 justify-center mx-auto bg-zinc-800'>
    <div className='w-[1236px] justify-center mx-auto bg-zinc-800 pb-4 mt-2'>
	    <Feed newsData={news} />
      {loading && <p>Loading ...</p>}
      {error && <p>error: {error.message}</p>}
    </div>
    
  )
}

export default Home