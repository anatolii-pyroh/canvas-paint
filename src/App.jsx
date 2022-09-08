import { AssignmentReturnOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [selection, setSelection] = useState(false);
  const [area, setArea] = useState({
    startX: "",
    startY: "",
    endX: "",
    endY: "",
  });
  const [imageData, setImageData] = useState("");
  const [line, setLine] = useState("round");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(15);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.5);
  const [clear, setClear] = useState(false);

  // Function for starting the drawing
  const startDrawing = (e) => {
    if (selection) {
      // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setArea({
        ...area,
        startX: e.nativeEvent.offsetX,
        startY: e.nativeEvent.offsetY,
      });
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  // Function for ending the drawing
  const endDrawing = (e) => {
    if (selection) {
      // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setArea({
        ...area,
        endX: e.nativeEvent.offsetX,
        endY: e.nativeEvent.offsetY,
      });
      setSelection(false);
    } else {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    contextRef.current.stroke();
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
