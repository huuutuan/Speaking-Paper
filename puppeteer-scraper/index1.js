const express = require("express");
const cors = require("cors");
// const { connectDB, insertNew2DB } = require("./config/db.js");
const { newRouter } = require("./routes/newRoute.js");
const { scraper } = require("./scraper/scraper.js");
// const { newsModel } = require("./models/newsModel.js");
const mongoose = require("mongoose");
const NewsModel = require("./models/newsModel.js");


const app = express ();
app.use(express.json());
app.use(cors())


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Server Listening on Port: ", PORT);
})

app.get("/", (req, res) => {
	const status = {
		"Status": "Running"
	};

	res.send(status);
})

mongoose.connect("mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/newsData?retryWrites=true&w=majority&appName=huutuan2001")
.then(()=> {
	console.log("aaaaa");
	
})
.catch(() => {
	console.log("bbb");
	
})



app.use("/api/news", newRouter)


// connectDB();

// scraper()
// let myPromise = new Promise(function(myRe))


// const data = await scraper();

// const new1 = {
// 	title: 'Lãnh đạo thế giới ca ngợi lệnh ngừng bắn Israel - Hezbollah ',
//   	date: 'Thứ tư, 27/11/2024, 09:15 (GMT+7)',
//   	author: 'Thanh Danh (Theo AFP)',
//   	image: '',
// 	  content: [
// 	  'Văn phòng Thủ tướng Benjamin Netanyahu ngày 26/11 thông báo Israel đồng ý ngừng bắn với Hezbollah, sau khi 10 bộ trưởng bỏ phiếu thuận và một người bỏ phiếu chống. Tổng thống Mỹ Joe Biden thông báo lệnh ngừng bắn sẽ bắt đầu lúc 4h (9h giờ Hà Nội) ngày 27/11.',
//     	'Trong phát biểu sau đó, lãnh đạo Mỹ, quốc gia đóng vai trò trung tâm trong thúc đẩy thỏa thuận, khẳng định đây là bước đi cần thiết để mang lại ổn định cho khu vực và nhấn mạnh chính phủ Lebanon sẽ chịu trách nhiệm kiểm soát khu vực biên giới, ngăn chặn Hezbollah tái lập hạ tầng quân sự.',
//   	  'Tổng thống Pháp Emmanuel Macron ca ngợi thỏa thuận ngừng bắn là bước khởi đầu để tiến tới kết thúc chiến sự ở Dải Gaza. Ông hy vọng thỏa thuận thúc đẩy tiến trình hòa bình bền vững tại Trung Đông, đồng thời cam kết hỗ trợ Lebanon duy trì chủ quyền và ổn định.',
//   	  '"Thỏa thuận này nên mở đường cho một lệnh ngừng bắn mà người dân Gaza đã chờ đợi quá lâu. Điều này cho thấy chỉ có lòng dũng cảm chính trị mới mang lại hòa bình và ổn định lâu dài cho tất cả mọi người ở Trung Đông", Tổng thống Macron cho hay.',
//   	  'Thủ tướng Lebanon Najib Mikati nói rằng lệnh ngừng bắn là "bước cơ bản" để khôi phục ổn định. Ông cảm ơn sự hỗ trợ của Pháp và Mỹ, đồng thời cam kết chính phủ Lebanon sẽ "tăng cường sự hiện diện của quân đội ở miền nam".',
//   	  'Thủ tướng Anh Keir Starmer khẳng định lệnh ngừng bắn là "giải pháp đáng ra phải có từ lâu" nhằm mang lại "sự bình yên cho dân thường ở cả hai quốc gia". Ông kêu gọi biến lệnh ngừng bắn thành "giải pháp chính trị lâu dài ở Lebanon", cam kết Anh sẽ "đi đầu trong nỗ lực phá vỡ chu kỳ bạo lực hiện nay để hướng tới hòa bình bền vững tại Trung Đông".',
//  	   'Đặc phái viên Liên Hợp Quốc tại Lebanon Jeanine Hennis-Plasschaert hoan nghênh thỏa thuận nhưng cảnh báo về những thách thức trong quá trình thực thi. "Chỉ có cam kết toàn diện và không lay chuyển từ cả hai phía mới đảm bảo lệnh ngừng bắn được thực hiện thành công", bà nhấn mạnh.',
//   	  'Ngoại trưởng Đức Annalena Baerbock gọi thỏa thuận này là "tia hy vọng cho cả khu vực". "Người dân ở cả hai bên biên giới đều muốn sống trong an ninh thực sự và lâu dài. Đây là thành công của ngoại giao", bà nói.',
//  	   'Chủ tịch Ủy ban châu Âu Ursula von der Leyen bày tỏ lạc quan, gọi thỏa thuận là "tin tức rất đáng khích lệ" và nhận định rằng nó sẽ giúp Lebanon tăng cường "an ninh và ổn định nội bộ".',
//   	  'Theo thỏa thuận do Mỹ - Pháp làm trung gian, Israel sẽ dần dần rút quân khỏi miền nam Lebanon trong vòng 60 ngày. Hezbollah chấm dứt hiện diện vũ trang ở phía nam sông Litani, cách biên giới với Israel khoảng 29 km.',
//   	  'Quân đội Lebanon sẽ quản lý vùng lãnh thổ sát biên giới với Israel để đảm bảo Hezbollah không tái xây dựng cơ sở hạ tầng tại đây. Bộ trưởng Ngoại giao Lebanon Abdallah Bou Habib cho biết quân đội Lebanon sẵn sàng triển khai ít nhất 5.000 binh sĩ.',
//   	  'Thủ tướng Netanyahu cho biết lệnh ngừng bắn sẽ giúp Israel tập trung vào mối đe dọa từ Iran, khôi phục kho vũ khí và cho binh sĩ nghỉ ngơi, đồng thời cô lập Hamas, đồng minh của Hezbollah cùng nằm trong Trục Kháng chiến do Iran dẫn đầu. Ông cảnh báo Israel không ngần ngại đáp trả mạnh mẽ nếu Hezbollah vi phạm thỏa thuận ngừng bắn hoặc cố gắng tái vũ trang.',
//   	  'Giao tranh giữa Hezbollah và Israel bùng phát tháng 10/2023, sau cuộc đột kích của Hamas vào miền nam Israel. Hezbollah phóng rocket và máy bay không người lái (UAV) vào miền bắc Israel, cho biết đây là hành động ủng hộ đồng minh Hamas, khiến Tel Aviv đáp trả.',
//   	  'Giao tranh leo thang trong vài tháng gần đây khi Israel liên tục hạ sát thành viên cấp cao của Hezbollah và đưa quân vào miền nam Lebanon.',
//   	  'Xung đột khiến hơn 3.800 người tại Lebanon thiệt mạng, phần lớn là nạn nhân trong các cuộc giao tranh và không kích gần đây. Giới chức Israel cho biết 82 binh sĩ và 47 thường dân nước này cũng thiệt mạng vì đụng độ.',
//    	 'Thanh Danh (Theo AFP)'
//   	],
//  	 topic: 'Thế giới\n\n',
//  	 description: 'Lãnh đạo nhiều nước hoan nghênh thỏa thuận giữa Israel và Hezbollah, kêu gọi hai bên đảm bảo thực thi đầy đủ lệnh ngừng bắn.'
// }

