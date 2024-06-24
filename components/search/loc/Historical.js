import useSWR from 'swr'

import { useContext, useState } from 'react'
import { makeStyles } from '@mui/styles';
import { Collapse, Typography, Grid } from '@mui/material';

import VLine from './VLine'
import Number from './Number'
import LocAvatar from './LocAvatar'
import HistoricalTriangle from './HistoricalTriangle'
import LoadingCircular from '../../LoadingCircular'
import { monthNames } from '../../../lib/utils'
import AppContext from '../../../lib/contexts'
import { fetchers } from '../../../lib/apiFetchers'

const useStyles = makeStyles((theme) => ({
  cardContent: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  yrDetail: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(3, 2)
  },
  section: {
    flexShrink: 0
  },
  sectionTitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  }
}))

const unit = product => product == 139 ? 'mm' : '°C'

const cardType = {
  meanrain: 0,
  ytdrain: 1,
  maxtemp: 2,
  mintemp: 3
}

const content = (uiAbout, meanData) => {
  let number = ''
  let label = ''
  let sublabel = ''

  const data = meanData.data
  const stats = data.stats

  switch (uiAbout) {
    case cardType.meanrain:
      number = stats.annual
      label = 'Last ' + (stats.end - stats.start) + ' Years'
      sublabel = stats.start + ' ~ ' + stats.end
      break
    case cardType.ytdrain:
      const ytd = data.ytd
      number = ytd.annual
      label = 'Year To Day'
      const em = ytd.months.findIndex(m => m === 0)
      sublabel = 'JAN ~ ' + monthNames[em]
      break
    case cardType.maxtemp:
      number = stats.annual
      label = 'Mean Maximum'
      sublabel = 'Last ' + (stats.end - stats.start) + ' Years'
      break
    case cardType.mintemp:
      number = stats.annual
      label = 'Mean Minimum'
      sublabel = 'Last ' + (stats.end - stats.start) + ' Years'
      break
  }

  return <>
    <Number number={number} unit={unit(data.product)} />
    <Typography variant="body1" children={label} />
    <Typography variant="body1" children={sublabel} />
  </>
}

const yrDetail = (uiAbout, meanData, classes) => {
  const data = meanData.data

  const isYTD = uiAbout === cardType.ytdrain
  const months = isYTD ? data.ytd.months : data.stats.months

  return <>
    <Grid container spacing={1} className={classes.yrDetail}>
      {
        months.map((m, i) => {
          if (isYTD && m === 0) return

          return <Grid key={monthNames[i]} item xs={4}>
            <Typography
              variant="body1"
              children={monthNames[i] + ' ' + m + unit(data.about)}
            />
          </Grid>
        })
      }
    </Grid>
  </>
}

export default function Historical(props) {
  const classes = useStyles();
  const [expandedRain, setexpandedRain] = useState(null);
  const [expandedTemp, setexpandedTemp] = useState(null);
  const appContext = useContext(AppContext)

  const geo = appContext.geo
  const token = appContext.token

  const { data: rainStation } = useSWR(
    [geo, (139).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  const { data: meanRain } = useSWR(
    () => [rainStation.data.station.id, 139, token], 
    ([station, product, token]) => fetchers.bomstat(station, product, token)
  )

  const { data: tempStation } = useSWR(
    [geo, (122).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  // FIXME: 36 and 38 are not available
  const { data: meanMaxTemp } = useSWR(
    () => [tempStation.data.station.id, 36, token], 
    ([station, product, token]) => fetchers.bomstat(station, product, token)
  )
  const { data: meanMinTemp } = useSWR(
    () => [tempStation.data.station.id, 38, token], 
    ([station, product, token]) => fetchers.bomstat(station, product, token)
  )

  return (
    <>
      {meanRain === undefined ? <LoadingCircular /> :
        <section className={classes.section}>
          <Typography variant="body1" children={'Rainfall'} className={classes.sectionTitle} />

          <Grid container justify='center' alignItems='center' spacing={5}>
            <Grid item
              onClick={e => setexpandedRain(expandedRain === cardType.meanrain ? null : cardType.meanrain)}
              className={classes.cardContent} >
              <LocAvatar src="/images/icons/rainfall2.svg" />
              {content(cardType.meanrain, meanRain)}

              <HistoricalTriangle show={expandedRain === cardType.meanrain} />
            </Grid>

            <Grid item>
              <VLine />
            </Grid>

            <Grid item
              onClick={e => setexpandedRain(expandedRain === cardType.ytdrain ? null : cardType.ytdrain)}
              className={classes.cardContent} >
              <LocAvatar src="/images/icons/rainfall1.svg" />
              {content(cardType.ytdrain, meanRain)}

              <HistoricalTriangle show={expandedRain === cardType.ytdrain} />
            </Grid>
          </Grid>

          <Collapse in={expandedRain !== null} timeout="auto">
            {yrDetail(expandedRain, meanRain, classes)}
          </Collapse>
        </section>}

      {!meanMinTemp || !meanMaxTemp ? <LoadingCircular /> : <>
        <section className={classes.section}>
          <Typography variant="body1" children={'Temperature'} className={classes.sectionTitle}/>
          <Grid container justify='center' alignItems='center' spacing={5}>
            <Grid item
              onClick={e => setexpandedTemp(expandedTemp === cardType.maxtemp ? null : cardType.maxtemp)}
              className={classes.cardContent} >
              <LocAvatar src="/images/icons/maxtemp.svg" />
              {content(cardType.maxtemp, meanMaxTemp)}

              <HistoricalTriangle show={expandedTemp === cardType.maxtemp} />
            </Grid>

            <Grid item>
              <VLine />
            </Grid>

            <Grid item
              onClick={e => setexpandedTemp(expandedTemp === cardType.mintemp ? null : cardType.mintemp)}
              className={classes.cardContent} >
              <LocAvatar src="/images/icons/mintemp.svg" />
              {content(cardType.mintemp, meanMinTemp)}

              <HistoricalTriangle show={expandedTemp === cardType.mintemp} />
            </Grid>
          </Grid>

          <Collapse in={expandedTemp !== null} timeout="auto">
            {
              yrDetail(expandedTemp, expandedTemp === cardType.maxtemp ? meanMaxTemp : meanMinTemp, classes)
            }
          </Collapse>
        </section>
      </>}
    </>
  );
}