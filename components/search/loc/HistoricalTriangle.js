import { useTheme } from "@material-ui/core"

export default function HistoricalTriangle({ show }) {
  const theme = useTheme()

  return <div
    style={{
      opacity: show === true ? '1' : '0',
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shortest,
      }),
      width: 0,
      height: 0,
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderBottom: '13px solid',
      borderBottomColor: theme.palette.primary.light
    }}
  />
}