const mailer = require("nodemailer");
const mail = require("../config/mail");

const mailsend = {
  sendmail: function (tomail) {
    let transpoter = mailer.createTransport({
      service: "Naver",
      port: 587, // 25 587
      host: "smtp.naver.com",
      auth: {
        user: mail.user,
        pass: mail.password,
      },
    });
    let mailoption = {
      from: mail.user,
      to: tomail.toEmail,
      subject: tomail.subject,
      text: tomail.text,
    };
    transpoter.sendMail(mailoption, (err, info) => {
      if (err) console.log(err);
      else console.log("send success", info.response);
    });
  },
};

module.exports = mailsend;
