export default function VLine(props) {
  return <div
    style={{
      borderLeft: '1px solid grey',
      height: props.height || 80,
    }}
  />

}