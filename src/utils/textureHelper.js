import * as THREE from 'three';
THREE.Cache.enabled = true;
window.THREECache = THREE.Cache;

const textures = {};

const images = {};

const loader = new THREE.TextureLoader();

const imgLoader = new THREE.ImageBitmapLoader().setCrossOrigin('*');

window.loadTest = (img) => {
  const date = new Date();
  imgLoader.load(img, (bitMap) => {
    window.logMessage((new Date() - date) / 1000);
  });
};

export const loadImage = (img) =>
  new Promise((resolve, reject) => {
    if (img) {
      if (images[img]) {
        return resolve(images[img]);
      } else {
        imgLoader.load(
          img,
          (imageBitmap) => {
            images[img] = imageBitmap;
            resolve(images[img]);
          },
          null,
          (err) => {
            reject(err);
          }
        );
      }
    } else {
      return reject('EMPTY');
    }
  });

export const loadImages = (imgs = []) =>
  new Promise((resolve, reject) => {
    const imgReqs = imgs.map((img) => loadImage(img));
    Promise.all(imgReqs)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

// const imgToTexture = (url, img, anisotropy = 8) => {
//   const texture = new THREE.CanvasTexture(img);
//   texture.center = new THREE.Vector2(0.5, 0.5);
//   texture.rotation = Math.PI;
//   texture.anisotropy = anisotropy;
//   textures[url] = texture;
//   return textures[url];
// };

export const loadTexture = (img, anisotropy = 8, hdImgs = null) =>
  new Promise((resolve, reject) => {
    if (img) {
      if (hdImgs && textures[hdImgs]) {
        setTimeout(() => {
          if (textures[img]) {
            textures[img].dispose();
            delete textures[img];
          }
          getTextureStatus();
        });
        return resolve(textures[hdImgs]);
      } else if (textures[img]) {
        getTextureStatus();
        return resolve(textures[img]);
      } else {
        loader.load(img, (texture) => {
          texture.anisotropy = anisotropy;
          textures[img] = texture;
          getTextureStatus();
          resolve(textures[img]);
        });
      }
    } else {
      return reject('EMPTY');
    }
  });

export const loadHdTexture = (hdImg, anisotropy = 8, img = null) =>
  new Promise((resolve, reject) => {
    if (hdImg) {
      loader.load(hdImg, (texture) => {
        texture.anisotropy = anisotropy;
        textures[hdImg] = texture;
        setTimeout(() => {
          if (textures[img]) {
            textures[img].dispose();
            delete textures[img];
            getTextureStatus();
          }
        }, 100);
        resolve(textures[hdImg]);
      });
    } else {
      return reject('EMPTY');
    }
  });

export const loadTextures = (imgs = [], anisotropy = 8, hdImgs = []) =>
  new Promise((resolve, reject) => {
    const imgReqs = imgs.map((img, index) =>
      loadTexture(img, anisotropy, hdImgs[index])
    );
    Promise.all(imgReqs)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

export const loadHdTextures = (hdImgs = [], anisotropy = 8, imgs = []) =>
  new Promise((resolve, reject) => {
    const imgReqs = hdImgs.map((img, index) =>
      loadHdTexture(img, anisotropy, imgs[index])
    );
    Promise.all(imgReqs)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

const getTextureStatus = () => {
  window.logMessage(
    'status: ' + Object.keys(textures).length + ' textures cached!'
  );
};

export const cleanLoadTexture = (img, anisotropy = 8) =>
  new Promise((resolve, reject) => {
    if (img) {
      loader.load(img, (texture) => {
        texture.anisotropy = anisotropy;
        resolve(texture);
      });
    } else {
      return reject('EMPTY');
    }
  });

export const cleanLoadTextures = (imgs, anisotropy = 8) =>
  new Promise((resolve, reject) => {
    const imgReqs = imgs.map((img) => cleanLoadTexture(img, anisotropy));
    Promise.all(imgReqs)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

window.getTextureStatus = getTextureStatus;
