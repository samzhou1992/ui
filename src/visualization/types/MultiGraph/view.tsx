// Libraries
import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {fromFlux} from '@influxdata/giraffe'
import {AutoSizer} from 'react-virtualized'

import {activeTimeMachineSelector} from './selectors'
import SingleGraph from './SingleGraph'

// Types
import {XYViewProperties} from 'src/types'
import {VisualizationProps} from 'src/visualization'

interface Props extends VisualizationProps {
  properties: XYViewProperties
}

const XYPlot: FC<Props> = ({
  properties,
  timeRange,
  annotations,
  cellID,
}) => {
  const timeMachine = useSelector(activeTimeMachineSelector)
  const graphNum = timeMachine.queryResults.files.length

  return (
    <AutoSizer className="giraffe-autosizer">
      {({width, height}) => timeMachine.queryResults.files.map((file, i) => {
        const result = fromFlux(file)
        return <SingleGraph key={i} height={height/graphNum} width={width} properties={properties} result={result} timeRange={timeRange} annotations={annotations} cellID={cellID}/>
      })}
    </AutoSizer>)
}

export default XYPlot
