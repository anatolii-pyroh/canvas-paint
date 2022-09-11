import { useEffect, useRef, useState } from "react";

import Menu from "./components/Menu/Menu";

import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [selection, setSelection] = useState(false);
  // draw selection border when this state is true and reject default drawing
  const [isSelection, setIsSelection] = useState(false);
  const [paste, setPaste] = useState(false);
  const [clear, setClear] = useState(false);
  // selection area
  const [area, setArea] = useState({
    startX: undefined,
    startY: undefined,
    endX: undefined,
    endY: undefined,
  });

  const [imageData, setImageData] = useState();
  // state to save previouse canvas paintings while drawing new one
  const [savedContext, setSavedContext] = useState();
  const [saved, setSaved] = useState(null);

  const [line, setLine] = useState("round");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(15);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(1);

  const handleKeyDown = (event) => {
    event.preventDefault();
    let charCode = String.fromCharCode(event.which).toLowerCase();

    // ctrl+c
    if ((event.ctrlKey || event.metaKey) && charCode === "c") {
      console.log("ctrl+c");
      copy();
    }

    // ctrl+v
    if ((event.ctrlKey || event.metaKey) && charCode === "v") {
      console.log("ctrl+v");
      setPaste(true);
    }

    // ctrl+x
    if ((event.ctrlKey || event.metaKey) && charCode === "x") {
      console.log("ctrl+x");
      copy();
      if (area.endX) {
        contextRef.current.clearRect(
          area.startX,
          area.startY,
          area.endX - area.startX,
          area.endY - area.startY
        );
      }
      setSaved(canvasRef.current.toDataURL());
    }
  };

  const copy = () => {
    if (area.endX) {
      setImageData(
        contextRef.current.getImageData(
          area.startX,
          area.startY,
          area.endX - area.startX,
          area.endY - area.startY
        )
      );
    }
  };

  const startDrawing = (e) => {
    if (!isDrawing) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
    if (selection) {
      setIsSelection(true);
      setIsDrawing(false);
      setSavedContext(contextRef.current.getImageData(0, 0, 1280, 660));
      setSaved(canvasRef.current.toDataURL());
      setArea({
        ...area,
        startX: e.nativeEvent.offsetX,
        startY: e.nativeEvent.offsetY,
      });
    }
  };

  const drawing = (e) => {
    if (isDrawing) {
      contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      contextRef.current.stroke();
    }
    if (selection) {
      if (isSelection) {
        const img = new Image();
        img.src = saved;
        img.onload = () => {
          contextRef.current.clearRect(0, 0, 1280, 660);
          contextRef.current.drawImage(img, 0, 0, 1280, 660);
          contextRef.current.beginPath();
          contextRef.current.strokeStyle = "black";
          contextRef.current.setLineDash([5, 10]);
          contextRef.current.lineWidth = 1;
          contextRef.current.rect(
            area.startX,
            area.startY,
            e.nativeEvent.offsetX - area.startX,
            e.nativeEvent.offsetY - area.startY
          );
          contextRef.current.stroke();
          contextRef.current.setLineDash([]);
          contextRef.current.globalAlpha = lineOpacity;
          contextRef.current.strokeStyle = lineColor;
          contextRef.current.lineWidth = lineWidth;
        };
      }
    }
    if (paste) {
      if (area.endX) {
        const img = new Image();
        img.src = saved;
        // console.log("img in paste data", img);
        contextRef.current.clearRect(0, 0, 1280, 660);
        contextRef.current.drawImage(img, 0, 0, 1280, 660);
        contextRef.current.putImageData(
          imageData,
          e.nativeEvent.offsetX - imageData.width / 2,
          e.nativeEvent.offsetY - imageData.height / 2
        );
      }
    }
  };

  const endDrawing = (e) => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
    if (selection) {
      if (isSelection) {
        setArea({
          ...area,
          endX: e.nativeEvent.offsetX,
          endY: e.nativeEvent.offsetY,
        });
        setSelection(false);
        setIsSelection(false);
        contextRef.current.putImageData(savedContext, 0, 0);
      }
    }
    if (paste) {
      setPaste(false);
    }
    // save new canvas paintings every time user ends drawing
    setSaved(canvasRef.current.toDataURL());
  };

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (clear) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setClear(false);
    }
    context.lineCap = line;
    context.lineJoin = line;
    context.globalAlpha = lineOpacity;
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, [line, lineColor, lineOpacity, lineWidth, clear]);

  return (
    <div className='App'>
      <h1>Paint App</h1>
      <div className='draw-area'>
        <Menu
          selection={selection}
          setSelection={setSelection}
          setLine={setLine}
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          setClear={setClear}
        />
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={drawing}
          tabIndex='1'
          onKeyDown={(event) => handleKeyDown(event)}
          ref={canvasRef}
          width={`1280px`}
          height={`660px`}
        />
      </div>
    </div>
  );
}

export default App;
