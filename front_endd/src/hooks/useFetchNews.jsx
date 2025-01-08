import { useEffect, useState } from "react";

//uselocalstorage
//useCounter
//useSessionStroang
//useId
//useOutsideClick

function useFetchNews(url, option = {}) {

	async function fetchData() {
		setLoading(true);
		try {	
			const response = await fetch(url, {...option});
			if(!response.ok) throw new Error(response.statusText);
			const result = await response.json();
			if(result) {
				setData(result);
				setError(null);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setError(error);
		}
		
		
	}

	const [data, setData ] = useState(null);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchData();
	}, [url])

	return {data, error, loading};
}
 
export default useFetchNews;