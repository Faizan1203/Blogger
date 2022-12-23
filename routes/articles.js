const express = require("express");
const Article = require("../models/article");
const router = express();
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);
const User = require("../models/users");

router.get("/new", (req, res) => {
  res.render("articles/new_article", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

router.post("/edit/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  const article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    sanitizedHTML: dompurify.sanitize(marked.parse(req.body.markdown)),
  });
  try {
    await article.save();
    res.redirect(`/articles/${article.id}`);
  } catch (e) {
    console.log(e);
    res.render("articles/new_article");
  }
});

router.post("/new", async (req, res) => {
  const article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    sanitizedHTML: dompurify.sanitize(marked.parse(req.body.markdown)),
  });
  try {
    await article.save();
    // if (localStorage.getItem("UID")) {
    console.log("hello");
    const user = User.findById(localStorage.getItem("UID"));
    db
      .collections("users")
      .updateOne(
        { $push: { article: article._id } },
        { new: true, useFindAndModify: false }
      ),
      (err, res) => {};
    // );
    // }
    res.redirect(`/articles/${article.id}`);
  } catch (e) {
    res.render("articles/new_article");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id);
  res.render("articles/article_page", { article: article });
});

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Article.findByIdAndDelete(id);
  res.redirect("/");
});

module.exports = router;
