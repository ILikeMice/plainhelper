"use client"
import { useEffect, useRef, useState } from 'react';
import { Anta, Gruppo, Hedvig_Letters_Sans } from 'next/font/google';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import Konva from "konva";
import { stages } from "konva/lib/Stage";

const anta = Anta({ weight: '400', subsets: ['latin'] , variable: "--font-anta"});

export default function Home() {
  const [rectPosition, setRectPosition] = useState({ x: 0, y: 0 })
  const [fuselSize,setFuselSize] = useState({width:100,height:100})
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null)
  const gridGroupRef = useRef<Konva.Group>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const grid = 25

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
    const group = gridGroupRef.current;

    if (!group || canvasSize.width === 0 || canvasSize.height === 0) {
      return;
    }

    group.destroyChildren()
    
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

    group.getLayer()?.batchDraw();
}, [canvasSize]);


  [document.getElementById("f_width"), document.getElementById("f_length")].forEach(function(e){ 
    e?.addEventListener("input", () => {
      let widththingy = document.getElementById("f_width") as HTMLInputElement 
      var width = Number(widththingy.value)
      let lengththingy = document.getElementById("f_length") as HTMLInputElement 
      var length = Number(lengththingy.value)
      if (width >0 && length>0){
       setFuselSize({width:width, height:length})
      }
    })
  })
  
  return (
    <div className="flex min-h-screen justify-start overflow-x-hidden bg-[#090d1f] font-sans text-white">
      <div className={`${anta.className} left-0 min-h-screen w-75 bg-zinc-800 p-4 flex flex-col  text-xl`}>
        <p className={`${anta.className} text-3xl w-full text-center pb-2`}>PlainHelper</p>
        <div className="w-full h-1 bg-zinc-700 rounded-full"></div>
        

        <div className="w-full h-fit p-1 flex justify-start flex-col">
          Fuselage
          <div className="w-full ml-3 flex flex-row gap-2 mt-2">
            <div className="w-1/2 h-fit relative"> 
              <input type="number" defaultValue={fuselSize.width} placeholder="Width" className="w-full" id="f_width"></input>
              <small className="absolute right-1 bottom-px">mm</small>
              <small className="absolute left-[-10px] top-[-15px]"><small>Width</small></small>
            </div>  
            <div className="w-1/2 h-fit relative">
              <input type="number" defaultValue={fuselSize.height} placeholder="Length" className="w-full" id="f_length"></input>
              <small className="absolute right-1 bottom-px">mm</small>
              <small className="absolute left-[-10px] top-[-15px]" ><small>Height</small></small>
            </div>  
          </div>
        </div>
      </div>
      
      <div className="w-full h-screen" id="canvasthing" ref={canvasContainerRef}>
        <Stage width={canvasSize.width} height={canvasSize.height} id="stage">
          <Layer ref={layerRef} id="coollayer">
            <Group ref={gridGroupRef} id="gridgroup" 
              x={0} 
              y={0}>
            </Group>
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