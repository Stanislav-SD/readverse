import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontSize: {
			'8xl' : '60px'
		},
		width: {
			'8xl' : '120px'
		},
		height: {
			'8xl' : '120px'
		},
  		backgroundImage: {
  			'custom-gradient': 'linear-gradient(270deg, #000000 5%, #6F4E37 20%, #6F4E37 48.94%, #6F4E37 64.47%, #6F4E37 80%, #000000 95%)',
  			'navbar-gradient': 'radial-gradient(50% 50% at 50% 50%, #B57F59 0%, #6F4E37 100%)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		screens: {
  			xl1800: {
  				max: '1799px'
  			},
  			xl1296: {
  				max: '1296px'
  			}
  		},
  		fontFamily: {
  			boomster: [
  				'BOOMSTER',
  				'sans-serif'
  			],
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			interlight: [
  				'Interlight',
  				'sans-serif'
  			],
  			navbar: [
  				'Navbar',
  				'sans-serif'
  			],
  			jaro: [
  				'Jaro',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	screens: {
		xxs: '300px',
  		xs: '480px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1480px',
  		'3xl': '1540px',
		'4xl': '1920px',
		'5xl': '2500px',
  	}
  },
} satisfies Config;
