const puppeteer = require("puppeteer");
// const { insertNews2DB, connectDB } = require("../config/db");
const {MongoClient, ServerApiVersion} = require("mongodb");
const Summarize = require("../Summarizer/Summarizer");
const uri = "mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/?retryWrites=true&w=majority&appName=huutuan2001";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});



async function connectDB() {
	try {
		await client.connect();
		await client.db("newsData").command({ping:1});
		console.log("connected to DB");
		
		// console.log(`a document was inserted with the _id: ${result.insertedId}`);
		
		
	} finally{
		// await client.close();
	}
}

async function insertNews2DB(news1, topicCollection) {
	const mydb = client.db("newsData"); 
	const myColl = mydb.collection(topicCollection);

	// if(!client.isDisconnected()){
	// 	throw new Error("MongoDB client is not established.");
	// }

	if(!news1 || typeof news1 !== "object" || !news1.title) {
		throw new Error("Invalid news data. The 'title' field is required.");
	};

	try {
		if(!news1.image.includes("data")){
			const insertNew = await myColl.insertOne(news1);
			console.log(`id:${insertNew.insertedId} `);
		}
	}catch(e) {
		console.error(`Failed to insert document into ${topicCollection}`, e);
	}
}


const linkMappings = {
	"https://vnexpress.net/the-gioi": "tin_theo_giois",
	"https://vnexpress.net/thoi-su": "thoi_sus",
	"https://vnexpress.net/giai-tri": "giai_tris",
	"https://vnexpress.net/goc-nhin": "goc_nhins",
	"https://vnexpress.net/tin-nong": "duong_bo_los",
	"https://vnexpress.net": "trang_chus",
    };
