const fs = require("fs");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

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
  console.log("TEST");

  const { user, link } = data;
  const userfullname = user.fullname.split(" "); //first_name, last_name
  // const username = Vangel Hristov
  // ["Vangel", "Hristov"]
  const firstName = userfullname[0]; // Vangel
  const lastName = userfullname[1]; // Hristov

  let regexName = new RegExp(`\{\{first_name\}\}`, "g");
  let regexLastname = new RegExp(`\{\{last_name\}\}`, "g");
  let regexLink = new RegExp(`\{\{link\}\}`, "g");

  content = content.replace(regexName, firstName);
  content = content.replace(regexLastname, lastName);
  content = content.replace(regexLink, link);

  let options = {
    from: config.getSection("development").sender_email,
    to: to,
    subject: title,
    html: content,
  };

  console.log(options);

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
  return new Promise((success, fail) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) return fail(err);
      return success(data);
    });
  });
};

module.exports = {
  sendMail,
};
