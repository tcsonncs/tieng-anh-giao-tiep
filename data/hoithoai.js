// Hội thoại ngắn để luyện nghe (giai đoạn 2) — CHƯA DUYỆT: duyet='chua'. Mức trung bình, bối cảnh lớp Toán và đồng nghiệp.
// Mỗi bài: lines (A/B, en, vi), qs (câu hỏi trắc nghiệm 3 lựa chọn: q, qvi, o, a = vị trí đáp án đúng 0..2, ex = giải thích tiếng Việt).
// Số trong lời thoại viết bằng chữ để máy đọc đúng. Chưa soát độc lập (chờ soat-chung).
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.hoithoai = [
 {
  id: 'HT01', ten: 'Đầu giờ: kiểm tra sĩ số', boicanh: 'Đầu tiết Toán 7, giáo viên kiểm tra sĩ số rồi cho mở sách.', muc: 1, duyet: 'chua',
  nguoi: { A: 'Giáo viên', B: 'Học sinh' },
  lines: [
   { w: 'A', en: 'Good morning, everyone. Is anyone absent today?', vi: 'Chào cả lớp. Hôm nay có ai vắng không?' },
   { w: 'B', en: 'Yes, Minh is absent. Minh has a cold.', vi: 'Dạ có, bạn Minh vắng. Bạn Minh bị cảm.' },
   { w: 'A', en: 'Thank you. Please open your books to page forty-five.', vi: 'Cảm ơn em. Các em mở sách trang 45.' },
   { w: 'B', en: 'Excuse me. I forgot my book. Can I share with Nam?', vi: 'Thưa thầy/cô, em quên sách. Em xem chung với bạn Nam được không ạ?' },
   { w: 'A', en: 'Of course. Today we are going to learn about rational numbers.', vi: 'Tất nhiên rồi. Hôm nay chúng ta học về số hữu tỉ.' }
  ],
  qs: [
   { q: 'Who is absent today?', qvi: 'Hôm nay ai vắng?', o: ['Minh', 'Nam', 'The teacher'], a: 0, ex: 'Học sinh nói: “Minh is absent.”' },
   { q: 'Why is Minh absent?', qvi: 'Vì sao Minh vắng?', o: ['Minh forgot the book.', 'Minh is late.', 'Minh is sick.'], a: 2, ex: '“Minh has a cold” = bạn bị cảm, tức là bị ốm.' },
   { q: 'Which page should students open?', qvi: 'Học sinh mở sách trang nào?', o: ['Page fourteen', 'Page forty-five', 'Page fifty-four'], a: 1, ex: 'Giáo viên nói “page forty-five” (45). Chú ý forty /ˈfɔːrti/ khác fourteen.' },
   { q: 'What will the student do about the book?', qvi: 'Học sinh sẽ làm gì vì quên sách?', o: ['Share with Nam', 'Go home', 'Borrow from the teacher'], a: 0, ex: 'Học sinh hỏi “Can I share with Nam?” và giáo viên đồng ý.' }
  ]
 },
 {
  id: 'HT02', ten: 'Giao bài về nhà', boicanh: 'Cuối tiết, giáo viên giao bài tập về nhà.', muc: 1, duyet: 'chua',
  nguoi: { A: 'Giáo viên', B: 'Học sinh' },
  lines: [
   { w: 'A', en: 'For homework, please do exercises three and four on page fifty.', vi: 'Bài về nhà, các em làm bài 3 và bài 4 trang 50.' },
   { w: 'B', en: 'Is it due tomorrow?', vi: 'Dạ, ngày mai nộp ạ?' },
   { w: 'A', en: 'No, it is due on Friday. You have plenty of time.', vi: 'Không, thứ Sáu mới nộp. Các em có nhiều thời gian.' },
   { w: 'B', en: 'Do we need to show all the steps?', vi: 'Chúng em có cần trình bày tất cả các bước không ạ?' },
   { w: 'A', en: 'Yes. Write down every step, so I can see your thinking.', vi: 'Có. Viết ra từng bước để thầy/cô thấy cách nghĩ của các em.' }
  ],
  qs: [
   { q: 'Which exercises are the homework?', qvi: 'Bài về nhà là những bài nào?', o: ['Exercises four and five', 'Only exercise three', 'Exercises three and four'], a: 2, ex: '“exercises three and four on page fifty”.' },
   { q: 'When is the homework due?', qvi: 'Khi nào nộp bài?', o: ['On Friday', 'Tomorrow', 'On Monday'], a: 0, ex: 'Giáo viên nói “it is due on Friday”. Học sinh đoán “tomorrow” nhưng bị sửa.' },
   { q: 'Does the teacher want all the steps?', qvi: 'Giáo viên có muốn thấy mọi bước không?', o: ['No, only the answer.', 'Yes, every step.', 'Only the first step.'], a: 1, ex: '“Write down every step, so I can see your thinking.”' }
  ]
 },
 {
  id: 'HT03', ten: 'Hỏi đáp gợi mở: giải phương trình', boicanh: 'Giáo viên dẫn học sinh giải 2x + 3 = 11 bằng câu hỏi gợi mở.', muc: 2, duyet: 'chua',
  nguoi: { A: 'Giáo viên', B: 'Học sinh' },
  lines: [
   { w: 'A', en: 'Who can tell me the first step to solve two x plus three equals eleven?', vi: 'Ai cho thầy/cô biết bước đầu tiên để giải 2x + 3 = 11?' },
   { w: 'B', en: 'We subtract three from both sides.', vi: 'Ta trừ 3 ở cả hai vế ạ.' },
   { w: 'A', en: 'Good. What do we get?', vi: 'Tốt. Ta được gì?' },
   { w: 'B', en: 'We get two x equals eight.', vi: 'Ta được 2x = 8 ạ.' },
   { w: 'A', en: 'Right. And then?', vi: 'Đúng. Rồi sao nữa?' },
   { w: 'B', en: 'We divide both sides by two, so x equals four.', vi: 'Ta chia cả hai vế cho 2, vậy x = 4 ạ.' },
   { w: 'A', en: 'Excellent! Now let us check the answer.', vi: 'Rất tốt! Bây giờ ta kiểm tra lại đáp số.' }
  ],
  qs: [
   { q: 'What is the first step?', qvi: 'Bước đầu tiên là gì?', o: ['Divide by two', 'Subtract three from both sides', 'Add three to both sides'], a: 1, ex: '“We subtract three from both sides.”' },
   { q: 'What do the students get after the first step?', qvi: 'Sau bước đầu, học sinh được gì?', o: ['Two x equals fourteen', 'x equals four', 'Two x equals eight'], a: 2, ex: '11 − 3 = 8 nên 2x = 8.' },
   { q: 'What is the final value of x?', qvi: 'Cuối cùng x bằng bao nhiêu?', o: ['Four', 'Eight', 'Two'], a: 0, ex: '2x = 8 nên x = 4.' },
   { q: 'What does the teacher want to do at the end?', qvi: 'Cuối cùng giáo viên muốn làm gì?', o: ['Give homework', 'Start a new lesson', 'Check the answer'], a: 2, ex: '“Now let us check the answer.”' }
  ]
 },
 {
  id: 'HT04', ten: 'Đồng nghiệp: đổi lịch dạy', boicanh: 'Hai giáo viên trao đổi để đổi buổi dạy vì có cuộc họp.', muc: 2, duyet: 'chua',
  nguoi: { A: 'Giáo viên A', B: 'Giáo viên B' },
  lines: [
   { w: 'A', en: 'Do you have a minute? I need to ask you about next week.', vi: 'Bạn có rảnh một chút không? Mình cần hỏi về tuần sau.' },
   { w: 'B', en: 'Sure. What is up?', vi: 'Được. Có chuyện gì vậy?' },
   { w: 'A', en: 'I have a department meeting on Wednesday morning, so I cannot teach my class. Could we swap classes?', vi: 'Sáng thứ Tư mình có họp khoa nên không dạy lớp được. Mình đổi lịch được không?' },
   { w: 'B', en: 'Let me check. I am free on Thursday afternoon. Is that okay?', vi: 'Để mình xem. Chiều thứ Năm mình rảnh. Được không?' },
   { w: 'A', en: 'Thursday afternoon works for me. Thanks a lot!', vi: 'Chiều thứ Năm được với mình. Cảm ơn bạn nhiều!' },
   { w: 'B', en: 'No problem. I will tell my students. Please tell yours.', vi: 'Không có gì. Mình sẽ báo sinh viên của mình. Bạn báo sinh viên của bạn nhé.' }
  ],
  qs: [
   { q: 'Why can Teacher A not teach on Wednesday morning?', qvi: 'Vì sao giáo viên A không dạy được sáng thứ Tư?', o: ['A has a department meeting.', 'A is sick.', 'A has a conference abroad.'], a: 0, ex: '“I have a department meeting on Wednesday morning.”' },
   { q: 'When is Teacher B free?', qvi: 'Khi nào giáo viên B rảnh?', o: ['Wednesday morning', 'Friday afternoon', 'Thursday afternoon'], a: 2, ex: '“I am free on Thursday afternoon.”' },
   { q: "Who will tell Teacher A's students about the change?", qvi: 'Ai sẽ báo sinh viên của giáo viên A về việc đổi lịch?', o: ['Teacher B', 'Teacher A', 'The head of the department'], a: 1, ex: 'B nói “I will tell my students. Please tell yours.” nên A tự báo sinh viên của mình.' }
  ]
 },
 {
  id: 'HT05', ten: 'Học sinh hỏi bài sau giờ học', boicanh: 'Sau giờ học, một học sinh nhờ giáo viên giúp bài hình học về tam giác vuông.', muc: 2, duyet: 'chua',
  nguoi: { A: 'Học sinh', B: 'Giáo viên' },
  lines: [
   { w: 'A', en: 'Excuse me, teacher. I do not understand this problem about the right triangle.', vi: 'Thưa thầy/cô, em không hiểu bài toán về tam giác vuông này.' },
   { w: 'B', en: 'Okay. Let us look at it together. What are we trying to find?', vi: 'Được. Ta cùng xem nhé. Ta cần tìm gì?' },
   { w: 'A', en: 'The length of the third side.', vi: 'Độ dài cạnh thứ ba ạ.' },
   { w: 'B', en: 'Good. Which theorem can help us?', vi: 'Tốt. Định lí nào giúp ta được?' },
   { w: 'A', en: 'The Pythagorean theorem?', vi: 'Định lí Pythagore ạ?' },
   { w: 'B', en: 'Exactly. Now try again, and tell me if you get stuck.', vi: 'Chính xác. Giờ em làm lại, và nói với thầy/cô nếu em bị vướng.' }
  ],
  qs: [
   { q: 'What does the student need to find?', qvi: 'Học sinh cần tìm gì?', o: ['The area of the triangle', 'The size of an angle', 'The length of the third side'], a: 2, ex: '“The length of the third side.”' },
   { q: 'Which theorem does the student suggest?', qvi: 'Học sinh đề xuất định lí nào?', o: ['The law of sines', 'The Pythagorean theorem', 'The angle sum theorem'], a: 1, ex: 'Học sinh nói “The Pythagorean theorem?” và giáo viên xác nhận “Exactly.”' },
   { q: 'What should the student do if they get stuck?', qvi: 'Nếu bị vướng, học sinh nên làm gì?', o: ['Tell the teacher', 'Ask a classmate', 'Look at the answer'], a: 0, ex: '“Tell me if you get stuck.”' }
  ]
 },
 {
  id: 'HT06', ten: 'Hội thảo: làm quen đồng nghiệp', boicanh: 'Hai người làm quen trước phiên báo cáo ở một hội thảo.', muc: 2, duyet: 'chua',
  nguoi: { A: 'Khách tham dự', B: 'Giảng viên' },
  lines: [
   { w: 'A', en: 'Hi, I am Anna. I teach at a university in Singapore. Are you presenting at the conference?', vi: 'Xin chào, tôi là Anna. Tôi dạy ở một trường đại học tại Singapore. Bạn có báo cáo ở hội thảo không?' },
   { w: 'B', en: 'Yes, I am presenting tomorrow at ten. My topic is teaching fractions in primary school.', vi: 'Có, ngày mai lúc mười giờ tôi báo cáo. Chủ đề của tôi là dạy phân số ở tiểu học.' },
   { w: 'A', en: 'That sounds interesting. How long is your talk?', vi: 'Nghe thú vị đấy. Bài nói của bạn dài bao lâu?' },
   { w: 'B', en: 'Fifteen minutes, plus five minutes for questions.', vi: 'Mười lăm phút, cộng năm phút để hỏi đáp.' },
   { w: 'A', en: 'Great. I will come and listen.', vi: 'Tuyệt. Tôi sẽ đến nghe.' }
  ],
  qs: [
   { q: 'When is the presentation?', qvi: 'Khi nào có báo cáo?', o: ['Today at ten', 'Tomorrow at ten', 'Tomorrow at two'], a: 1, ex: '“tomorrow at ten”.' },
   { q: 'What is the topic?', qvi: 'Chủ đề là gì?', o: ['Teaching fractions in primary school', 'Teaching geometry to teenagers', 'Using computers in class'], a: 0, ex: '“teaching fractions in primary school”.' },
   { q: 'How many minutes are for questions?', qvi: 'Có bao nhiêu phút để hỏi đáp?', o: ['Fifteen', 'Fifty', 'Five'], a: 2, ex: 'Chú ý fifteen /fɪfˈtiːn/ và fifty /ˈfɪfti/. Ở đây: “fifteen minutes, plus five minutes for questions”.' },
   { q: 'What will Anna do?', qvi: 'Anna sẽ làm gì?', o: ['Give a talk too', 'Come and listen', 'Ask for the slides'], a: 1, ex: '“I will come and listen.”' }
  ]
 },
 {
  id: 'HT07', ten: 'Hoạt động nhóm', boicanh: 'Giáo viên chia nhóm làm phiếu bài tập trong lớp.', muc: 1, duyet: 'chua',
  nguoi: { A: 'Giáo viên', B: 'Học sinh' },
  lines: [
   { w: 'A', en: 'Now, please work in groups of four. Each group will get one worksheet.', vi: 'Bây giờ các em làm việc theo nhóm bốn người. Mỗi nhóm nhận một phiếu bài tập.' },
   { w: 'B', en: 'Can we use calculators?', vi: 'Chúng em dùng máy tính được không ạ?' },
   { w: 'A', en: 'Not for the first two problems. You can use them for the last one.', vi: 'Hai bài đầu thì không. Bài cuối các em được dùng.' },
   { w: 'B', en: 'How much time do we have?', vi: 'Chúng em có bao nhiêu thời gian ạ?' },
   { w: 'A', en: 'Ten minutes. I will tell you when there are two minutes left.', vi: 'Mười phút. Thầy/cô sẽ báo khi còn hai phút.' }
  ],
  qs: [
   { q: 'How many students are in each group?', qvi: 'Mỗi nhóm có mấy học sinh?', o: ['Four', 'Three', 'Five'], a: 0, ex: '“groups of four”.' },
   { q: 'When can they use calculators?', qvi: 'Khi nào được dùng máy tính?', o: ['For all the problems', 'For the first two problems', 'For the last problem'], a: 2, ex: '“Not for the first two problems. You can use them for the last one.”' },
   { q: 'How long do they have?', qvi: 'Họ có bao lâu?', o: ['Two minutes', 'Ten minutes', 'Twenty minutes'], a: 1, ex: '“Ten minutes.” Hai phút là lúc thầy nhắc giờ.' },
   { q: 'When will the teacher give a reminder?', qvi: 'Khi nào giáo viên nhắc giờ?', o: ['When there are two minutes left', 'At the start', 'When time is over'], a: 0, ex: '“I will tell you when there are two minutes left.”' }
  ]
 },
 {
  id: 'HT08', ten: 'Dặn dò trước giờ kiểm tra', boicanh: 'Giáo viên nhắc quy định trước khi học sinh làm bài kiểm tra.', muc: 2, duyet: 'chua',
  nguoi: { A: 'Giáo viên', B: 'Học sinh' },
  lines: [
   { w: 'A', en: 'Put everything away except your pen. The test starts now. You have forty minutes.', vi: 'Cất mọi thứ đi, chỉ để lại bút. Bài kiểm tra bắt đầu. Các em có bốn mươi phút.' },
   { w: 'B', en: 'Do we have to show our work?', vi: 'Chúng em có phải trình bày bài làm không ạ?' },
   { w: 'A', en: 'Yes. And please do not talk during the test. If you have a question, raise your hand.', vi: 'Có. Và đừng nói chuyện trong giờ kiểm tra. Có câu hỏi thì giơ tay.' },
   { w: 'B', en: 'What if I finish early?', vi: 'Nếu em làm xong sớm thì sao ạ?' },
   { w: 'A', en: 'Check your answers again before you hand in your paper.', vi: 'Hãy kiểm tra lại đáp số trước khi nộp bài.' }
  ],
  qs: [
   { q: 'What can students keep on the desk?', qvi: 'Học sinh được để gì trên bàn?', o: ['Their books', 'Their pens', 'Their phones'], a: 1, ex: '“Put everything away except your pen.”' },
   { q: 'How long is the test?', qvi: 'Bài kiểm tra dài bao lâu?', o: ['Forty minutes', 'Fourteen minutes', 'Four minutes'], a: 0, ex: '“forty minutes” (40 phút). Chú ý forty /ˈfɔːrti/ và fourteen /fɔːrˈtiːn/.' },
   { q: 'How should a student ask a question?', qvi: 'Học sinh hỏi bài bằng cách nào?', o: ['Call out loudly', 'Walk to the board', 'Raise a hand'], a: 2, ex: '“If you have a question, raise your hand.”' },
   { q: 'What should students do if they finish early?', qvi: 'Làm xong sớm thì làm gì?', o: ['Leave the room', 'Check the answers again', 'Talk to a friend'], a: 1, ex: '“Check your answers again before you hand in your paper.”' }
  ]
 }
];

