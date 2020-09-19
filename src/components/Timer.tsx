import React from 'react';
import moment from 'moment';
import { Grid, IconButton } from '@material-ui/core';
import { 
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayCircleFilled as PlayCircleFilledIcon
} from '@material-ui/icons';
import _ from 'underscore';

import '../assets/components/Timer.scss';

interface Props {
  timerSpeed: 1.5 | 1 | 2;
  onTimerEnd: () => void;
  startTime: number;
  start: boolean;
}

interface State {
  time: number;
  timeRemaining: number;
  state: boolean;
}

export default class Timer extends React.Component<Props, State> {
  private timer: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      time: 0,
      timeRemaining: 0,
      state: true,
    }
  }

  componentDidMount() : void {
    this.startTimer();
  }

  componentDidUpdate(prevProps: Props, prevState: State) : void {
    if (prevProps.startTime !== this.props.startTime) {
      this.setState({
        time: this.props.startTime * 60,
        timeRemaining: this.props.startTime * 60,
        state: false,
      });
      return;
    }
    
    if (this.props.start === true && !prevProps.start) {
      this.setState({
        state: true
      });
      return;
    }

    if (prevState.state !== this.state.state) {
      if (this.state.state === true) {
        this.startTimer();
      }
      return;
    }
    if (prevProps.timerSpeed !== this.props.timerSpeed) {
      clearInterval(this.timer);
      this.startTimer();
      return;
    }
  }

  private startTimer = (): void => {
    const { startTime, timerSpeed } = this.props;
    if (!startTime) return;
    this.setState({
      timeRemaining: this.state.timeRemaining
    }, () => {
      this.timer = setInterval(() => {
        if (this.state.state === false) {
          clearInterval(this.timer);
          return;
        }
        if (this.state.timeRemaining === 0) {
          clearInterval(this.timer);
          _.delay(() => this.props.onTimerEnd(), 1000)
        } else {
          this.setState({
            timeRemaining: this.state.timeRemaining - 1
          })
        }
      }, 1000 / timerSpeed)
    })
  }

  private formatTimeRemainingToMinutes = (): string => moment().startOf('day')
    .seconds(this.state.timeRemaining)
    .format('mm:ss');
  
  private formatClassName = () : string => {
    const { timeRemaining } = this.state;
    if (!this.props.startTime) return '';
    const arrClass: Array<string> = [];
    if (timeRemaining < 20) {
      arrClass.push('ending');
    }

    if (timeRemaining < 10 && timeRemaining !== 0) {
      arrClass.push('blinking')
    }
    return arrClass.join(' ');
  }

  private renderMessageString = () : JSX.Element | undefined => {
    const { startTime } = this.props;
    const { timeRemaining } = this.state;
    if (!startTime) return;
    const startTimeInSecs = startTime * 60;
    if (Math.floor(startTimeInSecs / 2) >= timeRemaining && timeRemaining !== 0) {
      return <h3>More than halfway there!</h3>
    }
    if (timeRemaining === 0) {
      return <h3>Times Up!</h3>
    }
  }

  private renderActionButton = () : JSX.Element => {
    let button: {
      element : JSX.Element,
      onClick : () => void
    };

    if (this.state.state) {
      button = {
        element: <PauseCircleOutlineIcon fontSize="large"/>,
        onClick: () => this.setState({
          state: !this.state.state,
          timeRemaining: this.state.timeRemaining
        })
      }
    } else {
      button = {
        element: <PlayCircleFilledIcon fontSize="large" />,
        onClick: () => {
          if (this.state.timeRemaining) {
            this.setState({state: !this.state.state});
          }
        }
      }
    }
    return <IconButton aria-label="pause" className="action-button" onClick={button.onClick}>{button.element}</IconButton>
  }

  render() {
    return <div className='timer'>
      <Grid container>
        <Grid item sm={12}>
          {this.renderMessageString()}
        </Grid>
        <Grid item sm={11}>
          <h1 className={this.formatClassName()}>{this.formatTimeRemainingToMinutes()}</h1>
        </Grid>
        <Grid item sm={1} className="button-container">
          {this.renderActionButton()}
        </Grid>
      </Grid>
    </div>
  }

}