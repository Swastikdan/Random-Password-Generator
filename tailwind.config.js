/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html" ,"./404.html","./assets/main.js" ,"./public/**/*.{html,js}", "node_modules/preline/dist/*.js"],
  mode: 'jit',
 
  theme: {
    extend: {},
  },
  plugins: [ require('preline/plugin'),
  require('flowbite/plugin')],
}

