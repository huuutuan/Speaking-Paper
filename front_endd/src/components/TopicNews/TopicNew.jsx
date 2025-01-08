import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
// import useFetchNews from '../../hooks/useFetchNews'

const TopicNew = ( {newss, topic} ) => {
  return (
	
	<Link to={`/news/${topic}/${newss._id}`} className='hover:cursor-pointer hover:shadow-custom hover:opacity-80'>
		<div className='w-[630px] h-48 flex flex-row border-solid border-[1px] rounded-xl border-neutral-500 my-2 hover:bg-zinc-700'>
			<div className='text-white flex flex-col px-4 w-[400px] '>
				<div className=''>
					<div className='attributiion'>
							
					</div>

					<a href="" className='text-xl font-normal overflow-hidden '>{newss.title}</a>
				</div>

				<div className='action-row flex flex-row relative -bottom-24 w-20 '>
				<div className='mr-2'>
					<button className='hover:bg-zinc-800 w-7 h-7'>
						<FontAwesomeIcon icon={faThumbsUp}/>	
					</button>
				</div>
				<div className='pt-[1px]'>
					<button className='hover:bg-zinc-800 w-7 h-7'>
						<FontAwesomeIcon icon={faThumbsDown}/>	
					</button>
				</div>
				</div>
			</div>

			<img src={newss.image} alt={newss.title} className=' h-5/6 w-[216px] my-auto right-3 rounded-lg relative'/>

		</div>
    	</Link>
  )
}

export default TopicNew