import { Button } from "antd-mobile";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCGMhs40nY4Od4GXqDPvqYEUzVSNAQ1-lw",
  authDomain: "draw-it-nana.firebaseapp.com",
  projectId: "draw-it-nana",
  storageBucket: "draw-it-nana.appspot.com",
  messagingSenderId: "322465485742",
  appId: "1:322465485742:web:b166fa6d84f5ab4f282e3f",
  measurementId: "G-NZRD0SHHWK",
};

const app = initializeApp(firebaseConfig);

function generateRandomFilenameWithType(fileType: string): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let filename = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    filename += characters[randomIndex];
  }
  return `${filename}.${fileType}`;
}

export default function AppFirebase() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storage = getStorage(app);
    const imagesRef = ref(storage, "images/");
    listAll(imagesRef)
      .then(async (res) => {
        const urls = await Promise.all(
          res.items.map(async (item) => {
            try {
              return await getDownloadURL(ref(storage, item.fullPath));
            } catch (error) {
              console.error("Error getting download URL:", error);
              return null;
            }
          })
        );
        setImages(urls.filter((url) => url !== null) as string[]);
      })
      .catch((error) => {
        console.error("Error listing images:", error);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedFileTypes = ["jpg", "jpeg", "png"];
      const fileType = file.name.split(".").pop()?.toLowerCase();
      if (fileType && allowedFileTypes.includes(fileType)) {
        setSelectedFile(file);
      } else {
        alert("Invalid file type.");
      }
    }
  };

  const uploadImage = async () => {
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File size exceeds the maximum limit.");
        return;
      }

      setLoading(true);
      const fileName = sanitizeFileName(selectedFile.name);
      const storage = getStorage(app);
      const imagesRef = ref(storage, `images/${fileName}`);
      try {
        await uploadBytesResumable(imagesRef, selectedFile);
        const imageUrl = await getDownloadURL(imagesRef);
        setImages((prevImages) => [...prevImages, imageUrl]);
        setSelectedFile(null);
        alert("Upload successful!");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  function sanitizeFileName(fileName: string): string {
    const sanitizedFileName = fileName.replace(/[^\w\d.]/g, "");
    return generateRandomFilenameWithType(sanitizedFileName);
  }

  return (
    <div>
      <div className="upload-area">
        <input type="file" onChange={handleFileChange} />
        <Button loading={loading} onClick={uploadImage}>
          Upload
        </Button>
      </div>
      <div className="images-area">
        {images.map((imgUrl) => (
          <img key={imgUrl} src={imgUrl} alt="report" className="image" />
        ))}
      </div>

      <style>
        {`
          .upload-area {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }

          .images-area {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          .image {
            margin: 10px;
            max-width: 300px;
          }
        `}
      </style>
    </div>
  );
}
