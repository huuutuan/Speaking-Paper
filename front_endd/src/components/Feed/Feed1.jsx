import React from 'react'
import Carousel from '../CarouselNews/Carousel'
import NewBox from '../NewBox/NewBox';
import NewBox1 from '../NewBox/NewBox1';


const Feed2 = ({newsData}) => {
//     const carouselNews = newsData.slice(0,15);
    const oneNews = newsData.slice(0,2)
    const sixNews = newsData.slice(2,8);
    const twoNews = newsData.slice(8,10);
    const fourNews = newsData.slice(10,14);
  // https://i1-vnexpress.vnecdn.net/2024/12/03/98ef06da-9521-4721-80be-dc69f3-6843-6587-1733241025.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=0OKChHq0j5JYbkeKHQ8X2w
  // https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1vfmL1.img?w=375&h=195&q=60&m=6&f=jpg&x=1152&y=465&u=t
  return (
    <div className='feed grid grid-cols-4 gap-3 auto-rows-[146px] w-full' >
      <div className='row-span-2 col-span-2 items-start rounded-sm' >
        <Carousel images={carouselNews} autoplayInterval={3000} />
      </div>
      {
	<NewBox1 newss={oneNews} />
      }
      {
        sixNews.map((newss, index) => <NewBox newss={newss} key={index} />)
      }
      {
        twoNews.map((newss, index) => <NewBox1 newss={newss} key={index}/>)
      }
      {
        fourNews.map((newss, index) => <NewBox newss={newss} key={index} />)
        
      }
      
      {/* <div className='row-span-2'>
        <img className='rounded-lg w-full h-40' src="https://i1-vnexpress.vnecdn.net/2024/12/03/98ef06da-9521-4721-80be-dc69f3-6843-6587-1733241025.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=0OKChHq0j5JYbkeKHQ8X2w" alt="" />
      </div>
      <div className='row-span-2'>
        <img  className='w-full rounded-lg h-40' src="https://th.bing.com/th?id=ORMS.8a35a5a948a4d1c0c775ef58b8fdc2bf&pid=Wdp&w=612&h=304&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div>
      <div  className='row-span-2'>
        <img  className='w-full rounded-lg h-40' src="https://th.bing.com/th?id=ORMS.90c120b761085c93cbd155fec4e08777&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div>
      <div className='row-span-2'>
        <img className = 'w-full rounded-lg h-40' src="https://th.bing.com/th?id=ORMS.9a20ee9cfab5f5be58da2c84e6213475&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div>
      <div className='row-span-2'>
        <img  className='w-full rounded-lg h-40' src="https://th.bing.com/th?id=ORMS.72f340228e5e89576f93b909c60056d3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div>
      <div className='row-span-2'>
        <img className='w-full rounded-lg h-40'  src="https://th.bing.com/th?id=ORMS.d1e94ba2d924ca18e2b1807126b06019&pid=Wdp&w=612&h=304&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" /> 
      </div>
      <div className='row-span-2 col-span-2'>
        <img className='h-full w-full rounded-lg -z-10' src="https://th.bing.com/th?id=ORMS.3418f3fa35a3125d7cd8baea3e9e96c6&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div>
      <div className='row-span-2 col-span-2'>
        <img className='w-full h-full rounded-lg -z-10' src="https://th.bing.com/th?id=ORMS.95b72a4a99aa3d45780b28de47df29a4&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.25&p=0" alt="" />
      </div> */}
    </div>
  )
}

export default Feed2