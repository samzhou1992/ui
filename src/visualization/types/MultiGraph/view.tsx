// Libraries
import React, {MutableRefObject, useCallback, useMemo} from 'react'
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

const XYPlot: React.FC<Props> = ({
  properties,
  timeRange,
  annotations,
  cellID,
}) => {
  const graphs: MutableRefObject<HTMLDivElement>[] = useMemo(() => [], [])
  const register = useCallback((graph) => {graphs.push(graph)}, [])
  const broadcast = useCallback((e: MouseEvent, elementY: number) => {
    graphs.forEach((graph) => {
      if (!graph.current) {
        return
      }
      const {top, bottom} = graph.current.getBoundingClientRect()
      if (e.clientY > top && e.clientY < bottom) {
        return
      }
      const offsetY = top - elementY
      const event = new MouseEvent(e.type,{bubbles: true, relatedTarget: graph.current, clientX: e.clientX, clientY: e.clientY + offsetY, screenX: e.screenX, screenY: e.screenY + offsetY})
      graph.current.getElementsByClassName('giraffe-inner-plot')[0].dispatchEvent(event)
    })
  }, [])
  const timeMachine = useSelector(activeTimeMachineSelector)
  const graphNum = timeMachine.queryResults.files.length

  return (
    <AutoSizer className="giraffe-autosizer" style={{height: '100%', width: '100%'}}>
      {({width, height}) => timeMachine.queryResults.files.map((file, i) => {
        const result = fromFlux(file)
        return <SingleGraph key={i} height={height/graphNum} width={width} properties={properties} result={result} timeRange={timeRange} annotations={annotations} cellID={cellID} register={register} broadcast={broadcast}/>
      })}

    </AutoSizer>)
}

export default XYPlot
