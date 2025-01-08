import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
const NewBox = ( {newss} ) => {
  
  return (
    <div className='row-span-2'>
	<Link to={`/news/khampha/${newss._id}`} target="_blank" rel="noreferrer">
		  <div className='w-[300px] h-[304px] rounded-xl flex flex-col bg-zinc-700 relative hover:shadow-custom hover:opacity-80' >
		    
		    	<img src={newss.image} alt={newss.title} className='w-full h-[158px] rounded-lg'/>
		    	<div className='text-white flex flex-col px-4 mt-4'>
			      <div className=''>
					    <div className='attributiion'>
					
					    </div>
					    <p className='text-xl font-normal overflow-hidden '>{newss.title}</p>
				    </div>
				    <div className='action-row flex flex-row  w-20 absolute bottom-4'>
		    <div className='mr-2'>
			<button className='hover:bg-zinc-800 w-7 h-7 text-zinc-300'>
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
		  </div>
	</Link>
    </div>
  )
}

export default NewBox