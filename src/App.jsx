import { useEffect, useRef, useState } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [selection, setSelection] = useState(false);
  const [isSelection, setIsSelection] = useState(false);
  const [area, setArea] = useState({
    startX: "",
    startY: "",
    endX: "",
    endY: "",
  });

  const [imageData, setImageData] = useState();
  const [clear, setClear] = useState(false);
  const [savedContext, setSavedContext] = useState();
  const [saved, setSaved] = useState();

  const [line, setLine] = useState("round");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(15);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.5);

  // Function for starting the drawing
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

  const draw = (e) => {
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
          contextRef.current.setLineDash([10, 20]);
          contextRef.current.lineWidth = 1;
          contextRef.current.rect(
            area.startX,
            area.startY,
            e.nativeEvent.offsetX - area.startX,
            e.nativeEvent.offsetY - area.startY
          );
          contextRef.current.stroke();
          contextRef.current.setLineDash([]);
          contextRef.current.strokeStyle = lineColor;
        };
      }
    }
  };

  // Function for ending the drawing
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

  useEffect(() => {
    if (area.startX && area.startY && area.endX && area.endY) {
      console.log(area);
      setImageData(
        contextRef.current.getImageData(
          area.startX,
          area.startY,
          area.endX - area.startX,
          area.endY - area.startY
        )
      );
    }
  }, [area]);

  useEffect(() => {
    if (imageData) {
      console.log(imageData);
      contextRef.current.putImageData(imageData, 0, 0);
      setImageData(false);
      setArea(false);
    } else {
      return;
    }
  }, [imageData]);

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
          onMouseMove={draw}
          ref={canvasRef}
          width={`1280px`}
          height={`660px`}
        />
      </div>
    </div>
  );
}

export default App;
