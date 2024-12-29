// tailwind.config.js
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  variants: {
    extend: {
      backgroundColor: ['hover'], 
      textColor: ['hover'], 
      borderColor: ['hover'],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
