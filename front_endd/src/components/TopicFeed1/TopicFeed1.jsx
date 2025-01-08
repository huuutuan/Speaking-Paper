import React from 'react'

import { useState, useEffect } from 'react'
import axios from 'axios'
import TopicNew from '../TopicNews/TopicNew'

const TopicFeed1 = ({topic}) => {
  // const url = "http://localhost:3000/api/news/getMiniNews"
  // const {newsData, error, loading} = useFetchNews(url);

  // console.log(newsData , error, loading);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState(false);
  const url = `http://localhost:3000/api/news/getNewsTopic?topic=${topic}&${page}`;
  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      await axios.get(url)
      .then((response) => {
        console.log(response.data);
        setNews((prevNews) => [...prevNews, ...response.data.a])
      })  
    } catch (error) {
      setError(error)
    }
  }
  useEffect(() => {
    fetchNews();
  },[page]);
  
  const handleScroll = () => {
    if((window.innerHeight + window.scrollY + 1) >= document.body.scrollHeight) {
      console.log('scroll to bottom');
      setPage((prevPage) => prevPage +1);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); 
  }, [loading])

  

  return (
    <div className='flex flex-col items-center justify-center mx-auto bg-zinc-800'>
      {/* {
        news.map((newss, index) => <TopicNew newss={newss} />)
      } */}
      {
	      news.map((newss, index) => <TopicNew newss={newss} topic={topic} />)
      }
      {loading && <p>Loading ..</p>}
      {error && <p>error: {error.message}</p>}
	    {/* <TopicNew newss={news[1]}/> */}
    </div>
  )
}

export default TopicFeed1;