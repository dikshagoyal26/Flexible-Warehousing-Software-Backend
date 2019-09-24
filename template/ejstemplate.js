function template(name, job) {
  const ejs = require("ejs");
  ejs.renderFile("../views/jobtemplate.ejs", { name: name, job: job }, function(
    err,
    str
  ) {
    if (err) {
      console.log("error", err);
    } else {
      console.log("data is", str);
    }
    // str => Rendered HTML string
  });
  //   var html = ejs.render("../views/jobtemplate.ejs", { name: name, job: job });
  //   console.log("HTML is", html);
  //   return html;
}

template("ram", "se");