const scraper = async function(linkscraper) {
	
	let data = [];
	let done = false;
	const URL = linkscraper;
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
	})
	const page = await browser.newPage();
	await page.goto(URL, { waitUntil: "domcontentloaded" });
	// const title = await page.title();
	// console.log(`aaa: ${title}`);
	// setTimeout( async () => {
	// 	const content = await page.content();
	// 	console.log(content);
	// }, 3000)
	const newsTitleSelectors = "h3.title-news a";
	await page.waitForSelector(newsTitleSelectors);
	const titlesLink = await page.$$eval(
		newsTitleSelectors,
		titlesLink => titlesLink.map(title => title.href)
	)
	

	for (let i = 0; i < titlesLink.length; i++) {
		if (i>1 && titlesLink[i].slice(22,32) == titlesLink[i-1].slice(22,32)){
		  titlesLink.splice(i,1);
		}
	}
	console.log(titlesLink);
	
	console.log(titlesLink.length);
	
	// await page.w
	
	// const getFirstNew = await page.evaluate()

	let pagePromise = (link) => new Promise(async(resolve, reject) => {
		try {
			const safeEvaluate = async (selector, callback) => {
				try {
					return await newPage.$eval(selector, callback);
				} catch (error) {
					return "";
				}
			}
			let  dataObj = {};
			let newPage = await browser.newPage();
			let status = await newPage.goto(link, { timeout: 0, waitUntil: "domcontentloaded" });
			status = status.status();
			console.log(status);
			dataObj['link'] = link;
			dataObj['title'] = await safeEvaluate('h1.title-detail', el => el.textContent.trim());
			dataObj['date']  = await safeEvaluate('span.date', el => el.textContent.trim());
			dataObj['topic'] = await safeEvaluate('ul.breadcrumb', el => el.textContent.replace("\n", "").replace("\t", ""));
			dataObj['image'] = await safeEvaluate('article img', img => img.src);
			dataObj['content'] = await newPage.$$eval('p.Normal', pTags => pTags.map((pTag) => pTag.textContent));
			dataObj['summary'] = Summarize(dataObj.content, 3);
			dataObj['author'] = await safeEvaluate('article p strong', el => el.textContent.trim());
			dataObj['description'] = await safeEvaluate('p.description', el => el.textContent.trim());
			// await newPage.$eval('h1.title-detail', text => text.textContent) ? dataObj['title'] = await newPage.$eval('h1.title-detail', text => text.textContent) : dataObj['title'] = "";
			// await newPage.$eval('span.date', text => text.textContent) ? dataObj['date']  = await newPage.$eval('span.date', text => text.textContent) : dataObj['date'] = "";
			// await newPage.$eval('article p strong', text => text.textContent) ? dataObj['author'] = await newPage.$eval('article p strong', text => text.textContent) : dataObj['author'] = "";
			// console.log(dataObj.author);
			// await newPage.$eval('article img', img => img.src) ? dataObj['image'] = await newPage.$eval('article img', img => img.src) : dataObj['image'] = "";
			// // dataObj['image'] = await newPage.$eval('article img', img => img.src);

			// dataObj['topic'] = await newPage.$eval('ul.breadcrumb', text => {
			// 	return text.textContent.replace("\n", "").replace("\t", "")
			// })
			// dataObj['description'] = await newPage.$eval('p.description', text =>  text.textContent);
			// dataObj['link'] = link;
			// // await insertNew2DB(dataObj);
			// // const ws = reader.utils.json_to_sheet(dataObj)
			// // const wb = reader.utils.book_new();
			// // reader.utils.book_append_sheet(wb,ws,'sheet1');
			// // reader.writeFile(wb, 'output.xlsx');
			// dataObj['summary'] = Summarize(dataObj.content, 3);
			
			console.log(dataObj.link);
			
			await newPage.close();
			resolve(dataObj);
		} catch (error) {
			console.log(error);
			resolve(null);
		}
		

	});
	
	for(const link of titlesLink ){
		
		// if(titlesLink[link] == "https://vnexpress.net/hang-trieu-nguoi-xuong-duong-mung-viet-nam-vo-dich-4835808.html"){
		// 	continue;
		// }
		try{
			// const linkToTableMap = {
			// 	[linkTheGioi]: "tin_theo_giois",
			// 	[linkThoiSu]: "thoi_sus",
			// 	[linkGiaiTri]: "giai_tris",
			// 	[linkGocNhin]: "goc_nhins",
			// 	[linkDuongBoLo]: "duong_bo_los",
			//     };
		// connectDB();
			const tableName = linkMappings[linkscraper];
			if (tableName) {
				const scrapedData = await pagePromise(link);
				await insertNews2DB(scrapedData, tableName);
			} else {
				console.warn(`No matching table for linkscraper: ${linkscraper}`);
			}
			// switch (linkscraper) {
			// 	case linkTheGioi:
			// 		await insertNews2DB(await pagePromise(titlesLink[link]), "tin_theo_giois")
			// 		break;
			// 	case linkThoiSu:
			// 		await insertNews2DB(await pagePromise(titlesLink[link]), "thoi_sus")
			// 		break;
			// 	case linkGiaiTri:
			// 		await insertNews2DB(await pagePromise(titlesLink[link]), "giai_tris")
			// 		break;
			// 	case linkGocNhin:
			// 		await insertNews2DB(await pagePromise(titlesLink[link]), "goc_nhins")
			// 		break;
			// 	case linkDuongBoLo:
			// 		await insertNews2DB(await pagePromise(titlesLink[link]), "duong_bo_los")
			// 		break;
			// 	default:
			// 		break;
			// }
	} catch (error) {

		console.log(error);
	}
		// insertNews2DB(await pagePromise(titlesLink[link]), "tin_theo_giois")
	}
	await page.close();
	await browser.close();


}
// scraper(linkGiaiTri);
// for (const [link, topic] of Object.entries(linkMappings)) {
// 	scraper(link);
// }
// scraper()





	// title: String,
	// date: {type: Date, default: Date.now},
	// author: String,
	// image: String,
	// content: Array,
	// topic: String,
	// description: String,




module.exports = {scraper, insertNews2DB, connectDB};