/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'xs': ['12px', '16px'],
      'sm': ['15px', '18px'],
      'base': ['16px', '24px'],
      'lg': ['18px', '28px'],
      'xl': ['20px', '32px'],
      '2xl': ['24px', '36px'],
      '3xl': ['30px', '42px'],
      '4xl': ['32px', '40px'],
      '5xl': ['48px', '56px'],
      '6xl': ['64px', '72px'],
      '7xl': ['96px', '104px'],
      '8xl': ['128px', '136px'],
      '9xl': ['192px', '200px'],
    },
    extend: {
      content: {
        'custom-text0': '"Nghe nội dung này"',
        'custom-text1': '"Xem thêm nội dung tương tự"',
        'custom-text2': '"Ẩn bớt nội dung tương tự"',
        'custom-text3': '"Chia sẻ câu chuyện này"',
        'custom-text4': '"Xem thêm"',
        
      },
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px',
        'customKhamPha' : '0px 4px 24px rgba(0, 0, 0, 0.26)',
      }
    },
  },
  plugins: [],
}