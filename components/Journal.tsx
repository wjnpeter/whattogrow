import _ from "lodash"
import useSWR from 'swr'

import { useState, useContext, useEffect } from 'react'
import {
  Typography, Fab, Container, WithStyles, createStyles, TextField, Paper, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider
} from '@material-ui/core'
import { withStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import AppContext from '../lib/contexts'
import { fetchers } from '../lib/apiFetchers'
import firebase from '../lib/firebaseApp'

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
    const db = firebase.firestore();
    db.collection("note").get()
      .then(snap => snap.docs)
      .then(docs => docs.map(doc => doc.data()))
      .then(noteDatas => noteDatas.sort((a, b) => b.date - a.date))
      .then(noteDatas => setNotes(noteDatas))
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

  const handleAdd = () => {
    const db = firebase.firestore();
    db.collection("note").add({
      date: selectedDate,
      note: note,
      plant: plant,
      action: action,
      uid: "TODO"
    })
      .then(() => {
        setOpen(false)
      })
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
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
          </MuiPickersUtilsProvider>

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