import {AppState} from '../../../types'
import {TimeMachineState} from '../../../timeMachine/reducers'

export const activeTimeMachineSelector = (state: AppState): TimeMachineState => {
  const {activeTimeMachineID, timeMachines} = state.timeMachines
  return timeMachines[activeTimeMachineID]
}