import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 48,
  height: 48,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#08070b',
          border: '2px solid #e4623f',
          color: '#e8e4dd',
          display: 'flex',
          fontFamily: 'sans-serif',
          fontSize: 19,
          fontWeight: 700,
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        BP
      </div>
    ),
    {
      ...size,
    },
  );
}