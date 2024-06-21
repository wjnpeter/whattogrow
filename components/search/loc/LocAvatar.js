export default function LocAvatar({ src }) {
  if (src == null) return <></>

  const alt = src.split(/[\\\/]/).pop();
  return <img
    variant='square'
    alt={alt}
    src={src}
    style={{
      height: 40,
      maxWidth: 48,
      marginBottom: '0.25rem',
      marginTop: '0.25rem'
    }}
  />
}