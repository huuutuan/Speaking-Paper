import React from 'react'
import TopicNew from '../../../components/TopicNews/TopicNew'
import useFetchNews from '../../../hooks/useFetchNews'
import { useState, useEffect } from 'react'
import axios from 'axios'
import TopicFeed1 from '../../../components/TopicFeed1/TopicFeed1'

const TopicFeed = ({topic}) => {
  // const url = "http://localhost:3000/api/news/getMiniNews"
  // const {newsData, error, loading} = useFetchNews(url);

  // console.log(newsData , error, loading);
  // const [news, setNews] = useState([]);
  // const [page, setPage] = useState(1);
  // const url = `http://localhost:3000/api/news/getNewsTopic?topic=${topic}`;
  // const fetchNews = async () => {
  //   try {
  //     await axios.get(url)
  //     .then((response) => {
  //       console.log(response.data);
  //       setNews(response.data.a)
  //     })
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
  // useEffect(() => {
  //   fetchNews();
  // },[]);

  

  return (
    <div className='flex flex-col items-center justify-center mx-auto bg-zinc-800'>
      {/* {
        news.map((newss, index) => <TopicNew newss={newss} />)
      } */}
	    {/* <TopicNew newss={news[1]}/> */}
      <TopicFeed1 topic={topic}/>

    </div>
  )
}

export default TopicFeed