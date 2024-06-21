import useSWR from 'swr'
import qs from 'qs'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller';

import { useContext, useEffect, useState } from 'react';
import { GridList } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import PlantPage from './PlantPage'
import AppContext from '../../lib/contexts'
import { fetchers } from '../../lib/apiFetchers'

const useStyles = makeStyles((theme) => ({
  gridList: {
    justifyContent: 'space-around',
    margin: theme.spacing('auto', 1)
  },
}));

export default function Plants(props) {
  const classes = useStyles();
  const appContext = useContext(AppContext) 
  const [pages, setPages] = useState(0)

  // : ApiSeedFilter
  const filter = {
    month: props.month,
    tempZone: props.tempZone,
    ids: props.ids,
    page: 0,
  }
  
  const { data: plants } = useSWR([qs.stringify(filter), appContext.token], fetchers.seeds)

  let plantPages = []
  for (let p = 0; p <= pages; ++p) {
    plantPages.push(<PlantPage key={p} {...props} page={p} />)
  }

  return (
    <div>
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={p => setPages(p)}
        hasMore={plants ? pages < plants.pageCount - 1 : false}
      >
        <GridList cellHeight={284} className={classes.gridList} cols={4}>
          {plantPages}
        </GridList>
      </InfiniteScroll>
    </div>
  );
}