import { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core'

import LocZone from './LocZone'
import Historical from './Historical'
import Agriculture from './Agriculture'
import Soil from './Soil'
import AppContext from '../../../lib/contexts'
import { soilDataType } from '../../../lib/utils'


const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(3, 0, 7)
  },
  section: {
    ...theme.mixins.gutters()
  },
  title: {
    marginBottom: theme.spacing(4)
  }
}));

const hasAgriData = (agri) => agri && agri.data
const hasSoilData = (agri) => {
  if (!hasAgriData(agri)) return false

  return Object.keys(agri.data).some(v => soilDataType.includes(v))
}

export default function Location() {
  const classes = useStyles();
  const appContext = useContext(AppContext)

  if (_.isNil(appContext.geo)) return <></>

  return <>
    <section className={classes.section}>
      <LocZone />
      <Divider className={classes.divider} />
    </section>

    <section className={classes.section}>
      <Typography variant="h6" className={classes.title} children={'Historical Climate'} />
      <Historical />
      <Divider className={classes.divider} />
    </section>

    <section className={classes.section}>
      <Typography variant="h6" className={classes.title} children={'Agriculture'} />
      <Agriculture />
      <Divider className={classes.divider} />
    </section>

      <section className={classes.section}>
        <Typography variant="h6" className={classes.title} children={'Soil'} />
        <Soil />
      </section>

  </>
}