"use client"
import { useEffect, useRef, useState } from 'react';
import { Anta, Gruppo, Hedvig_Letters_Sans } from 'next/font/google';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import Konva from "konva";
import { stages } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";

const anta = Anta({ weight: '400', subsets: ['latin'] , variable: "--font-anta"});

export default function Home() {
  const [rectPosition, setRectPosition] = useState({ x: 0, y: 0 })
  const [fuselSize,setFuselSize] = useState({width:100,height:100, weight:100})
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const gridLayerRef = useRef<Konva.Layer>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const grid = 25

  
  let a = 0

  useEffect(() => { // ts lowk ai cause i got ZERO idea on how to implement allat
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateCanvasSize = () => {
      setCanvasSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  
  useEffect(() => {
    const group = gridLayerRef.current;

    if (!group || canvasSize.width === 0 || canvasSize.height === 0) {
      return;
    }

    group.removeChildren()
    
    let centery = Math.round(canvasSize.height / (4*grid)) *2*grid;
    let centerx = Math.round(canvasSize.width / (4*grid)) *2*grid;

    setRectPosition({
      x: centerx,
      y: centery
    });
    
    for (let x=0; x<=canvasSize.width; x += 2*grid) {
      if (x == Math.round(canvasSize.width / (4*grid)) *2*grid) {
        group.add(new Konva.Line({
          points: [x, 0, x, canvasSize.height],
          stroke: "#3d3d3b",
          strokeWidth: 2,
          opacity: 1,
        }));

      }
      group.add(new Konva.Line({
        points: [x, 0, x, canvasSize.height],
        stroke: "#3d3d3b",
        strokeWidth: 1,
        opacity: 0.3,
      }));
    }

    for (let y=0; y <=canvasSize.height; y += 2*grid) {
      if (y == Math.round(canvasSize.height / (4*grid)) *2*grid) {
        group.add(new Konva.Line({
        points: [0, y, canvasSize.width, y],
        stroke: "#3d3d3b",
        strokeWidth: 2,
        opacity: 1,
      }));
      }
      group.add(new Konva.Line({
        points: [0, y, canvasSize.width, y],
        stroke:"#3d3d3b",
        strokeWidth: 1,
        opacity: 0.3,
      }));
    }


    group.getLayer()?.draw();
}, [canvasSize.width, canvasSize.height]);

function test() {
  console.log("testtest!")
}  

  return (
    <div className="flex min-h-screen justify-start overflow-x-hidden bg-[#090d1f] font-sans text-white">
      <div className={`${anta.className} left-0 min-h-screen w-75 bg-zinc-800 p-4 flex flex-col  text-xl`}>
        <p className={`${anta.className} text-3xl w-full text-center pb-2`}>PlainHelper</p>
        <div className="w-full h-1 bg-zinc-700 rounded-full"></div>
        
        <div className="w-full h-fit p-1 flex justify-start flex-col">
          Fuselage
          <div className="w-full ml-3 flex-wrap grid grid-cols-2 gap-2 mt-2 h-fit">
            <div className="grow-1 h-fit relative"> 
              <input type="number" value={fuselSize.width} onChange={(e) => setFuselSize({...fuselSize, width: Number(e.target.value)})} placeholder="Width" className="w-full" id="f_width"></input>
              <small className="absolute right-1 bottom-px">mm</small>
              <small className="absolute left-[-10px] top-[-15px]"><small>Width</small></small>
            </div>  
            <div className="grow-1 h-fit relative">
              <input type="number" value={fuselSize.height} onChange={(e) => setFuselSize({...fuselSize, height: Number(e.target.value)})} placeholder="Length" className="w-full" id="f_length"></input>
              <small className="absolute right-1 bottom-px">mm</small>
              <small className="absolute left-[-10px] top-[-15px]" ><small>Height</small></small>
            </div>

            <div className="grow-2 h-fit relative"> 
              <input type="number" value={fuselSize.weight} onChange={(e) => setFuselSize({...fuselSize, weight: Number(e.target.value)})} placeholder="Weight" className="w-full" id="f_weight"></input>
              <small className="absolute right-1 bottom-px">g</small>
              <small className="absolute left-[-10px] top-[-15px]"><small>Weight</small></small>
            </div>

            <div className="grow-2 border-white border border-x-0 text-center pb-1 justify-center text-nowrap"><small>x: {(rectPosition.x- Math.round(canvasSize.width / (4*grid)) *2*grid)} y: {(rectPosition.y- Math.round(canvasSize.height / (4*grid)) *2*grid)*-1}</small> </div>
          </div>
        </div>
        
        <div className="w-full h-1 bg-zinc-700 rounded-full mt-1"></div>
      </div>
  
      <div className="w-full h-screen" id="canvasthing" ref={canvasContainerRef}>
        <Stage ref={stageRef} width={canvasSize.width} height={canvasSize.height} id="stage">
          <Layer ref={gridLayerRef} id="gridgroup" 
              x={0} 
              y={0}>
          </Layer>
          <Layer ref={layerRef} id="coollayer">
            <Rect
            id="fuselage"
            x={rectPosition.x}
            y={rectPosition.y}
            width={fuselSize.width}
            height={fuselSize.height}
            fill="red"
            shadowBlur={10}
            draggable
            onDragMove={(e) => { const thingy = e.target as Konva.Shape
              thingy.position({
                x: Math.round(thingy.x() / grid) * grid,
                y: Math.round(thingy.y() / grid) * grid
              })
              layerRef.current?.batchDraw()
              setRectPosition(e.target.position())
            }}
            onDragEnd={(e) => setRectPosition(e.target.position())}
            offsetX={fuselSize.width/2}
            offsetY = {fuselSize.height/2}
          />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}