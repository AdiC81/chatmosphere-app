import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

export interface DragProps {
  initPos:Point
  children:any
  currentScale:number
  panOffset:Point
  callback: (Point)=>void
}

interface Point {
  x:number,
  y:number
}
 
const DragElement = styled.div`
  position: absolute;
`


const DragHandler = ({initPos={x:0,y:0}, children, callback=(pos)=>null, currentScale = 1, panOffset}:DragProps) => {
  panOffset = panOffset || {x:0,y:0}
  const clickDelta:any = useRef()
  const element:any = useRef()

  const onDrag = (e) => {
    if(element.current !== undefined) {
      const xPos = (e.clientX) / currentScale - clickDelta.current.x
      const yPos = (e.clientY) / currentScale - clickDelta.current.y
      element?.current?.setAttribute('style', `left:${xPos}px; top:${yPos}px`)
      callback({x:xPos, y:yPos})
    }
  }

  const onUp = () => {
    document.removeEventListener("pointerup", onUp)
    document.removeEventListener("pointermove", onDrag)
  }

  const onDown = (e) => {
    e.preventDefault()
    const boundingRect = e.currentTarget.getBoundingClientRect()
    clickDelta.current = {
      x: (e.clientX - boundingRect.x + panOffset.x) / currentScale,
      y: (e.clientY - boundingRect.y + panOffset.y) / currentScale,
    }
    debugger
    document.addEventListener("pointerup", onUp)
    document.addEventListener("pointermove", onDrag)
  }

  useEffect(() => {
    element?.current?.setAttribute('style', `left:${initPos.x}px; top:${initPos.y}px`)
  },[])

  return (
    <DragElement ref={element} onPointerDown={onDown} id="DragElement">
      {children}
    </DragElement>
  )
}

export default DragHandler