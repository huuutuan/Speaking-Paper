import { client } from "../config/db";
import axios from "axios";

const linkMappings = [
	{url : "https://vnexpress.net/rss/the-gioi.rss", category: "Thế giới"},
	{url : "https://vnexpress.net/rss/thoi-su.rss", category: "Thời sự"},
	{url : "https://vnexpress.net/rss/giai-tri.rss", category: "Giải trí"},
	{url : "https://vnexpress.net/rss/tin-moi-nhat.rss", category: "Tin mới nhất"},
	{url : "https://vnexpress.net/rss/kinh-doanh.rss", category: "Kinh doanh"},
	{url : "https://vnexpress.net/rss/the-thao.rss", category: "Thể thao"},
	{url : "https://vnexpress.net/rss/phap-luat.rss", category: "Pháp luật"},
	{url : "https://vnexpress.net/rss/giao-duc.rss", category: "Giáo dục"},
	{url : "https://vnexpress.net/rss/suc-khoe.rss", category: "Sức khỏe"},
	{url : "https://vnexpress.net/rss/du-lich.rss", category: "Du lịch"},
	{url : "https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss", category: "Khoa học - Công nghệ"},
	{url : "https://vnexpress.net/rss/gia-dinh.rss", category: "Đời sống"},
	{url : "https://vnexpress.net/rss/oto-xe-may.rss", category: "Ô tô - Xe máy"},
	{url : "https://vnexpress.net/rss/y-kien.rss", category: "Ý kiến"},
	{url : "https://vnexpress.net/rss/tam-su.rss", category: "Tâm sự"},
	{url : "https://vnexpress.net/rss/cuoi.rss", category: "Cười"},
	{url : "https://vnexpress.net/rss/tin-noi-bat.rss", category: "Tin nổi bật"},
	{url : "https://vnexpress.net/rss/tin-xem-nhieu.rss", category: "Tin xem nhiều"},
];
// Thế giới,Thời sự,Giải trí,Tin mới nhất,Kinh doanh,Thể thao,Pháp luật,Giáo dục,Sức khỏe,Du lịch,Khoa học - Công nghệ,Đời sống,Ô tô - Xe máy,Ý kiến,Tâm sự,Cười,Tin nổi bật,Tin xem nhiều

