import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { readFile, cropImageData } from '../../main/helpers';

export default function Photo() {

  const [imageSrc, setImageSrc] = useState(null); // file data
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [filename, setFilename] = useState(null); // file address

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const onCropComplete = useCallback((_croppedArea: Area, currentCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const handleFileChange = async (e: any) => {
    if(e.target.files && e.target.files.length) {
      // we got a file...
      const file = e.target.files[0];
      setFilename(file.path);
      // get the image data from the file
      const imageData: any = await readFile(file);
      // setImageSrc to that image data
      setImageSrc(imageData);
    }
  }

  const handleSave = async () => {
    // first save the cropped image
    // window.electron.setTitle('IT WORKED still');
    const base64data = await cropImageData(imageSrc, croppedAreaPixels!)
      .catch(console.error);
    const newFileName = `${filename}-cropped.png`;
    window.electron.saveCroppedImage([newFileName, base64data]);
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
  }

  if(!imageSrc) {
    return (
      <>
        <h1>Please choose photo to crop</h1>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </>
    )
  }

  return (
    <>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <button className='save-btn' onClick={handleSave}>Save</button>
    </>
  )
}
