const fs = require("fs");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

// const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
const config = require("../config");

const mailTemplates = {
  PASSWORD_TEMPLATE: {
    title: "Your password reset link has been generated",
    template: "reset_password.html",
  },
  WELCOME: {
    title: "Welcome to our website",
    template: "welcome.html",
  },
};

const sendMail = async (to, type, data) => {
  const mg = mailgun.client({
    username: "api",
    key:
      config.getSection("development").api_key ||
      "key-08845b24f1f301c0858e3817a184507e",
  });

  let title = mailTemplates[type].title;
  let templatePath = `${__dirname}/../../email_templates/${mailTemplates[type].template}`;
  let content = await readTemplate(templatePath);

  // data: {
  //first_name: Test
  //last_name: TESTING
  //email: test@gmail.com
  //}

  for (let i in data) {
    //trae 3 pati
    //firstname
    //lastname
    //email
    let regex = new RegExp(`\{\{${i}\}\}`, "g");
    content = content.replace(regex, data[i]);
  }

  let options = {
    from: config.getSection("development").sender_email,
    to: to,
    subject: title,
    // text
    html: content,
  };

  try {
    const res = await mg.messages.create(
      config.getSection("development").domain,
      options
    );

    return res;
  } catch (err) {
    throw err;
  }
};

const readTemplate = async (file) => {
  //vrati nov promise so fajlot
};

module.exports = {
  sendMail,
};
