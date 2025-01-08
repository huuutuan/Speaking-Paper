import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStopwatch, faHeadphonesSimple, faThumbsUp, faThumbsDown, faShareFromSquare, faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons'

const TtsApi = ({text}) => {
	const [urlAudio, setUrlAudio] = useState("")
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [isDisplay, setIsDisplay] = useState(false)
	const url = `https://api.voicerss.org/?key=9bf871dbecb647428b87811e40dd46da&hl=vi-vn&c=MP3&src=${text}&r=1`
	const fetchMp3File = async () =>{
		// setIsOpen(!isOpen)
		setLoading(true)
		try {

			const response = await axios.get(url, {
				responseType: "blob"
			})
			console.log(isOpen);
			
			console.log(URL.createObjectURL(response.data));
			console.log(urlAudio);
			setUrlAudio(URL.createObjectURL(response.data));
		} catch(error) {
			console.log(error);
			
		}finally {
			setLoading(false);
		}
	}
	const handleButtonHeadphone = () => {
		setIsOpen((prevIsOpen) => !prevIsOpen);
		if(urlAudio) {
			setIsDisplay((prevIsDisPlay) => !prevIsDisPlay);
		} else {
			fetchMp3File();
		}
	}
	// useEffect(() => {
	// 	fetchMp3File();
	// }, [])
  return (
    <div className='text-white flex'>
	{/* <ReactAudioPlayer src = {urlAudio} controls  /> */}
	<button className='flex w-10 h-10 shadow-custom items-center justify-center rounded-xl hover:rounded-md hover:bg-zinc-600 hover:duration-300
		 bg-zinc-700 relative before:absolute before:content-custom-text1 before:whitespace-nowrap before:rounded before:top-[0px] before:px-[10px] before:py-[6px] before:left-10 before:bg-zinc-700 before:shadow-custom before:transform before:translate-x-1 before:duration-200 before:opacity-0 hover:before:opacity-100 hover:before:left-12 before:mt-[2px] before:pointer-events-none'
		 onClick={handleButtonHeadphone}
		 disabled={loading}>
		{isOpen ? <FontAwesomeIcon className='w-5 h-5' icon={faXmark} /> :<FontAwesomeIcon className='w-5 h-5' icon={faHeadphonesSimple}/>}
		{/* <FontAwesomeIcon  className='w-5 h-5' icon={faHeadphonesSimple} /> */}
		{/* {loading ? 'loading...': 'load Audio'} */}
	</button>
	{urlAudio && <audio className={`absolute h-10 w-60 left-10 bg-slate-950 ${isDisplay ? 'opacity-0' : 'opacity-100'}`} controls src={urlAudio}></audio>}
    </div>
  )
}

export default TtsApi