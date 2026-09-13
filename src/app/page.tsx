import { Anta } from 'next/font/google';


const anta = Anta({ weight: '400', subsets: ['latin'] , variable: "--font-anta"});

export default function Home() {
  return (
    <div className="flex min-h-screen justify-start overflow-x-hidden bg-slate-950 font-sans">
      <div className={`${anta.className} left-0 min-h-screen w-75 bg-zinc-800 p-4 flex flex-col  text-xl`}>
        <p className={`${anta.className} text-3xl w-full text-center pb-2`}>PlainHelper</p>
        <div className="w-full h-1 bg-zinc-700 rounded-full"></div>
        
        <div className="w-full h-full p-1 flex justify-start flex-col">
          Blehhhhh
          <input type="range" className="ml-3 w-100%"></input>
        </div>
      </div>
      
      <canvas className="w-full h-screen">
      </canvas>
    </div>
  );
}
