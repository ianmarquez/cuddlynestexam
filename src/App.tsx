import React, { useState } from 'react';
import { TextField, Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import _ from 'underscore';

import Timer from './components/Timer';
import './assets/App.scss';

function App() {
  const [ countdown, setCountdown ] = useState<number>(0);
  const [ speed, setSpeed ] = useState<1|1.5|2>(1);
  const [ error, setError ] = useState<boolean>(false);
  const callback = () => setCountdown(0);

  const onChange = _.debounce((value: string) => { 
    if(isNaN(parseInt(value)) || parseFloat(value) <= 0) {
      setError(true)
    } else {
      setError(false);
      setCountdown(parseFloat(value));
    }
  }, 300);
  
  return (
    <div className="App">
      <Card className="timer-container">
        <CardContent>
          <Typography className="card-title" variant="h5" component="h2" gutterBottom>
            Timer
          </Typography>
          <Grid className="grid" container spacing={3}>
            <Grid item sm={12}>
              <TextField 
                label="Countdown" 
                variant="outlined" 
                size="small"
                onChange={(e) => onChange(e.target.value)}
                />
                {error && <Alert severity="error">Countdown must be a valid number.</Alert>}
            </Grid>
            <Grid item sm={12}>
              <Timer startTime={countdown} timerSpeed={speed} onTimerEnd={callback}/>
            </Grid>
            <Grid item sm={12}>
              <Button variant="contained" onClick={() => setSpeed(1)} color={ speed === 1 ? "primary": "secondary"}>
                1x
              </Button>&nbsp;
              <Button variant="contained" onClick={() => setSpeed(1.5)} color={ speed === 1.5 ? "primary": "secondary"}>
                1.5x
              </Button>&nbsp;
              <Button variant="contained" onClick={() => setSpeed(2)} color={ speed === 2 ? "primary": "secondary"}>
                2x
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card >
    </div>
  );
}

export default App;
