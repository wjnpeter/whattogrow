
export default function UnitSwitch(props) {
  const [unit, setUnit] = useState('c')
  
  const handleClick = (e) => {
    setUnit(e.target.value === 'f' ? 'f' : 'c')
  }

  return <ButtonBase value={unit} onClick={handleClick}>
    <Typography variant="caption" children='°C' />
    {'/'}
    <Typography variant="caption" children='°F' />
  </ButtonBase>
}