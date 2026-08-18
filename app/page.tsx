"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Meme = {
  id: string;
  name: string;
  url: string;
};

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        setMemes(data.data.memes);
        setSelectedMeme(data.data.memes[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMeme();
  }, []);

  const handleMemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memeId = event.target.value;
    const meme = memes.find((item) => item.id === memeId) || null;
    setSelectedMeme(meme);
  };

  const downloadMeme = () => {
    if (!selectedMeme) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.crossOrigin = "anonymous";
    img.src = selectedMeme.url;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx!.font = "bold 70px black";
      ctx!.fillStyle = "black";
      ctx!.textAlign = "center";
      ctx!.lineWidth = 3;
      ctx!.strokeStyle = "black";

      ctx!.fillText(topText.toUpperCase(), canvas.width - 350, 300);
      ctx!.strokeText(topText.toUpperCase(), canvas.width - 350, 300);

      ctx!.fillText(bottomText.toUpperCase(), canvas.width - 350, canvas.height - 200);
      ctx!.strokeText(bottomText.toUpperCase(), canvas.width - 350, canvas.height - 200);

      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div>
      <div className="container-fluid text-center mt-3 mt-sm-5 px-3 px-sm-0">
        <h1 className="mb-3 mb-sm-4 text-primary">🔥 Meme Generator 🔥</h1>

        <div className="mb-3">
          <select className="form-select w-100" onChange={handleMemeChange}>
            {memes.map((meme) => (
              <option key={meme.id} value={meme.id}>
                {meme.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMeme && (
          <div className="position-relative d-inline-block w-100" style={{ maxWidth: '500px' }}>
            <Image
              src={selectedMeme.url}
              alt={selectedMeme.name}
              width={500}
              height={500}
              priority
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '500px',
                display: 'block'
              }}
            />
            <p className="position-absolute top-0 start-50 w-100 translate-middle-x text-black fw-bold fs-4" style={{ fontSize: '1.2rem', padding: '0.5rem' }}>
              {topText}
            </p>
            <p className="position-absolute bottom-0 start-50 w-100 translate-middle-x text-black fw-bold fs-4" style={{ fontSize: '1.2rem', padding: '0.5rem' }}>
              {bottomText}
            </p>
          </div>
        )}

        <div className="mt-3 row g-2 g-sm-3" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="col-12 col-sm-6">
            <input
              type="text"
              className="form-control"
              placeholder="Top Text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
          </div>
          <div className="col-12 col-sm-6">
            <input
              type="text"
              className="form-control"
              placeholder="Bottom Text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-success mt-3 w-100" style={{ maxWidth: '500px', margin: '1rem auto' }} onClick={downloadMeme}>
          Download Meme
        </button>
      </div>
    </div>
  );
}
