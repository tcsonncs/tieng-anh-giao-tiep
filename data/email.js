// 12 mẫu email (giai đoạn 4, đợt B) — CHƯA DUYỆT: duyet='chua'. Soạn nháp 05/11/2026, chờ Thầy duyệt và soat-chung.
// Mỗi mẫu: loai (4 loại), ten, boicanh, tieude/tieudevi, doan = [ {en, vi} ] (en/vi có thể có xuống dòng), cum = 3 cụm hay dùng.
// Chỗ [nhãn] là ô Thầy điền trong app (nhãn viết tiếng Việt, không chứa dấu [ ]); cùng nhãn = cùng một ô. Chữ số viết bằng chữ cho máy đọc.
// Không có tên người thật, số điện thoại, email thật. Tên tiếng Anh Khoa/Trường: Faculty of Primary Education, Nghệ An University (Thầy xác nhận 05/11).
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.email = [
 {
  "id": "EM01",
  "loai": "Email cho sinh viên / đồng nghiệp",
  "ten": "Nhắc nộp bài",
  "duyet": "chua",
  "boicanh": "Nhắc sinh viên sắp đến hạn nộp một bài tập.",
  "tieude": "Reminder: [tên bài tập] is due on [hạn nộp]",
  "tieudevi": "Nhắc: [tên bài tập] đến hạn nộp vào [hạn nộp]",
  "doan": [
   {
    "en": "Dear [tên sinh viên],",
    "vi": "Chào em [tên sinh viên],"
   },
   {
    "en": "This is a friendly reminder that the assignment [tên bài tập] is due on [hạn nộp].",
    "vi": "Đây là lời nhắc nhẹ: bài tập [tên bài tập] đến hạn nộp vào [hạn nộp]."
   },
   {
    "en": "Please submit your work through [cách nộp bài]. If you have any questions, please let me know.",
    "vi": "Em nộp bài qua [cách nộp bài]. Nếu có câu hỏi, em cho thầy biết."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "This is a friendly reminder that…",
    "vi": "Đây là lời nhắc nhẹ rằng…"
   },
   {
    "en": "Please submit your work through…",
    "vi": "Em hãy nộp bài qua…"
   },
   {
    "en": "If you have any questions, please let me know.",
    "vi": "Nếu có câu hỏi, em cho thầy biết."
   }
  ]
 },
 {
  "id": "EM02",
  "loai": "Email cho sinh viên / đồng nghiệp",
  "ten": "Báo đổi phòng hoặc giờ học",
  "duyet": "chua",
  "boicanh": "Báo cả lớp (hoặc đồng nghiệp) lớp học đổi phòng và giờ.",
  "tieude": "Change of room and time for [môn học]",
  "tieudevi": "Đổi phòng và giờ học môn [môn học]",
  "doan": [
   {
    "en": "Dear all,",
    "vi": "Chào các em,"
   },
   {
    "en": "Please note that there is a change for our [môn học] class on [ngày học]. The class will be in room [phòng mới] at [giờ mới], instead of room [phòng cũ] at [giờ cũ].",
    "vi": "Các em lưu ý: lớp [môn học] ngày [ngày học] có thay đổi. Lớp sẽ học ở phòng [phòng mới] lúc [giờ mới], thay vì phòng [phòng cũ] lúc [giờ cũ]."
   },
   {
    "en": "Sorry for the inconvenience. Please let your classmates know.",
    "vi": "Xin lỗi vì sự bất tiện. Các em nhớ báo cho các bạn khác."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "Please note that there is a change…",
    "vi": "Xin lưu ý là có một thay đổi…"
   },
   {
    "en": "instead of room…",
    "vi": "thay vì phòng…"
   },
   {
    "en": "Sorry for the inconvenience.",
    "vi": "Xin lỗi vì sự bất tiện."
   }
  ]
 },
 {
  "id": "EM03",
  "loai": "Email cho sinh viên / đồng nghiệp",
  "ten": "Gửi tài liệu kèm",
  "duyet": "chua",
  "boicanh": "Gửi tài liệu đọc trước cho sinh viên.",
  "tieude": "Materials for [tên bài học]",
  "tieudevi": "Tài liệu cho [tên bài học]",
  "doan": [
   {
    "en": "Dear [tên sinh viên],",
    "vi": "Chào em [tên sinh viên],"
   },
   {
    "en": "Please find attached the materials for [tên bài học]: [tên tài liệu].",
    "vi": "Thầy gửi kèm tài liệu cho [tên bài học]: [tên tài liệu]."
   },
   {
    "en": "Please read them before our next class on [ngày học]. Let me know if you cannot open the file.",
    "vi": "Em đọc trước buổi học sau vào [ngày học]. Nếu không mở được file, em cho thầy biết."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "Please find attached…",
    "vi": "Xin xem tài liệu đính kèm…"
   },
   {
    "en": "Please read them before our next class",
    "vi": "Em đọc trước buổi học sau."
   },
   {
    "en": "Let me know if you cannot open the file.",
    "vi": "Nếu không mở được file, em cho thầy biết."
   }
  ]
 },
 {
  "id": "EM04",
  "loai": "Email với giảng viên nước ngoài",
  "ten": "Xin hẹn gặp trao đổi",
  "duyet": "chua",
  "boicanh": "Xin một giảng viên nước ngoài một buổi gặp ngắn.",
  "tieude": "Request for a short meeting about [chủ đề trao đổi]",
  "tieudevi": "Xin hẹn gặp ngắn về [chủ đề trao đổi]",
  "doan": [
   {
    "en": "Dear [danh xưng + họ, vd. Dr Smith],",
    "vi": "Kính gửi [danh xưng + họ, vd. Dr Smith],"
   },
   {
    "en": "I hope this email finds you well. I am writing to ask if we could meet to talk about [chủ đề trao đổi].",
    "vi": "Mong thư này đến khi thầy/cô khỏe. Tôi viết thư để hỏi liệu chúng ta có thể gặp để trao đổi về [chủ đề trao đổi]."
   },
   {
    "en": "Would [ngày giờ đề nghị] be convenient for you? The meeting would take about [thời lượng]. If that time is not suitable, I am happy to adjust to your schedule.",
    "vi": "Thời gian [ngày giờ đề nghị] có thuận tiện cho thầy/cô không? Buổi gặp kéo dài khoảng [thời lượng]. Nếu không phù hợp, tôi sẵn sàng điều chỉnh theo lịch của thầy/cô."
   },
   {
    "en": "Thank you very much for your time.",
    "vi": "Xin cảm ơn thầy/cô đã dành thời gian."
   },
   {
    "en": "Best regards,\nTCSơn\nFaculty of Primary Education, Nghệ An University",
    "vi": "Trân trọng,\nTCSơn\nKhoa Giáo dục Tiểu học, Trường Đại học Nghệ An"
   }
  ],
  "cum": [
   {
    "en": "I hope this email finds you well.",
    "vi": "Mong thư này đến khi thầy/cô khỏe."
   },
   {
    "en": "Would … be convenient for you?",
    "vi": "… có thuận tiện cho thầy/cô không?"
   },
   {
    "en": "I am happy to adjust to your schedule.",
    "vi": "Tôi sẵn sàng điều chỉnh theo lịch của thầy/cô."
   }
  ]
 },
 {
  "id": "EM05",
  "loai": "Email với giảng viên nước ngoài",
  "ten": "Mời dự seminar hoặc giờ dạy",
  "duyet": "chua",
  "boicanh": "Mời giảng viên nước ngoài dự một seminar hoặc giờ dạy ở Khoa.",
  "tieude": "Invitation to [tên sự kiện]",
  "tieudevi": "Thư mời dự [tên sự kiện]",
  "doan": [
   {
    "en": "Dear [danh xưng + họ, vd. Dr Smith],",
    "vi": "Kính gửi [danh xưng + họ, vd. Dr Smith],"
   },
   {
    "en": "I would like to invite you to [tên sự kiện] at our faculty. It will take place on [ngày giờ] in room [phòng].",
    "vi": "Tôi xin mời thầy/cô dự [tên sự kiện] tại Khoa chúng tôi. Sự kiện diễn ra vào [ngày giờ] tại phòng [phòng]."
   },
   {
    "en": "The topic is [chủ đề]. We would be very happy if you could join us and share your comments afterwards.",
    "vi": "Chủ đề là [chủ đề]. Chúng tôi sẽ rất vui nếu thầy/cô tham dự và góp ý sau đó."
   },
   {
    "en": "Please let me know if you are able to attend. I would be glad to send you more details.",
    "vi": "Xin thầy/cô cho tôi biết có thể tham dự không. Tôi sẵn lòng gửi thêm thông tin chi tiết."
   },
   {
    "en": "Best regards,\nTCSơn\nFaculty of Primary Education, Nghệ An University",
    "vi": "Trân trọng,\nTCSơn\nKhoa Giáo dục Tiểu học, Trường Đại học Nghệ An"
   }
  ],
  "cum": [
   {
    "en": "I would like to invite you to…",
    "vi": "Tôi xin mời thầy/cô dự…"
   },
   {
    "en": "We would be very happy if you could join us.",
    "vi": "Chúng tôi sẽ rất vui nếu thầy/cô tham dự."
   },
   {
    "en": "Please let me know if you are able to attend.",
    "vi": "Xin thầy/cô cho tôi biết có thể tham dự không."
   }
  ]
 },
 {
  "id": "EM06",
  "loai": "Email với giảng viên nước ngoài",
  "ten": "Cảm ơn sau buổi làm việc",
  "duyet": "chua",
  "boicanh": "Cảm ơn giảng viên nước ngoài sau một buổi gặp, nhắc việc đã thống nhất.",
  "tieude": "Thank you for our meeting",
  "tieudevi": "Cảm ơn về buổi làm việc của chúng ta",
  "doan": [
   {
    "en": "Dear [danh xưng + họ, vd. Dr Smith],",
    "vi": "Kính gửi [danh xưng + họ, vd. Dr Smith],"
   },
   {
    "en": "Thank you very much for meeting with me [thời điểm gặp, vd. yesterday]. I really appreciate your time and your helpful advice on [nội dung được góp ý].",
    "vi": "Xin cảm ơn thầy/cô rất nhiều đã gặp tôi [thời điểm gặp, vd. yesterday]. Tôi thật sự trân trọng thời gian và lời khuyên hữu ích của thầy/cô về [nội dung được góp ý]."
   },
   {
    "en": "As we agreed, I will send you [việc sẽ gửi] by [hạn gửi]. I look forward to working with you.",
    "vi": "Như đã thống nhất, tôi sẽ gửi thầy/cô [việc sẽ gửi] trước [hạn gửi]. Tôi mong được làm việc cùng thầy/cô."
   },
   {
    "en": "Best regards,\nTCSơn\nFaculty of Primary Education, Nghệ An University",
    "vi": "Trân trọng,\nTCSơn\nKhoa Giáo dục Tiểu học, Trường Đại học Nghệ An"
   }
  ],
  "cum": [
   {
    "en": "Thank you very much for meeting with me",
    "vi": "Xin cảm ơn thầy/cô rất nhiều đã gặp tôi."
   },
   {
    "en": "I really appreciate your time.",
    "vi": "Tôi thật sự trân trọng thời gian của thầy/cô."
   },
   {
    "en": "I look forward to working with you.",
    "vi": "Tôi mong được làm việc cùng thầy/cô."
   }
  ]
 },
 {
  "id": "EM07",
  "loai": "Thông báo lớp",
  "ten": "Thông báo nghỉ dạy",
  "duyet": "chua",
  "boicanh": "Báo cả lớp nghỉ một buổi.",
  "tieude": "Class cancelled on [ngày nghỉ]",
  "tieudevi": "Lớp nghỉ ngày [ngày nghỉ]",
  "doan": [
   {
    "en": "Dear students,",
    "vi": "Chào các em,"
   },
   {
    "en": "I am sorry to inform you that our [môn học] class on [ngày nghỉ] is cancelled because [lý do].",
    "vi": "Thầy rất tiếc báo là lớp [môn học] ngày [ngày nghỉ] nghỉ vì [lý do]."
   },
   {
    "en": "Please read [nội dung tự học] on your own. I will tell you about the make-up class soon.",
    "vi": "Các em tự đọc [nội dung tự học]. Thầy sẽ báo sớm về buổi học bù."
   },
   {
    "en": "If you have any questions, please send me an email.",
    "vi": "Nếu có câu hỏi, các em gửi email cho thầy."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "I am sorry to inform you that…",
    "vi": "Thầy rất tiếc báo là…"
   },
   {
    "en": "is cancelled because…",
    "vi": "nghỉ vì…"
   },
   {
    "en": "I will tell you about the make-up class soon.",
    "vi": "Thầy sẽ báo sớm về buổi học bù."
   }
  ]
 },
 {
  "id": "EM08",
  "loai": "Thông báo lớp",
  "ten": "Thông báo dạy bù",
  "duyet": "chua",
  "boicanh": "Báo lịch học bù cho cả lớp.",
  "tieude": "Make-up class for [môn học]",
  "tieudevi": "Buổi học bù môn [môn học]",
  "doan": [
   {
    "en": "Dear students,",
    "vi": "Chào các em,"
   },
   {
    "en": "We will have a make-up class for [môn học] on [ngày bù] at [giờ bù] in room [phòng].",
    "vi": "Lớp [môn học] sẽ học bù vào [ngày bù] lúc [giờ bù] tại phòng [phòng]."
   },
   {
    "en": "Please bring [đồ cần mang]. If you cannot come, please tell me before the class.",
    "vi": "Các em mang theo [đồ cần mang]. Nếu không đến được, các em báo thầy trước buổi học."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "We will have a make-up class…",
    "vi": "Chúng ta sẽ có một buổi học bù…"
   },
   {
    "en": "Please bring…",
    "vi": "Các em hãy mang theo…"
   },
   {
    "en": "If you cannot come, please tell me before the class.",
    "vi": "Nếu không đến được, các em báo thầy trước buổi học."
   }
  ]
 },
 {
  "id": "EM09",
  "loai": "Thông báo lớp",
  "ten": "Thông báo lịch kiểm tra",
  "duyet": "chua",
  "boicanh": "Báo ngày giờ, phòng và nội dung bài kiểm tra.",
  "tieude": "Test schedule for [môn học]",
  "tieudevi": "Lịch kiểm tra môn [môn học]",
  "doan": [
   {
    "en": "Dear students,",
    "vi": "Chào các em,"
   },
   {
    "en": "The test for [môn học] will be on [ngày kiểm tra] at [giờ kiểm tra] in room [phòng]. It will take about [thời lượng].",
    "vi": "Bài kiểm tra môn [môn học] sẽ diễn ra vào [ngày kiểm tra] lúc [giờ kiểm tra] tại phòng [phòng]. Thời gian làm bài khoảng [thời lượng]."
   },
   {
    "en": "The test covers [nội dung kiểm tra]. Please bring [dụng cụ được mang] and arrive ten minutes early.",
    "vi": "Bài kiểm tra gồm [nội dung kiểm tra]. Các em mang theo [dụng cụ được mang] và đến sớm mười phút."
   },
   {
    "en": "Good luck to everyone!",
    "vi": "Chúc cả lớp làm bài tốt!"
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "The test will be on…",
    "vi": "Bài kiểm tra sẽ diễn ra vào…"
   },
   {
    "en": "The test covers…",
    "vi": "Bài kiểm tra gồm…"
   },
   {
    "en": "Good luck to everyone!",
    "vi": "Chúc cả lớp làm bài tốt!"
   }
  ]
 },
 {
  "id": "EM10",
  "loai": "Nhận xét bài làm ngắn",
  "ten": "Nhận xét: bài làm tốt",
  "duyet": "chua",
  "boicanh": "Nhận xét ngắn cho bài làm tốt.",
  "tieude": "Feedback on your [tên bài]",
  "tieudevi": "Nhận xét về [tên bài] của em",
  "doan": [
   {
    "en": "Dear [tên sinh viên],",
    "vi": "Chào em [tên sinh viên],"
   },
   {
    "en": "Thank you for submitting your [tên bài]. Well done! Your work is clear and well organised.",
    "vi": "Cảm ơn em đã nộp [tên bài]. Làm tốt lắm! Bài của em rõ ràng và có tổ chức tốt."
   },
   {
    "en": "I especially liked [điểm làm tốt]. To improve it even more, you could [gợi ý thêm, vd. add examples].",
    "vi": "Thầy đặc biệt thích [điểm làm tốt]. Để bài tốt hơn nữa, em có thể [gợi ý thêm, vd. add examples]."
   },
   {
    "en": "Keep up the good work.",
    "vi": "Em hãy tiếp tục phát huy."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "Well done!",
    "vi": "Làm tốt lắm!"
   },
   {
    "en": "I especially liked…",
    "vi": "Thầy đặc biệt thích…"
   },
   {
    "en": "Keep up the good work.",
    "vi": "Em hãy tiếp tục phát huy."
   }
  ]
 },
 {
  "id": "EM11",
  "loai": "Nhận xét bài làm ngắn",
  "ten": "Nhận xét: cần sửa",
  "duyet": "chua",
  "boicanh": "Nhận xét bài làm cần sửa, nêu hạn nộp lại.",
  "tieude": "Feedback on your [tên bài]: please revise",
  "tieudevi": "Nhận xét về [tên bài] của em: em sửa lại",
  "doan": [
   {
    "en": "Dear [tên sinh viên],",
    "vi": "Chào em [tên sinh viên],"
   },
   {
    "en": "Thank you for your [tên bài]. You have made a good start, but some parts need to be revised.",
    "vi": "Cảm ơn em về [tên bài]. Em đã có một khởi đầu tốt, nhưng một số phần cần sửa."
   },
   {
    "en": "Please check [phần cần sửa]. For example, [ví dụ lỗi]. Please send me the new version by [hạn nộp lại].",
    "vi": "Em kiểm tra lại [phần cần sửa]. Ví dụ, [ví dụ lỗi]. Em gửi thầy bản mới trước [hạn nộp lại]."
   },
   {
    "en": "If you would like to discuss it, you are welcome to come and talk to me.",
    "vi": "Nếu em muốn trao đổi thêm, em cứ đến gặp thầy."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "You have made a good start.",
    "vi": "Em đã có một khởi đầu tốt."
   },
   {
    "en": "Some parts need to be revised.",
    "vi": "Một số phần cần sửa."
   },
   {
    "en": "Please send me the new version by…",
    "vi": "Em gửi thầy bản mới trước…"
   }
  ]
 },
 {
  "id": "EM12",
  "loai": "Nhận xét bài làm ngắn",
  "ten": "Nhận xét: nộp muộn",
  "duyet": "chua",
  "boicanh": "Nhắc nhẹ khi sinh viên nộp bài muộn.",
  "tieude": "Late submission of [tên bài]",
  "tieudevi": "Nộp muộn [tên bài]",
  "doan": [
   {
    "en": "Dear [tên sinh viên],",
    "vi": "Chào em [tên sinh viên],"
   },
   {
    "en": "I received your [tên bài] on [ngày nhận], after the deadline on [hạn nộp].",
    "vi": "Thầy nhận được [tên bài] của em vào [ngày nhận], sau hạn nộp là [hạn nộp]."
   },
   {
    "en": "Please try to submit on time in the future. If there was a problem, please let me know, and we can talk about it.",
    "vi": "Lần sau em cố gắng nộp đúng hạn. Nếu có vấn đề gì, em cho thầy biết để chúng ta trao đổi."
   },
   {
    "en": "Best regards,\nTCSơn",
    "vi": "Trân trọng,\nTCSơn"
   }
  ],
  "cum": [
   {
    "en": "after the deadline",
    "vi": "sau hạn nộp"
   },
   {
    "en": "Please try to submit on time in the future.",
    "vi": "Lần sau em cố gắng nộp đúng hạn."
   },
   {
    "en": "If there was a problem, please let me know.",
    "vi": "Nếu có vấn đề gì, em cho thầy biết."
   }
  ]
 }
];
