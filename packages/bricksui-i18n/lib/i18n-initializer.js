import enUS from "./lang/en-US";
import zhCN from "./lang/zh-CN";


var i18n = Ember.Namespace.create();

i18n.lang = i18n.lang || {};

i18n.lang['en-US'] = enUS;
i18n.lang['zh-CN'] = zhCN;

export default i18n;