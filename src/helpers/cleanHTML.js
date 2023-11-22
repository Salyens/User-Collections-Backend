const sanitizeHtml = require("sanitize-html");

const cleanHtml = (html) => {
  const clean = sanitizeHtml(html, {
    allowedTags: false,
    allowedAttributes: false,
    exclusiveFilter: function (frame) {
      return frame.tag === "script";
    },
  });

  return clean;
};
module.exports = cleanHtml;
