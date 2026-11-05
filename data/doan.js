// Đoạn đọc dài 30–60 giây (giai đoạn 3, đợt 2) — CHƯA DUYỆT: duyet='chua'. Soạn nháp 05/11/2026, chờ Thầy duyệt, soat-chung và soat-toan (DL06).
// Mỗi đoạn: ten, chude, s (các câu: en, vi), ghichu (tuỳ chọn). Số viết bằng chữ để máy đọc đúng.
// Chỗ [ ] là chỗ Thầy tự thay bằng thông tin của mình khi nói (máy đọc phần trong ngoặc như chữ thường).
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.doan = [
 { id: 'DL01', ten: 'Mở đầu bài giảng: tập hợp', chude: 'Mở đầu bài giảng Toán song ngữ', duyet: 'chua',
   s: [
    { en: 'Good morning, everyone, and welcome to our mathematics class.', vi: 'Chào cả lớp, chào mừng các em đến với giờ Toán.' },
    { en: 'Today we will study sets, which are collections of distinct objects.', vi: 'Hôm nay chúng ta học về tập hợp, là một nhóm các đối tượng (không lặp lại).' },
    { en: 'By the end of this lesson, you will be able to describe a set in two ways.', vi: 'Cuối bài, các em sẽ mô tả được một tập hợp bằng hai cách.' },
    { en: 'First, you can list its elements, such as the numbers one, two, and three.', vi: 'Thứ nhất, liệt kê các phần tử, chẳng hạn các số một, hai và ba.' },
    { en: 'Second, you can state a rule, such as all positive whole numbers less than four.', vi: 'Thứ hai, nêu một quy tắc, chẳng hạn mọi số tự nhiên khác không nhỏ hơn bốn.' },
    { en: 'Please listen carefully, and ask me a question if any word is new.', vi: 'Hãy lắng nghe kỹ và hỏi thầy nếu có từ nào mới.' },
    { en: 'I will explain in English first, and then I will check your understanding in Vietnamese.', vi: 'Thầy giảng bằng tiếng Anh trước, rồi kiểm tra hiểu bài bằng tiếng Việt.' }
   ] },
 { id: 'DL02', ten: 'Mở đầu bài giảng: phân số', chude: 'Mở đầu bài giảng Toán song ngữ', duyet: 'chua',
   s: [
    { en: "Let's begin with a simple question.", vi: 'Ta bắt đầu bằng một câu hỏi đơn giản.' },
    { en: 'If I cut a cake into four equal pieces and eat one piece, what part have I eaten?', vi: 'Nếu thầy cắt một chiếc bánh thành bốn phần bằng nhau và ăn một phần, thầy đã ăn mấy phần của chiếc bánh?' },
    { en: 'Yes, one quarter, or one over four.', vi: 'Đúng, một phần tư (viết là 1/4).' },
    { en: 'We write this number as a fraction.', vi: 'Ta viết số này dưới dạng phân số.' },
    { en: 'The top number is the numerator, and the bottom number is the denominator.', vi: 'Số ở trên là tử số, số ở dưới là mẫu số.' },
    { en: 'The denominator tells us how many equal parts the whole is divided into.', vi: 'Mẫu số cho biết cái nguyên được chia thành bao nhiêu phần bằng nhau.' },
    { en: 'The numerator tells us how many of those parts we take.', vi: 'Tử số cho biết ta lấy bao nhiêu phần.' },
    { en: 'Now turn to your partner and explain this idea in your own words.', vi: 'Bây giờ các em quay sang bạn và giải thích ý này bằng lời của mình.' }
   ] },
 { id: 'DL03', ten: 'Hướng dẫn hoạt động nhóm', chude: 'Hướng dẫn hoạt động nhóm / giao bài', duyet: 'chua',
   s: [
    { en: 'Now we will do a group activity.', vi: 'Bây giờ ta làm một hoạt động nhóm.' },
    { en: 'Please sit in groups of four.', vi: 'Các em ngồi theo nhóm bốn người.' },
    { en: 'Each group will receive one worksheet with three problems.', vi: 'Mỗi nhóm nhận một phiếu bài tập có ba bài toán.' },
    { en: 'First, read the problems silently for two minutes.', vi: 'Trước hết, đọc thầm các bài trong hai phút.' },
    { en: 'Then discuss your ideas and choose one person to write the answers.', vi: 'Sau đó thảo luận và chọn một bạn ghi đáp án.' },
    { en: 'You have fifteen minutes in total.', vi: 'Tổng thời gian là mười lăm phút.' },
    { en: 'When I say stop, one student from each group will explain your group’s solution to the class.', vi: 'Khi thầy nói dừng, một bạn mỗi nhóm sẽ trình bày lời giải trước lớp.' },
    { en: 'If you are stuck, raise your hand and I will come to help you.', vi: 'Nếu bị kẹt, các em giơ tay và thầy sẽ đến giúp.' },
    { en: 'Are there any questions?', vi: 'Có câu hỏi nào không?' }
   ] },
 { id: 'DL04', ten: 'Giao bài về nhà', chude: 'Hướng dẫn hoạt động nhóm / giao bài', duyet: 'chua',
   s: [
    { en: 'Before we finish, let me explain your homework.', vi: 'Trước khi kết thúc, thầy giải thích bài tập về nhà.' },
    { en: 'Please do exercises one to five on page thirty.', vi: 'Các em làm bài từ một đến năm, trang ba mươi.' },
    { en: 'Read each question carefully and show every step of your work.', vi: 'Đọc kỹ từng câu hỏi và trình bày mọi bước làm.' },
    { en: 'If you do not understand a question, write it down and bring it to the next lesson.', vi: 'Nếu chưa hiểu câu nào, hãy ghi lại và mang đến buổi sau.' },
    { en: 'Please hand in your notebook on Monday morning.', vi: 'Các em nộp vở vào sáng thứ Hai.' },
    { en: 'Remember that I care more about your thinking than about the final answer.', vi: 'Hãy nhớ thầy quan tâm cách các em suy nghĩ hơn là đáp số cuối cùng.' },
    { en: 'Thank you for your effort today, and see you next time.', vi: 'Cảm ơn nỗ lực của các em hôm nay, hẹn gặp lại.' }
   ] },
 { id: 'DL05', ten: 'Giới thiệu bản thân và khoa tại hội thảo', chude: 'Giới thiệu bản thân và khoa tại hội thảo', duyet: 'chua',
   ghichu: 'Thầy tự điền các chỗ [ ] khi nói (tên, chủ đề nghiên cứu, chủ đề trình bày). Tên tiếng Anh Khoa và Trường do Thầy cung cấp (05/11).',
   s: [
    { en: 'Good afternoon, everyone.', vi: 'Chào mọi người.' },
    { en: 'My name is [your name], and I am a lecturer in mathematics education.', vi: 'Tôi là [tên Thầy], giảng viên về giáo dục Toán.' },
    { en: 'I work at the Faculty of Primary Education, Nghệ An University, in Vietnam.', vi: 'Tôi công tác tại Khoa Tiểu học, Trường Đại học Nghệ An, Việt Nam.' },
    { en: 'I teach mathematics and methods of teaching mathematics to future primary school teachers.', vi: 'Tôi dạy Toán và phương pháp dạy học Toán cho các giáo viên tiểu học tương lai.' },
    { en: 'My research is about [your research topic].', vi: 'Nghiên cứu của tôi về [chủ đề nghiên cứu của Thầy].' },
    { en: 'Today I would like to share some ideas about [your topic].', vi: 'Hôm nay tôi muốn chia sẻ vài ý về [chủ đề Thầy trình bày].' },
    { en: 'I am happy to be here, and I look forward to learning from you.', vi: 'Tôi rất vui được có mặt ở đây và mong được học hỏi từ quý vị.' }
   ] },
 { id: 'DL06', ten: 'Giải thích ví dụ: phương trình bậc nhất', chude: 'Giải thích một ví dụ Toán', duyet: 'chua',
   s: [
    { en: 'Let me show you how to solve an equation.', vi: 'Thầy sẽ chỉ cách giải một phương trình.' },
    { en: 'We have two x plus three equals eleven.', vi: 'Ta có hai x cộng ba bằng mười một.' },
    { en: 'Our goal is to find the value of x.', vi: 'Mục tiêu là tìm giá trị của x.' },
    { en: 'First, we subtract three from both sides, so two x equals eight.', vi: 'Trước hết, trừ ba ở cả hai vế, nên hai x bằng tám.' },
    { en: 'Then we divide both sides by two, so x equals four.', vi: 'Sau đó chia cả hai vế cho hai, nên x bằng bốn.' },
    { en: 'Finally, we check our answer.', vi: 'Cuối cùng, ta kiểm tra đáp số.' },
    { en: 'Two times four is eight, and eight plus three is eleven.', vi: 'Hai nhân bốn là tám, tám cộng ba là mười một.' },
    { en: 'So the solution is correct.', vi: 'Vậy nghiệm này đúng.' },
    { en: 'Remember: we must do the same thing to both sides to keep the equation balanced, and we never divide by zero.', vi: 'Nhớ rằng: phải làm cùng một phép tính ở cả hai vế để phương trình vẫn cân bằng, và không bao giờ chia cho không.' }
   ] }
];
