import { text } from '@fortawesome/fontawesome-svg-core';
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStopwatch, faHeadphonesSimple, faThumbsUp, faThumbsDown, faShareFromSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import TtsApi from '../../components/TTSApi/TtsApi';


const News = () => {
	const {topic, id} = useParams();
	
	console.log(id);
	console.log(topic);
	
	
	const [news, setNews] = useState()
	// const id1 = "674fb01d944d5e48404c80fa";
	const link = `http://localhost:3000/api/news/getNews?id=${id}&topic=${topic}`;	
	const fetchNewsById = async () => {
		try {
			const response = await fetch(link);
			const data = await response.json();
			console.log(typeof(data.new.content[0]));
			console.log(data.new.content[0],"                 " , data.new.content[1]);
			console.log(data.new.image);
			console.log(data.new.content.length);
			console.log(data.new.description);
			console.log(data.new.summary);
			
			
			console.log(readingTime(data.new.content));
			setNews(data.new);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		fetchNewsById();
		
	}
	, [])

	const readingTime = (content) => {
		const wordsPerMinute = 200;
		var readTime = 0;
		var minutes = 0;
		for (let x in content) {
			const noOfWords = x.split(/\s/g).length;
			minutes = minutes + noOfWords / wordsPerMinute;
		}
		readTime = Math.ceil(minutes);
		return `${readTime} phút đọc`;
	}

 	return (
   	<div className='grid grid-cols-7 gap-4'>
		<div className='left col-span-2 text-white place-items-center'>
		
			<div className='mt-[152px] top-[120px] items-center justify-center sticky w-fit z-[2] flex flex-col'>
				<div>	
					<ul className='opacity-100 cursor-pointer flex flex-col list-none mt-4 -mr-[2] -ml-[2] -mb-[2] p-[2]'>
						<li className=''>
							{/* <div className='mx-0 my-2 flex items-center '>
								<button className=' flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
								 bg-zinc-700 relative before:absolute before:content-custom-text0 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'>
									<FontAwesomeIcon  className='w-5 h-5' icon={faHeadphonesSimple} />
								</button>
								
							</div> */}
							<TtsApi text={news && news.summary}/>
						</li>
						<li className=''>
							<div className='mx-0 my-2 flex items-center '>
								<button className=' flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
								 bg-zinc-700 relative before:absolute before:content-custom-text1 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'>
									<FontAwesomeIcon  className='w-5 h-5' icon={faThumbsUp} />
								</button>
								{/* <div className='ml-4 rounded-sm bg-zinc-700 px-2 py-[2px]'>
									<span>Nghe nội dung này	</span>
								</div> */}
							</div>
						</li>
						<li className=''>
							<div className='mx-0 my-2 flex items-center '>
								<button className=' flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
								 bg-zinc-700 relative before:absolute before:content-custom-text2 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'>
									<FontAwesomeIcon  className='w-5 h-5' icon={faThumbsDown} />
								</button>
								{/* <div className='ml-4 rounded-sm bg-zinc-700 px-2 py-[2px]'>
									<span>Nghe nội dung này	</span>
								</div> */}
							</div>
						</li>
						<li className=''>
							<div className='mx-0 my-2 flex items-center '>
								<button className=' flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
								 bg-zinc-700 relative before:absolute before:content-custom-text3 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'>
									<FontAwesomeIcon  className='w-5 h-5' icon={faShareFromSquare} />
								</button>
								{/* <div className='ml-4 rounded-sm bg-zinc-700 px-2 py-[2px]'>
									<span>Nghe nội dung này	</span>
								</div> */}
							</div>
						</li>
						<li className=''>
							<div className='mx-0 my-2 flex items-center '>
								<button className=' flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
								 bg-zinc-700 relative before:absolute before:content-custom-text4 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'>
									<FontAwesomeIcon  className='w-5 h-5' icon={faEllipsisVertical} />
								</button>
								{/* <div className='ml-4 rounded-sm bg-zinc-700 px-2 py-[2px]'>
									<span>Nghe nội dung này	</span>
								</div> */}
							</div>
						</li>
						
					</ul>
				</div>
			</div>
		</div>
		<div className='midle text-white col-span-3'>
			{news && <h1 className='text-4xl font-semibold pt-7 pb-4 text-start'> {news.title} </h1>}
			{news && <div className='text-base font-normal mb-7 text-slate-400 '> {news.date} <span> <FontAwesomeIcon className = "ml-3" icon={faStopwatch} /> {readingTime(news.content)}</span> </div>}
			{/* {news && <div> {news.image} </div>} */}
			<br className='h-1 bg-slate-50'/>
			{news && <div> {news.topic} </div>} 
			{news && <div className='mb-3 description'> {news.description} </div>}
			{news && <div className='mb-3'> <img src={news.image} alt="" /> </div>}
			{/* <div className='content text-start text-lg '>
				{
					news.content.map((content, index) => (
						<p className='mb-4' key={index}>{content}</p>
						
					))
				}	
			</div> */}
			{news && <div className='content text-start text-lg '> {
				news.content.map((content, index) => (
					<p className='mb-4' key={index}>{content}</p> ))
				} </div>}
			{/* {news && <div className='content text-start text-lg '> {news.content} </div>} */}
			{news && <div className='text-end'>  {news.author} </div>}
			{news && <div className='text-start'>  {news.summary} </div>}
		</div>
		<div className='right col-span-2'></div>
		
    	</div>
  )
}

export default News
// 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