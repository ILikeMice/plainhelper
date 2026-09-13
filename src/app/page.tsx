"use client"
import { useEffect, useRef, useState } from 'react';
import { Anta } from 'next/font/google';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import Konva from "konva";

const anta = Anta({ weight: '400', subsets: ['latin'] , variable: "--font-anta"});

export default function Home() {
  const [rectPosition, setRectPosition] = useState({ x: 20, y: 50 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  function makerectangle():void {
    console.log("RECTANGLEEE")

    const rectangle = new Konva.Rect({
      x:0,
      y:0,
      fill:"blue",
      cornerRadius: 2,
      width:10,
      height:20,
      draggable:true
    })
    
    layerRef.current?.add(rectangle)
  }
  
  return (
    <div className="flex min-h-screen justify-start overflow-x-hidden bg-slate-950 font-sans">
      <div className={`${anta.className} left-0 min-h-screen w-75 bg-zinc-800 p-4 flex flex-col  text-xl`}>
        <p className={`${anta.className} text-3xl w-full text-center pb-2`}>PlainHelper</p>
        <div className="w-full h-1 bg-zinc-700 rounded-full"></div>
        

        <div className="w-full h-fit p-1 flex justify-start flex-col">
          Fuselage
          <input type="number" placeholder="Width" className="ml-3 w-full"></input>
        </div>

      </div>
      
      <div className="w-full h-screen" id="canvasthing" ref={canvasContainerRef}>
        <Stage width={canvasSize.width} height={canvasSize.height} id="stage">
          <Layer ref={layerRef} id="coollayer">
            <Rect
            x={rectPosition.x}
            y={rectPosition.y}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
            draggable
            onDragEnd={(e) => setRectPosition(e.target.position())}
          />
          </Layer>
        </Stage>
      </div>
      
    

    </div>
  );
}
