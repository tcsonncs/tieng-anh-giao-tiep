// 12 tình huống nhập vai (giai đoạn 4, đợt A) — CHƯA DUYỆT: duyet='chua'. Soạn nháp 05/11/2026, chờ Thầy duyệt và soat-chung.
// Mỗi tình huống: ten, boicanh (Việt), nguoi (tên vai người kia), luot = danh sách lượt theo thứ tự.
//   { w:'A', en, vi }                    = người kia nói (cố định)
//   { w:'T', chon:[ { en, vi, gc } ... ] } = lượt của Thầy: 2 lựa chọn, đều dùng được; gc = ghi chú sắc thái (Việt).
// Số trong lời thoại viết bằng chữ cho máy đọc đúng. Chỗ [ ] là chỗ Thầy tự điền khi nói; không có thông tin cá nhân nào ngoài hồ sơ.
// Toán trong NV01, NV02, NV05, NV06: đã tự giải lại (chờ soat-toan).
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.tinhhuong = [
 { id: 'NV01', nhom: 'Lớp học', ten: 'Đầu giờ: học sinh quên sách', muc: 1, duyet: 'chua',
   boicanh: 'Đầu tiết Toán, một học sinh quên sách và xin đi vệ sinh.', nguoi: 'Học sinh',
   luot: [
    { w: 'A', en: 'Excuse me, teacher. I forgot my math book.', vi: 'Thưa thầy, em quên sách Toán ạ.' },
    { w: 'T', chon: [
      { en: "Don't worry. You can share with Nam today.", vi: 'Đừng lo. Hôm nay em xem chung với bạn Nam nhé.', gc: 'Thân thiện, nhẹ nhàng.' },
      { en: 'Please sit with Nam and share his book. Remember to bring yours next time.', vi: 'Em ngồi cùng bạn Nam và xem chung sách. Lần sau nhớ mang sách của em.', gc: 'Có nhắc nhở.' } ] },
    { w: 'A', en: 'Thank you. May I go to the toilet, please?', vi: 'Em cảm ơn. Cho em ra ngoài đi vệ sinh được không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes, you may. Please come back quickly.', vi: 'Được, em đi đi. Nhớ quay lại nhanh nhé.', gc: 'Ngắn gọn.' },
      { en: 'Okay, but please be back in five minutes.', vi: 'Được, nhưng em nhớ quay lại sau năm phút.', gc: 'Nêu rõ thời gian.' } ] },
    { w: 'A', en: 'Yes, teacher. Are we starting a new lesson today?', vi: 'Vâng ạ. Hôm nay mình học bài mới phải không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes. Today we are going to learn about rational numbers.', vi: 'Đúng vậy. Hôm nay chúng ta học về số hữu tỉ.', gc: 'Thông báo bài mới.' },
      { en: 'Yes, a new lesson. Please open your books to page twelve.', vi: 'Đúng, bài mới. Các em mở sách trang mười hai.', gc: 'Vào bài ngay.' } ] }
   ] },

 { id: 'NV02', nhom: 'Lớp học', ten: 'Sinh viên hỏi lại phần chưa hiểu', muc: 1, duyet: 'chua',
   boicanh: 'Lớp Toán học 1 song ngữ, một sinh viên chưa hiểu sự khác nhau giữa phần tử và tập con.', nguoi: 'Sinh viên',
   luot: [
    { w: 'A', en: "Excuse me, teacher. I don't understand the difference between an element and a subset.", vi: 'Thưa thầy, em chưa hiểu khác nhau giữa phần tử và tập con ạ.' },
    { w: 'T', chon: [
      { en: "Good question. Let's look at it together.", vi: 'Câu hỏi hay. Chúng ta cùng xem nhé.', gc: 'Khuyến khích, mở đầu.' },
      { en: 'An element is one object in a set. A subset is a set whose elements all belong to the given set.', vi: 'Phần tử là một đối tượng trong tập hợp. Tập con là tập mà mọi phần tử của nó đều thuộc tập hợp đã cho.', gc: 'Giải thích thẳng.' } ] },
    { w: 'A', en: 'Could you give me an example?', vi: 'Thầy cho em một ví dụ được không ạ?' },
    { w: 'T', chon: [
      { en: 'Sure. The set with one and two is a subset of the set with one, two and three, because every element of the first set is also in the second set.', vi: 'Được. Tập hợp gồm một và hai là tập con của tập hợp gồm một, hai và ba, vì mọi phần tử của tập thứ nhất đều thuộc tập thứ hai.', gc: 'Cho ví dụ và giải thích.' },
      { en: 'Of course. Look at the set with one and two. All of its elements are also in the set with one, two and three.', vi: 'Được chứ. Em nhìn tập hợp gồm một và hai. Mọi phần tử của nó đều thuộc tập hợp gồm một, hai và ba.', gc: 'Để sinh viên tự thấy.' } ] },
    { w: 'A', en: 'Is the number one a subset too?', vi: 'Vậy số một cũng là tập con ạ?' },
    { w: 'T', chon: [
      { en: 'No. The number one is an element. But the set that has only the number one is a subset of the set with one, two and three.', vi: 'Không. Số một là phần tử. Còn tập hợp chỉ gồm số một là một tập con của tập hợp gồm một, hai và ba.', gc: 'Phân biệt phần tử và tập con.' },
      { en: 'No. One is an element of the set. A subset must be a set.', vi: 'Chưa đúng. Số một là phần tử của tập hợp. Tập con thì phải là một tập hợp.', gc: 'Ngắn hơn.' } ] },
    { w: 'A', en: 'I see. Thank you, teacher.', vi: 'Em hiểu rồi. Em cảm ơn thầy.' }
   ] },

 { id: 'NV03', nhom: 'Lớp học', ten: 'Giao bài về nhà', muc: 1, duyet: 'chua',
   boicanh: 'Cuối tiết, thầy giao bài về nhà và trả lời câu hỏi của học sinh.', nguoi: 'Học sinh',
   luot: [
    { w: 'T', chon: [
      { en: "Today's homework is exercises three and four on page twenty.", vi: 'Bài về nhà hôm nay là bài ba và bài bốn trang hai mươi.', gc: 'Nói thẳng.' },
      { en: 'For homework, please do exercises three and four on page twenty.', vi: 'Về nhà, các em làm bài ba và bài bốn trang hai mươi.', gc: 'Lịch sự hơn.' } ] },
    { w: 'A', en: 'Do we need to write the full solution?', vi: 'Chúng em có phải viết đầy đủ lời giải không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes, please write every step clearly.', vi: 'Có, các em viết rõ từng bước.', gc: 'Ngắn gọn.' },
      { en: 'Yes. Show your steps, not only the answer.', vi: 'Có. Hãy ghi các bước, không chỉ ghi đáp số.', gc: 'Nhấn mạnh quá trình.' } ] },
    { w: 'A', en: 'When is it due?', vi: 'Khi nào phải nộp ạ?' },
    { w: 'T', chon: [
      { en: 'Please hand it in next Monday.', vi: 'Các em nộp vào thứ Hai tuần sau.', gc: 'Nói ngày cụ thể.' },
      { en: "It's due at the beginning of the next class.", vi: 'Nộp vào đầu buổi học sau.', gc: 'Nói theo buổi học.' } ] },
    { w: 'A', en: "What if I can't do exercise four?", vi: 'Nếu em không làm được bài bốn thì sao ạ?' },
    { w: 'T', chon: [
      { en: 'Try your best first, then ask me or a friend.', vi: 'Em cố gắng làm trước, rồi hỏi thầy hoặc bạn.', gc: 'Khuyến khích tự làm.' },
      { en: "Don't worry. Write what you tried, and we will check it next class.", vi: 'Đừng lo. Em viết những gì đã thử, buổi sau chúng ta cùng xem.', gc: 'Trấn an.' } ] },
    { w: 'A', en: 'Thank you, teacher. I understand now.', vi: 'Em cảm ơn thầy. Em hiểu rồi ạ.' }
   ] },

 { id: 'NV04', nhom: 'Lớp học', ten: 'Nhắc học sinh nói chuyện riêng', muc: 1, duyet: 'chua',
   boicanh: 'Trong giờ, một học sinh quay sang nói chuyện với bạn. Thầy nhắc nhẹ nhàng.', nguoi: 'Học sinh',
   luot: [
    { w: 'T', chon: [
      { en: 'Lan, could you please face the board?', vi: 'Lan, em quay lên bảng giúp thầy nhé.', gc: 'Lịch sự, nhẹ.' },
      { en: "Lan, let's focus on the lesson now, please.", vi: 'Lan, bây giờ chúng ta tập trung vào bài học nhé.', gc: 'Nhắc cả nhóm tập trung.' } ] },
    { w: 'A', en: 'Sorry, teacher. I was asking Mai about the problem.', vi: 'Em xin lỗi thầy. Em đang hỏi bạn Mai về bài toán ạ.' },
    { w: 'T', chon: [
      { en: 'I understand. If you have a question, please raise your hand.', vi: 'Thầy hiểu. Có câu hỏi thì em giơ tay nhé.', gc: 'Hướng dẫn cách hỏi.' },
      { en: "It's okay to ask, but please do it quietly.", vi: 'Hỏi bạn cũng được, nhưng em nói khẽ thôi nhé.', gc: 'Cho phép có điều kiện.' } ] },
    { w: 'A', en: 'Yes, teacher. Can you repeat the question?', vi: 'Vâng ạ. Thầy nhắc lại câu hỏi được không ạ?' },
    { w: 'T', chon: [
      { en: 'Of course. We need to find the area of this triangle.', vi: 'Được. Chúng ta cần tìm diện tích của tam giác này.', gc: 'Nhắc lại thân thiện.' },
      { en: 'Sure. Please listen carefully this time.', vi: 'Được. Lần này em nghe kỹ nhé.', gc: 'Hơi nghiêm hơn.' } ] },
    { w: 'A', en: "Thank you, teacher. I'm ready now.", vi: 'Em cảm ơn thầy. Em sẵn sàng rồi ạ.' },
    { w: 'T', chon: [
      { en: "Good. Let's continue.", vi: 'Tốt. Chúng ta tiếp tục.', gc: 'Kết ngắn.' },
      { en: "Thank you, Lan. Let's go on.", vi: 'Cảm ơn em, Lan. Chúng ta tiếp tục nhé.', gc: 'Cảm ơn học sinh.' } ] }
   ] },

 { id: 'NV05', nhom: 'Lớp học', ten: 'Khen học sinh giải được bài khó', muc: 1, duyet: 'chua',
   boicanh: 'Một học sinh giải được phương trình hai x cộng ba bằng mười một và trình bày cho thầy.', nguoi: 'Học sinh',
   luot: [
    { w: 'A', en: 'Teacher, I solved the last problem. Two x plus three equals eleven. So x equals four.', vi: 'Thưa thầy, em giải xong bài cuối rồi. Hai x cộng ba bằng mười một. Vậy x bằng bốn ạ.' },
    { w: 'T', chon: [
      { en: 'Excellent! How did you find it?', vi: 'Rất tốt! Em tìm ra bằng cách nào?', gc: 'Khen và hỏi cách làm.' },
      { en: 'Well done! Can you explain your steps?', vi: 'Giỏi lắm! Em giải thích các bước được không?', gc: 'Khen và yêu cầu giải thích.' } ] },
    { w: 'A', en: 'First I subtracted three from both sides. Then I divided both sides by two.', vi: 'Đầu tiên em trừ ba ở cả hai vế. Sau đó em chia cả hai vế cho hai ạ.' },
    { w: 'T', chon: [
      { en: "That's exactly right. Your explanation is very clear.", vi: 'Hoàn toàn đúng. Em giải thích rất rõ ràng.', gc: 'Khen cách trình bày.' },
      { en: 'Very good. You used the correct steps.', vi: 'Rất tốt. Em đã dùng đúng các bước.', gc: 'Khen các bước.' } ] },
    { w: 'A', en: 'Thank you, teacher. It was difficult at first.', vi: 'Em cảm ơn thầy. Lúc đầu bài này khó lắm ạ.' },
    { w: 'T', chon: [
      { en: "Hard problems help us learn. I'm proud of your effort.", vi: 'Bài khó giúp chúng ta học hỏi. Thầy tự hào về sự cố gắng của em.', gc: 'Động viên cảm xúc.' },
      { en: 'Keep it up. Hard problems make you stronger.', vi: 'Em cứ tiếp tục như vậy. Bài khó giúp em giỏi hơn.', gc: 'Động viên ngắn.' } ] }
   ] },

 { id: 'NV06', nhom: 'Lớp học', ten: 'Gợi mở khi học sinh trả lời sai', muc: 1, duyet: 'chua',
   boicanh: 'Học sinh tính diện tích hình chữ nhật dài năm, rộng ba nhưng lại cộng hai số. Thầy gợi mở, không nói đáp án ngay.', nguoi: 'Học sinh',
   luot: [
    { w: 'A', en: 'The rectangle is five by three. The area is eight.', vi: 'Hình chữ nhật dài năm, rộng ba. Diện tích là tám ạ.' },
    { w: 'T', chon: [
      { en: "Let's think together. What is the formula for the area of a rectangle?", vi: 'Chúng ta cùng nghĩ nhé. Công thức tính diện tích hình chữ nhật là gì?', gc: 'Gợi nhớ công thức.' },
      { en: 'Not quite. What do we do with the length and the width to find the area?', vi: 'Chưa đúng lắm. Ta làm gì với chiều dài và chiều rộng để tìm diện tích?', gc: 'Nói thẳng là chưa đúng, rồi hỏi.' } ] },
    { w: 'A', en: 'We multiply them?', vi: 'Mình nhân hai số đó phải không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes. So what is five times three?', vi: 'Đúng. Vậy năm nhân ba bằng bao nhiêu?', gc: 'Dẫn tiếp bằng câu hỏi.' },
      { en: 'Right. Try again with that.', vi: 'Đúng rồi. Em thử làm lại theo cách đó.', gc: 'Để học sinh tự làm.' } ] },
    { w: 'A', en: 'Fifteen. Oh, I added them before.', vi: 'Mười lăm ạ. À, lúc nãy em đã cộng hai số.' },
    { w: 'T', chon: [
      { en: 'Good. You corrected it yourself.', vi: 'Tốt. Em tự sửa được rồi.', gc: 'Khen việc tự sửa.' },
      { en: 'Excellent thinking. Now the answer is correct.', vi: 'Em suy nghĩ rất tốt. Bây giờ đáp án đã đúng.', gc: 'Khen và khẳng định.' } ] },
    { w: 'A', en: 'I will check my work next time.', vi: 'Lần sau em sẽ kiểm tra lại bài ạ.' },
    { w: 'T', chon: [
      { en: "That's a good habit.", vi: 'Đó là một thói quen tốt.', gc: 'Kết ngắn.' },
      { en: 'Very good. Checking your work is important.', vi: 'Rất tốt. Kiểm tra lại bài là điều quan trọng.', gc: 'Kết có lý do.' } ] }
   ] },

 { id: 'NV07', nhom: 'Lớp học', ten: 'Hướng dẫn hoạt động nhóm', muc: 1, duyet: 'chua',
   boicanh: 'Thầy chia lớp thành nhóm bốn người để làm bài tập và hướng dẫn các em.', nguoi: 'Học sinh',
   luot: [
    { w: 'T', chon: [
      { en: 'Please work in groups of four.', vi: 'Các em làm việc theo nhóm bốn người.', gc: 'Ngắn gọn.' },
      { en: "Let's do a group activity. Please make groups of four.", vi: 'Chúng ta làm một hoạt động nhóm. Các em chia thành nhóm bốn người.', gc: 'Mở đầu thân thiện.' } ] },
    { w: 'A', en: 'What are we going to do?', vi: 'Chúng em sẽ làm gì ạ?' },
    { w: 'T', chon: [
      { en: 'Each group will solve three problems and share the answers.', vi: 'Mỗi nhóm giải ba bài và chia sẻ đáp án.', gc: 'Nêu nhiệm vụ.' },
      { en: 'You will solve the three problems together, then one person will present.', vi: 'Các em cùng giải ba bài, sau đó một bạn sẽ trình bày.', gc: 'Nêu cả bước trình bày.' } ] },
    { w: 'A', en: 'How much time do we have?', vi: 'Chúng em có bao nhiêu thời gian ạ?' },
    { w: 'T', chon: [
      { en: 'You have fifteen minutes.', vi: 'Các em có mười lăm phút.', gc: 'Ngắn gọn.' },
      { en: 'Fifteen minutes. I will tell you when five minutes are left.', vi: 'Mười lăm phút. Khi còn năm phút thầy sẽ báo.', gc: 'Có nhắc mốc thời gian.' } ] },
    { w: 'A', en: 'Can we use our calculators?', vi: 'Chúng em dùng máy tính được không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes, you may.', vi: 'Được, các em dùng được.', gc: 'Cho phép.' },
      { en: 'Not for the first problem, but you can for the last two.', vi: 'Bài đầu thì không, nhưng hai bài cuối được dùng.', gc: 'Cho phép có điều kiện.' } ] },
    { w: 'A', en: 'Okay, we understand.', vi: 'Dạ, chúng em hiểu rồi.' },
    { w: 'T', chon: [
      { en: 'Great. Please start now.', vi: 'Tốt. Các em bắt đầu nhé.', gc: 'Ra lệnh bắt đầu.' },
      { en: 'Good. Please choose a leader and begin.', vi: 'Tốt. Các em chọn nhóm trưởng rồi bắt đầu.', gc: 'Thêm vai nhóm trưởng.' } ] }
   ] },

 { id: 'NV08', nhom: 'Lớp học', ten: 'Trả bài kiểm tra', muc: 1, duyet: 'chua',
   boicanh: 'Thầy trả bài kiểm tra, một học sinh hỏi vì sao bị trừ điểm.', nguoi: 'Học sinh',
   luot: [
    { w: 'T', chon: [
      { en: "I'm giving back your tests now.", vi: 'Bây giờ thầy trả bài kiểm tra cho các em.', gc: 'Thông báo.' },
      { en: 'Here are your test papers. Please check them carefully.', vi: 'Đây là bài kiểm tra của các em. Các em xem kỹ nhé.', gc: 'Nhắc xem kỹ.' } ] },
    { w: 'A', en: 'Teacher, why did I lose points in question three?', vi: 'Thưa thầy, vì sao em bị trừ điểm ở câu ba ạ?' },
    { w: 'T', chon: [
      { en: 'You forgot to write the unit. Look here.', vi: 'Em quên ghi đơn vị. Em nhìn chỗ này.', gc: 'Chỉ rõ lỗi.' },
      { en: 'Your calculation was correct, but the final step was missing.', vi: 'Em tính đúng, nhưng thiếu bước cuối.', gc: 'Ghi nhận phần đúng trước.' } ] },
    { w: 'A', en: 'Can I fix it and show you again?', vi: 'Em sửa lại rồi đưa thầy xem lại được không ạ?' },
    { w: 'T', chon: [
      { en: 'Yes, please correct it and bring it to me tomorrow.', vi: 'Được, em sửa rồi mang cho thầy ngày mai.', gc: 'Cho hạn cụ thể.' },
      { en: 'Of course. Rewrite the solution on a new sheet.', vi: 'Được chứ. Em viết lại lời giải vào tờ giấy mới.', gc: 'Hướng dẫn cách sửa.' } ] },
    { w: 'A', en: 'Thank you, teacher. I will be more careful.', vi: 'Em cảm ơn thầy. Em sẽ cẩn thận hơn.' },
    { w: 'T', chon: [
      { en: 'Good. Keep practicing.', vi: 'Tốt. Em tiếp tục luyện tập nhé.', gc: 'Kết ngắn.' },
      { en: "Don't worry. Review the lesson and you will improve.", vi: 'Đừng lo. Em ôn lại bài là sẽ tiến bộ.', gc: 'Động viên.' } ] }
   ] },

 { id: 'NV09', nhom: 'Đồng nghiệp', ten: 'Làm quen giảng viên nước ngoài', muc: 1, duyet: 'chua',
   boicanh: 'Ở hành lang khoa, một giảng viên nước ngoài chào và làm quen. Chỗ [ ] Thầy tự điền.', nguoi: 'Giảng viên nước ngoài',
   luot: [
    { w: 'A', en: "Hello. I don't think we have met. I'm a visiting lecturer.", vi: 'Xin chào. Hình như chúng ta chưa gặp nhau. Tôi là giảng viên thỉnh giảng.' },
    { w: 'T', chon: [
      { en: "Nice to meet you. I'm [your name]. I work in this faculty.", vi: 'Rất vui được gặp anh/chị. Tôi là [tên]. Tôi công tác ở khoa này.', gc: 'Tự giới thiệu ngắn.' },
      { en: "Hello, I'm [your name]. I'm a lecturer in the Faculty of Primary Education.", vi: 'Xin chào, tôi là [tên]. Tôi là giảng viên Khoa Tiểu học.', gc: 'Nêu đơn vị.' } ] },
    { w: 'A', en: 'What do you teach?', vi: 'Anh/chị dạy môn gì?' },
    { w: 'T', chon: [
      { en: 'I teach mathematics and teaching methods for primary education students.', vi: 'Tôi dạy Toán và phương pháp dạy học Toán cho sinh viên ngành Giáo dục Tiểu học.', gc: 'Nói đủ chuyên môn.' },
      { en: 'I teach math courses for students who will become primary teachers.', vi: 'Tôi dạy các học phần Toán cho sinh viên sẽ trở thành giáo viên tiểu học.', gc: 'Cách nói đơn giản hơn.' } ] },
    { w: 'A', en: 'That sounds interesting. How long have you been teaching here?', vi: 'Nghe thú vị đấy. Anh/chị dạy ở đây được bao lâu rồi?' },
    { w: 'T', chon: [
      { en: 'I have been teaching here for [number] years.', vi: 'Tôi dạy ở đây được [số] năm.', gc: 'Tự điền số năm.' },
      { en: 'I joined the faculty in [year].', vi: 'Tôi về khoa năm [năm].', gc: 'Tự điền năm.' } ] },
    { w: 'A', en: 'Maybe we can have coffee sometime.', vi: 'Có dịp chúng ta đi uống cà phê nhé.' },
    { w: 'T', chon: [
      { en: "That would be nice. Let's catch up next week.", vi: 'Thế thì tốt quá. Tuần sau mình trao đổi nhé.', gc: 'Hẹn chung chung.' },
      { en: 'That would be great. When are you free?', vi: 'Tuyệt quá. Khi nào anh/chị rảnh?', gc: 'Hỏi lịch cụ thể.' } ] }
   ] },

 { id: 'NV10', nhom: 'Đồng nghiệp', ten: 'Chỉ đường và lịch dạy cho đồng nghiệp', muc: 1, duyet: 'chua',
   boicanh: 'Một giảng viên nước ngoài hỏi phòng học, giờ dạy và thiết bị. Nội dung chỉ là ví dụ luyện nói.', nguoi: 'Giảng viên nước ngoài',
   luot: [
    { w: 'A', en: 'Excuse me, do you know where room two hundred and three is?', vi: 'Xin lỗi, anh/chị có biết phòng hai trăm lẻ ba ở đâu không?' },
    { w: 'T', chon: [
      { en: "Yes, it's on the second floor, next to the library.", vi: 'Có, ở tầng hai, cạnh thư viện.', gc: 'Chỉ đường (ví dụ).' },
      { en: "Sorry, I'm not sure. Let me check the schedule.", vi: 'Xin lỗi, tôi không chắc. Để tôi xem lại lịch.', gc: 'Khi chưa biết.' } ] },
    { w: 'A', en: 'What time does my class start?', vi: 'Lớp của tôi bắt đầu lúc mấy giờ?' },
    { w: 'T', chon: [
      { en: 'Your class starts at half past seven.', vi: 'Lớp của anh/chị bắt đầu lúc bảy giờ rưỡi.', gc: 'Khẳng định.' },
      { en: 'I think it starts at seven thirty. Please check the timetable.', vi: 'Tôi nghĩ là bảy giờ ba mươi. Anh/chị xem lại thời khoá biểu nhé.', gc: 'Khi chưa chắc.' } ] },
    { w: 'A', en: 'Is there a projector in that room?', vi: 'Phòng đó có máy chiếu không?' },
    { w: 'T', chon: [
      { en: 'Yes, but please ask the office for the remote control.', vi: 'Có, nhưng anh/chị nhớ xin điều khiển ở văn phòng.', gc: 'Dặn thêm.' },
      { en: 'I think so. You can ask the office to make sure.', vi: 'Tôi nghĩ là có. Anh/chị hỏi văn phòng để chắc chắn.', gc: 'Khi chưa chắc.' } ] },
    { w: 'A', en: 'Thank you so much for your help.', vi: 'Cảm ơn anh/chị rất nhiều đã giúp.' },
    { w: 'T', chon: [
      { en: "You're welcome. Let me know if you need anything else.", vi: 'Không có gì. Cần gì nữa anh/chị cứ nói.', gc: 'Lịch sự.' },
      { en: 'No problem. Good luck with your class!', vi: 'Không có gì. Chúc buổi dạy suôn sẻ!', gc: 'Thân mật.' } ] }
   ] },

 { id: 'NV11', nhom: 'Đồng nghiệp', ten: 'Họp tổ: đề xuất và không đồng ý lịch sự', muc: 1, duyet: 'chua',
   boicanh: 'Họp tổ bàn lịch thi. Thầy đề xuất ý kiến, sau đó bày tỏ không đồng ý một cách lịch sự.', nguoi: 'Tổ trưởng / đồng nghiệp',
   luot: [
    { w: 'A', en: 'Does anyone have any suggestions about the exam schedule?', vi: 'Ai có đề xuất gì về lịch thi không?' },
    { w: 'T', chon: [
      { en: 'I suggest holding the exam in the second week of December.', vi: 'Tôi đề xuất tổ chức thi vào tuần thứ hai của tháng Mười Hai.', gc: 'Đề xuất trực tiếp.' },
      { en: 'I think we should hold the exam earlier, in the first week of December.', vi: 'Tôi nghĩ ta nên thi sớm hơn, vào tuần đầu tháng Mười Hai.', gc: 'Nêu ý kiến mềm hơn.' } ] },
    { w: 'A', en: 'But many students will have other exams around that time.', vi: 'Nhưng thời gian đó nhiều sinh viên có các môn thi khác.' },
    { w: 'T', chon: [
      { en: "That's a good point. Then we could choose the third week.", vi: 'Ý kiến hay. Vậy ta có thể chọn tuần thứ ba.', gc: 'Nhường bước, đề xuất thay thế.' },
      { en: 'I see your point. Can we check the schedule of other courses first?', vi: 'Tôi hiểu ý anh/chị. Ta xem lịch các học phần khác trước được không?', gc: 'Đề nghị kiểm tra thêm.' } ] },
    { w: 'A', en: 'Let me check. It looks like the third week is free. Shall we move it there? Does anyone disagree?', vi: 'Để tôi xem. Có vẻ tuần thứ ba còn trống. Ta chuyển sang đó nhé? Có ai không đồng ý không?' },
    { w: 'T', chon: [
      { en: 'I agree with that plan.', vi: 'Tôi đồng ý với kế hoạch đó.', gc: 'Đồng ý ngắn.' },
      { en: "I'm sorry, but I have a concern. The third week is close to the holiday.", vi: 'Xin lỗi, nhưng tôi có băn khoăn. Tuần thứ ba gần kỳ nghỉ.', gc: 'Không đồng ý lịch sự.' } ] },
    { w: 'A', en: "Okay. Let's put it to a vote to confirm.", vi: 'Vậy ta biểu quyết để chốt nhé.' },
    { w: 'T', chon: [
      { en: "Fine. I will follow the group's decision.", vi: 'Được. Tôi sẽ theo quyết định của tổ.', gc: 'Tôn trọng số đông.' },
      { en: 'Thank you for listening to my opinion.', vi: 'Cảm ơn mọi người đã lắng nghe ý kiến của tôi.', gc: 'Kết lịch sự.' } ] }
   ] },

 { id: 'NV12', nhom: 'Hội thảo', ten: 'Hỏi đáp sau báo cáo hội thảo', muc: 1, duyet: 'chua',
   boicanh: 'Thầy vừa trình bày xong. Một người nghe đặt câu hỏi. Chỗ [ ] Thầy tự điền theo nghiên cứu của mình; câu trả lời chỉ là mẫu luyện nói.', nguoi: 'Người nghe',
   luot: [
    { w: 'A', en: 'Thank you for your presentation. I have a question about your study.', vi: 'Cảm ơn bài trình bày của anh/chị. Tôi có một câu hỏi về nghiên cứu.' },
    { w: 'T', chon: [
      { en: 'Thank you. Please go ahead.', vi: 'Cảm ơn. Mời anh/chị hỏi.', gc: 'Ngắn gọn.' },
      { en: 'Thank you for coming. What would you like to ask?', vi: 'Cảm ơn anh/chị đã đến. Anh/chị muốn hỏi gì ạ?', gc: 'Thân thiện.' } ] },
    { w: 'A', en: 'How many students took part in your study?', vi: 'Có bao nhiêu sinh viên tham gia nghiên cứu của anh/chị?' },
    { w: 'T', chon: [
      { en: 'There were [number] students in the study.', vi: 'Có [số] sinh viên tham gia nghiên cứu.', gc: 'Tự điền số.' },
      { en: 'About [number] students took part.', vi: 'Khoảng [số] sinh viên tham gia.', gc: 'Nói khoảng.' } ] },
    { w: 'A', en: 'Did you find any difference between the two groups?', vi: 'Anh/chị có thấy sự khác biệt giữa hai nhóm không?' },
    { w: 'T', chon: [
      { en: 'Yes, there was a difference. I will explain it on this slide.', vi: 'Có, có sự khác biệt. Tôi sẽ giải thích ở slide này.', gc: 'Chỉ dùng khi đúng kết quả của Thầy.' },
      { en: 'There was a small difference. However, we need more data to be sure.', vi: 'Có khác biệt nhỏ. Tuy nhiên cần thêm dữ liệu để chắc chắn.', gc: 'Thận trọng khi kết luận.' } ] },
    { w: 'A', en: 'Do you plan to continue this research?', vi: 'Anh/chị có dự định tiếp tục nghiên cứu này không?' },
    { w: 'T', chon: [
      { en: 'Yes. Next, I plan to study [topic].', vi: 'Có. Tiếp theo tôi dự định nghiên cứu [chủ đề].', gc: 'Tự điền chủ đề.' },
      { en: 'I hope to extend it to other courses.', vi: 'Tôi hy vọng mở rộng sang các học phần khác.', gc: 'Hướng mở rộng.' } ] },
    { w: 'A', en: 'Thank you. Very interesting.', vi: 'Cảm ơn. Rất thú vị.' },
    { w: 'T', chon: [
      { en: 'Thank you for your question.', vi: 'Cảm ơn câu hỏi của anh/chị.', gc: 'Kết ngắn.' },
      { en: 'Thank you. I would be happy to discuss it after the session.', vi: 'Cảm ơn. Tôi rất vui được trao đổi thêm sau phiên này.', gc: 'Mời trao đổi tiếp.' } ] }
   ] }
];
