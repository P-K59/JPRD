import './globals.css';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'JPRD Foundation | Creating Opportunities. Building Stronger Communities.',
  description: 'JPRD Foundation works towards meaningful social development through education, skills, rural development and community empowerment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
