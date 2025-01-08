import React, { useEffect } from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const Carousel = ({images, autoplayInterval}) => {
	const [currentIndex, setCurrentIndex] = useState(1);
	const handlePrevClivk = () => {
		console.log(currentIndex);
		
	  	setCurrentIndex((currentIndex-1 + images.length) % images.length)
	};
	const handleNextClick = () => {
		// console.log(currentIndex);
		if(isNaN(currentIndex)){
			// console.log("NAN");
			
			setCurrentIndex(2);
		}
		setCurrentIndex((currentIndex+1) % images.length);

	};
	
	useEffect(() => {
		
		const autoplayTimer = setInterval(() =>{
			// console.log(currentIndex);
			handleNextClick();
			// console.log(currentIndex);

			// setCurrentIndex((currentIndex+1) % images.length);
		}, autoplayInterval);
		return () => clearInterval(autoplayTimer);
	}, [currentIndex]);

	const handleDotClick = (index) => {
		console.log(currentIndex);
		setCurrentIndex(index);
	}
	const handleClickImage = (index) => {
		console.log(index);
	}
	
    
      
    
      return (
	<div className='relative w-[612px] h-[304px] '>
	  <div className='carousel overflow-hidden h-full'>
	      <div className='carousel-inner flex transition-transform duration-500 h-full w-full' style={{transform: `translateX(-${currentIndex * 100}%)` }}>
		{images.map((image, index) => (
		  <div key={index} className='carousel-item flex-shrink-0 w-full h-full relative' onClick={() => handleClickImage(image._id)} >
			<Link to={`/news/khampha/${image._id}`} className='hover:shadow-custom hover:opacity-80' target="_blank" rel="noreferrer">
			
		    	<img src={image.image} alt={image.title} className='w-full h-full rounded-xl'/>
		    	<div className='z-10 text-white absolute bottom-5 flex flex-col mx-4'>
			    	<div className=''>
					<div className='attributiion'>
						
					</div>
					<p className='text-2xl  font-medium	'>{image.title}</p>
				</div>
				<div className='action-row flex flex-row  w-20 '>
		    <div className='mr-2'>
			<button className='hover:bg-zinc-700 w-7 h-7 text-zinc-300'>
				<FontAwesomeIcon icon={faThumbsUp}/>	
			</button>
		    </div>
		    <div className='pt-[1px]'>
			<button className='hover:bg-zinc-800 w-7 h-7 text-zinc-300'>
				<FontAwesomeIcon icon={faThumbsDown}/>	
			</button>
		    </div>
		</div>
		</div>
		</Link>
		</div>
		))}
	      </div>
	  </div>
	  <button
	    className='absolute left-0 top-1/2 -translate-y-1/2 bg-gray-300 hover:bg-slate-400 hover:opacity-80 transition-colors duration-300 rounded-md opacity-40'
	    onClick={handlePrevClivk}
	  >
	    <svg
	      xmlns="http://www.w3.org/2000/svg"
	      className="h-12 w-6"
	      fill="none"
	      viewBox="0 0 24 24"
	      stroke="currentColor"
	    >
	      <path
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		d="M15 19l-7-7 7-7"
	      />
	    </svg>
	  </button>
	  <button
	    className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-300 hover:bg-gray-400  transition-colors duration-300 rounded-md opacity-40"
	    onClick={handleNextClick}
	  >
	    <svg
	      xmlns="http://www.w3.org/2000/svg"
	      className="h-12 w-6"
	      fill="none"
	      viewBox="0 0 24 24"
	      stroke="currentColor"
	    >
	      <path
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		d="M9 5l7 7-7 7"
	      />
	    </svg>
	  </button>
	  <div className='carosel-dots absolute bottom-2 items-center left-1/2 flex justify-center mt-4 -translate-x-1/2'>
		{images.map((_, index)=>(
			<button
				key={index}
				className={`carousel-dot ml-1 w-2 h-2 rounded-full ${index === currentIndex ? "bg-gray-800 w-5 " : "bg-gray-400"}`}
				onClick={() => handleDotClick(index)}
			>
			</button>
		))}

	  </div>
	</div>
      )
}
export default Carousel