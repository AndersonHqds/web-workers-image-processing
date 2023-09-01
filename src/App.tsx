import { useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { Image } from "image-js";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

let counter = 0;
let counterId = null;

function App() {
  const imageRef = useRef();
  const counterRef = useRef();
  const [processing, setProcessing] = useState(false);
  const [isWebWorkers, setIsWebWorkers] = useState(false);

  async function execute() {
    console.time("process");
    initCounter();
    setProcessing(true);
    if (!isWebWorkers) {
      const image = await Image.load("/lion.jpg");
      const grey = image
        .grey() // convert the image to greyscale.
        .rotate(30)
        .resize({ width: 3000, height: 2000 }); // rotate the image clockwise by 30 degrees.
      imageRef.current.src = grey.toDataURL();
    } else {
      worker.postMessage("");
      worker.addEventListener("message", (event) => {
        const result = event.data; // Resultado enviado pelo Web Worker
        imageRef.current.src = result;
      });
    }
    setProcessing(false);
    console.timeEnd("process");
  }

  function incrementCounter() {
    counter++;
    counterRef.current.textContent = counter;
  }

  function initCounter() {
    counterId = setInterval(incrementCounter, 500);
  }

  return (
    <>
      <Header />
      <img src="/lion.jpg" className="w-96 h-72" />
      <br />
      <img id="result" ref={imageRef} />
      {processing && <p>Processing...</p>}
      <input
        className="mt-2 flex h-12 w-100 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
        placeholder="Enter text"
      />
      <br />
      <input
        type="checkbox"
        checked={isWebWorkers}
        onChange={() => setIsWebWorkers(!isWebWorkers)}
      />{" "}
      Use web workers
      <br />
      Counter: <span ref={counterRef}>{0}</span>
      <br />
      <button
        onClick={execute}
        className="border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline"
      >
        Process Image
      </button>
    </>
  );
}

export default App;
