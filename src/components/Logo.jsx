import appLogo from '../assets/app-logo.png';

// The exported PNG is a 141x172 canvas with drop-shadow bleed baked in
// around a 105x105 mark positioned at (18, 3) - crop to just the mark
// and apply a clean CSS shadow instead of relying on the raster blur.
const NATIVE_W = 141;
const NATIVE_H = 172;
const MARK_X = 18;
const MARK_Y = 3;
const MARK_SIZE = 105;

export default function Logo({ size = 105 }) {
  const scale = size / MARK_SIZE;
  return (
    <div
      className="relative overflow-hidden shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * (18 / 105),
        boxShadow: '0 3px 3px rgba(0,0,0,0.10), 0 12px 6px rgba(0,0,0,0.09), 0 27px 8px rgba(0,0,0,0.02)',
      }}
    >
      <img
        src={appLogo}
        alt="Split Up"
        style={{
          position: 'absolute',
          left: -MARK_X * scale,
          top: -MARK_Y * scale,
          width: NATIVE_W * scale,
          height: NATIVE_H * scale,
          maxWidth: 'none',
        }}
      />
    </div>
  );
}
