module.exports = {
  moment:{
    basePath:"moment",
    scripts:["min/moment-with-langs.js"]
  },

  chosen: {
    basePath:"chosen",
    scripts: ["chosen.jquery.js"],
    styles: ["chosen.css"],
    vendor: ["chosen-sprite.png","chosen-sprite@2x.png"]
  },

  bootstrap:{
    basePath:"bootstrap",
    scripts:["dist/js/bootstrap.js"],
    styles:["dist/css/bootstrap.css"],
    vendor:["/fonts/*"]
  },

  "ember-i18n":{
    basePath:"ember-i18n",
    scripts:["lib/i18n.js"]
  }
}