import { Image } from "image-js";

async function execute() {
  const image = await Image.load("/lion.jpg");
  const processed = image
    .grey() 
    .rotate(30)
    .resize({ width: 3000, height: 2000 });
 return processed.toDataURL();
}

self.addEventListener('message', () => {
  execute()
  .then(self.postMessage);
});