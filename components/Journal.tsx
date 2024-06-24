import _ from "lodash"
import useSWR from 'swr'

import { useState, useContext, useEffect } from 'react'
import {
  Typography, Fab, Container, TextField, Paper, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider,
  Theme
} from '@mui/material'
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DateFnsUtils from '@date-io/date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';

import AppContext from '../lib/contexts'
import { fetchers } from '../lib/apiFetchers'
import { firebase } from '../lib/firebaseApp'
import { DocumentData, addDoc, collection, getDocs } from 'firebase/firestore'

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: "center",
    margin: theme.spacing(4)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

});

interface Props extends WithStyles<typeof styles> {

}

export const actions = {
  Water: "Water",
  Plant: "Plant",
  Weeding: "Weeding",
  Fertilize: "Fertilize",
  PestControl: "Pest Control",
  Transplant: "Transplant",
  Mulch: "Mulch",
  Prune: "Prune"
}

const makeNoteEl = (note: any) => {
  const dt = note.date.toDate()
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let month = monthNames[dt.getMonth()];
  let day = String(dt.getDate()).padStart(2, '0');
  let year = dt.getFullYear();

  return <TimelineItem>
    <TimelineOppositeContent>
      <Typography >
        {`${day} ${month} ${year}`}
      </Typography>
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot>
        <Avatar
          alt={note.action}
          src={'images/icons/action/' + note.action.toLowerCase() + '.png'}
        />
      </TimelineDot>
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      <Paper>
        <Typography >
          {note.action}
        </Typography>
        <Typography>
          {note.note}
        </Typography>
      </Paper>
    </TimelineContent>
  </TimelineItem>
}

const makeNotesEl = (notes: any) => {
  return notes.map((note: any) => {
    return <>
      <Typography>{note.plant}</Typography>
      <Timeline align="alternate">
        {makeNoteEl(note)}
      </Timeline>
    </>
  })
}

function Journal(props: Props) {
  const appContext = useContext(AppContext)
  const classes = props.classes
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date('2014-08-18T21:11:54')
  );
  const [plant, setPlant] = useState<string | null>(null);
  const [plantOptions, setPlantOptions] = useState<string[]>([])

  const [action, setAction] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // note list
  const [notes, setNotes] = useState<any>([])

  useEffect(() => {
    fetchers.seeds(null, appContext.token)
      .then(res => res.data)
      .then(plants => setPlantOptions(plants.map((p: any) => p.name)))
  }, [])

  useEffect(() => {
    async function fetchNotes() {
      const db = firebase.db;
      const snap = await getDocs(collection(db, "note"))

      const noteDatas: DocumentData[] = []
      snap.forEach((doc) => {
        noteDatas.push(doc.data())
      })

      const sortedNotes = noteDatas.sort((a, b) => b.date - a.date)

      setNotes(sortedNotes)
    };
    fetchNotes();
  }, [])

  const actionIcons = () => {
    return _.keys(actions).map(k => {
      return <IconButton
        key={k}
        value={k}
        onClick={(e) => setAction(e.currentTarget.value)}>
        <Avatar variant='square' alt={k}
          src={'images/icons/action/' + k.toLowerCase() + '.png'} />
      </IconButton>
    })
  }

  const handleAdd = async () => {
    const db = firebase.db;
    await addDoc(collection(db, "note"), {
      date: selectedDate,
      note: note,
      plant: plant,
      action: action
    })

    setOpen(false)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return <>
    <Container className={props.classes.root}>
      <Fab variant="extended" onClick={() => setOpen(true)}>
        <AddIcon />
        Add a Note
      </Fab>

      {makeNotesEl(notes)}

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          <Typography>Create Note</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />
        <DialogContent >
          <LocalizationProvider dateAdapter={AdapterDateFns} utils={DateFnsUtils}>
            <DatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </LocalizationProvider>

          <Autocomplete
            freeSolo
            value={plant}
            onChange={(event: any, newValue: string | null) => {
              setPlant(newValue);
            }}
            options={plantOptions}
            renderInput={(params) => (
              <TextField {...params} margin="normal" variant="outlined" />
            )}
          />

          <Paper>
            <Typography>Action to Your Note</Typography>
            {actionIcons()}
          </Paper>

          <TextField
            multiline
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" autoFocus onClick={handleAdd}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

  </>
}

export default withStyles(styles)(Journal)