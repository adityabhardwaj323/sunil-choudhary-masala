const htmlEscape = require('./utils/htmlEscape');
const templates = require('./utils/emailTemplates');

console.log("Escape test:");
console.log(htmlEscape('<script>alert(1)</script>'));

console.log("\nTemplate test:");
console.log(templates.welcomeEmail('<img src=x onerror=alert(1)>'));
