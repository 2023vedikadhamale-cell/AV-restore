import './globals.css';
import Navbar from '@/components/ui/Navbar';
import CustomCursor from '@/components/ui/CustomCursor';
import LoadingScreen from '@/components/ui/LoadingScreen';

export const metadata = {
  title: 'AV-Restoration | Audio-Visual Packet Loss Concealment',
  description: 'A cross-modal deep learning pipeline that restores audio and video corrupted by network packet loss. View the research, pipeline, metrics, and live demos.',
  keywords: ['packet loss concealment', 'audio-visual restoration', 'deep learning', 'Wav2Vec2', 'VAE', 'research'],
  openGraph: {
    title: 'AV-Restoration | Audio-Visual Packet Loss Concealment',
    description: 'Cross-modal deep learning pipeline for restoring corrupted audio-visual streams.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
