import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Bharat Chandru Poojari | Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#08070b',
          color: '#e8e4dd',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 82px',
          width: '100%',
        }}
      >
        <div style={{ color: '#e4623f', display: 'flex', fontSize: 24, letterSpacing: 8 }}>
          BHARAT // PORTFOLIO
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#e4623f', display: 'flex', fontSize: 30, marginBottom: 18 }}>
            FULL STACK DEVELOPER
          </div>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            Bharat Chandru Poojari
          </div>
          <div style={{ color: '#aaa5a0', display: 'flex', fontSize: 28, marginTop: 24 }}>
            Node.js · React.js · MongoDB · AI Integration
          </div>
        </div>

        <div style={{ color: '#6f6b69', display: 'flex', fontSize: 22 }}>
          bharat-poojari.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}