//connectDB
// connectDB();

// insertNew2DB(new1);

// api endpoints

// app.use("/api/new", newRouter())

// const openPage = async () => {
// 	const URL = "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo";
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 		defaultViewport: null,
// 	});	
// 	const page = await browser.newPage();
// 	await page.goto(URL, {waitUntil: "networkidle0"});

// 	let previousHeight = -1;
// 	let maxScrolls = 20;
// 	let scrollCount = 0;
// 	let shouldContinue = true;


	// while (scrollCount < maxScrolls && shouldContinue){
	// 	await page.evaluate(() => {
			
	// 		const abc = document.querySelector("#sidebar-quicklinks");
	// 		const a = abc.scrollHeight;
	// 		// console.log(a);
	// 		abc.scrollIntoView();
	// 		// abc.scrollTo(0, a);
	// 	})

	// 	setTimeout( async ()=>{
	// 		let newHeight = await page.evaluate(() => document.querySelector("#sidebar-quicklinks").scrollHeight);
	// 		if (newHeight == previousHeight){
	// 			shouldContinue = false;
	// 		}
	// 		previousHeight = newHeight;
	// 		scrollCount +=1;



	// 	}, 2000)
	// }
	// const abc = await page.locator('#root > msn-windows-page > fluent-design-system-provider > div.root > div.content').waitHandle();
	// abc.scrollIntoView();

// 	await page.evaluate(() => {
			
// 			const abc = document.querySelector("#sidebar-quicklinks");
// 			const a = abc.scrollHeight;
// 			console.log(a);
// 			abc.scrollIntoView({ behavior: "instant", block: "end" });
// 	})
		

// }
// openPage();
