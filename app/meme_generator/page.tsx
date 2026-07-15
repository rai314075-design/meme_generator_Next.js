"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

type Meme = {
  id: string;
  name: string;
  url: string;
};

const Page = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        // Here we are setting the memes state with the data we got from the API
        setMemes(data.data.memes);
        setSelectedMeme(data.data.memes[0]); // Set the first meme as the selected meme
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMeme();
  }, []);

  //Handle meme selection change
  const handleMemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memeId = event.target.value;
    const meme = memes.find((meme) => meme.id === memeId) || null;
    setSelectedMeme(meme);
  };

  // Handle meme download
  const DownloadMeme = () => {
    if (!selectedMeme) return;

    //What is createElement? It is a method that creates an HTML element specified by tagName.
    //  In this case, we are creating a canvas element to draw the meme image and text on it.
    const canvas = document.createElement("canvas");// Create a canvas element
    //What is getContext? It is a method that returns a drawing context on the canvas.
    const ctx = canvas.getContext("2d");
    //What is new Image()? It is a constructor that creates a new HTMLImageElement instance.
    const img = new window.Image();
    //what is crossOrigin? It is a property that sets the CORS setting for the image.
    //  We set it to "anonymous" to avoid tainting the canvas when we draw the image on it.
    img.crossOrigin = "anonymous";
    //what is src? It is a property that sets the source URL of the image.
    img.src = selectedMeme.url;
//what is onload? It is an event handler that executes a function when the image has finished loading.
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      //What is fillStyle? It is a property that sets the color or style to use inside shapes.
      //WHat is drawImage? It is a method that draws an image onto the canvas.
      ctx?.drawImage(img, 0, 0,canvas.width, canvas.height);
      

      //text styling
      ctx!.font = "bold 70px black";
      ctx!.fillStyle = "black";
      ctx!.textAlign = "center";
      ctx!.lineWidth = 3;
      ctx!.strokeStyle = "black";


      //Top text
ctx!.fillText(topText.toUpperCase(), canvas.width -350, 300);
      ctx!.strokeText(topText.toUpperCase(), canvas.width -350, 300);


      //Bottom text
      ctx!.fillText(bottomText.toUpperCase(), canvas.width -350,canvas.height - 200);
      ctx!.strokeText(bottomText.toUpperCase(), canvas.width -350, canvas.height - 200);

      //convert to image and trigger download
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  
  };

  return (
    <div>
      <div className="container text-center mt-5">
        <h1 className="mb-4 text-primary">🔥 Meme Generator 🔥</h1>

        {/* Meme Selection Dropdown: */}
        <div className="mb-3">
          <select className="form-select" onChange={handleMemeChange}>
            {memes.map((meme) => (
              <option key={meme.id} value={meme.id}>
                {meme.name}
              </option>
            ))}
          </select>
        </div>
        {/* Meme Preview: */}
        {selectedMeme && (
          <div className="position-relative d-inline-block">
            <Image
              src={selectedMeme.url}
              alt={selectedMeme.name}
              width={500}
              height={500}
            />
            {/* Top Text */}
            <p className="position-absolute top-0 start-50 w-100 translate-middle-x text-black fw-bold fs-4">
              {topText}
            </p>
            {/* Bottom Text */}
            <p className="position-absolute bottom-0 start-50 w-100 translate-middle-x text-black fw-bold fs-4">
              {bottomText}
            </p>
          </div>
        )}
        {/* Text Input Fields */}
        <div className="mt-3 row">
          <div className='col'>
            <input
              type="text"
              className="form-control"
              placeholder="Top Text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
          </div>
          <div className='col'>
            <input
              type="text"
              className="form-control"
              placeholder="Bottom Text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
          </div>
        </div>
        {/* Download Button */}
        <button className="btn btn-success mt-3" onClick={DownloadMeme}>
          Download Meme
        </button>
      </div>
    </div>
  );
};

export default Page;