// Các dạng nối âm / nuốt âm thân mật hay gặp (tiếng Anh Mỹ nói nhanh). Chỉ để nghe hiểu, không dùng khi viết email, thông báo.
window.APP_DATA.noiam_chung = [
 { id: 'NA01', viet: 'going to', noi: 'gonna', vi: 'sắp / định', full: 'We are going to check the answers.', nhanh: "We're gonna check the answers.", duyet: 'chua' },
 { id: 'NA02', viet: 'want to', noi: 'wanna', vi: 'muốn', full: 'Do you want to try this problem?', nhanh: 'Do you wanna try this problem?', duyet: 'chua' },
 { id: 'NA03', viet: 'have got to', noi: 'gotta', vi: 'phải (nhấn mạnh, bắt buộc)', full: 'You have got to show your steps.', nhanh: 'You gotta show your steps.', duyet: 'chua' },
 { id: 'NA04', viet: 'have to', noi: 'hafta', vi: 'phải (thông thường)', full: 'We have to finish before the bell.', nhanh: 'We hafta finish before the bell.', duyet: 'chua' },
 { id: 'NA05', viet: 'kind of', noi: 'kinda', vi: 'hơi / khá', full: 'This problem is kind of hard.', nhanh: 'This problem is kinda hard.', duyet: 'chua' },
 { id: 'NA06', viet: 'let me', noi: 'lemme', vi: 'để tôi', full: 'Let me explain it again.', nhanh: 'Lemme explain it again.', duyet: 'chua' }
];
