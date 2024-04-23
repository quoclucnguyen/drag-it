import {
  FloatingBubble,
  Form,
  ImageUploadItem,
  ImageUploader,
} from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import DragDiv from "./components/DragDiv";
import DragImage from "./components/DragImage";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomPosition() {
  return Math.floor(Math.random() * 500) + "px";
}

function App() {
  const [listDiv, setListDiv] = useState<React.ReactElement[]>([]);

  const onClick = useCallback(() => {
    setListDiv((prev) => [
      ...prev,
      <DragDiv
        shape="square"
        color={getRandomColor()}
        key={prev.length}
        top={getRandomPosition()}
        left={getRandomPosition()}
      />,
    ]);
  }, []);

  useEffect(() => {
    Object.keys(localStorage).map((key) => {
      const value = localStorage.getItem(key);
      setListDiv((prev) => [
        ...prev,
        <DragImage src={value as string} key={prev.length} />,
      ]);
    });
  }, []);

  return (
    <div className="example-container">
      <Form
        onValuesChange={(e) => {
          const { file } = e;
          if (file.length > 0) {
            console.log(file[0]);
            setListDiv((prev) => [
              ...prev,
              <DragImage src={file[0].url} key={prev.length} />,
            ]);
          }
        }}
      >
        <Form.Item label="input" name={"file"}>
          <ImageUploader
            upload={function (file: File): Promise<ImageUploadItem> {
              console.log(file);
              const reader = new FileReader();
              reader.onload = (e) => {
                const imgAsDataURL = e?.target?.result;
                // Save imgAsDataURL to LocalStorage
                if (imgAsDataURL && typeof imgAsDataURL === "string") {
                  try {
                    localStorage.setItem(file.name, imgAsDataURL);
                  } catch (error) {
                    console.error("Storage failed:", error);
                  }
                }
              };
              reader.readAsDataURL(file);

              return Promise.resolve({ url: URL.createObjectURL(file) });
            }}
          />
        </Form.Item>
      </Form>

      <FloatingBubble
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={onClick}
      >
        <AddCircleOutline fontSize={32} />
      </FloatingBubble>

      {listDiv.map((item) => item)}
    </div>
  );
}

export default App;
