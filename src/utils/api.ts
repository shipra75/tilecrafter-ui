const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://192.168.1.19:3300';

export async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
}

export const api = {
  datasets: {
    getAll: (status: string) => fetchWithErrorHandling(`${API_BASE_URL}/datasets?status=${status}`),
    getOne: (datasetName: string) => fetchWithErrorHandling(`${API_BASE_URL}/datasets/${datasetName}`),
    upload: (datasetName: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithErrorHandling(`${API_BASE_URL}/datasets/upload?datasetName=${datasetName}`, {
        method: 'POST',
        body: formData,
      });
    },
    getTileset: (datasetName: string) => fetchWithErrorHandling(`${API_BASE_URL}/datasets/${datasetName}/tileset.json`),
  },
  styles: {
    getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/styles/all`),
    add: (name: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithErrorHandling(`${API_BASE_URL}/styles/upload?styleName=${name}`, {
        method: 'POST',
        body: formData,
      });
    },
    getStyle: (styleName: string) => fetchWithErrorHandling(`${API_BASE_URL}/styles/${styleName}/style.json`),
  },
  sprites: {
    uploadIcon: (name: string, folder: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithErrorHandling(`${API_BASE_URL}/sprites/upload-icon?name=${name}&folder=${folder}`, {
        method: 'POST',
        body: formData,
      });
    },
    generateSpritesheet: (folder: string, spriteID: string, scale?: string) => 
      fetchWithErrorHandling(`${API_BASE_URL}/sprites/generate?folder=${folder}&spriteID=${spriteID}${scale ? `&scale=${scale}` : ''}`, { method: 'POST' }),
    getSpritesheet: (spriteID: string, scale: string, format: string) => 
      fetchWithErrorHandling(`${API_BASE_URL}/sprites/${spriteID}/sprite/${scale}.@${format}`),
    listFolders: () => fetchWithErrorHandling(`${API_BASE_URL}/sprites/list-folders`),
  },
  fonts: {
    getFont: (fontstack: string, range: string, allowedFonts: string) => 
      fetchWithErrorHandling(`${API_BASE_URL}/fonts/${fontstack}/${range}.pbf?allowedFonts=${allowedFonts}`),
    listFonts: () => fetchWithErrorHandling(`${API_BASE_URL}/fonts/list`),
  },
  tiles: {
    getTileSet:(datasetName:string, formate:string, withTileStatus:boolean, publicURL:string)=> 
      fetchWithErrorHandling(`${API_BASE_URL}/tiles/${datasetName}.json?format=${formate}&withTileStats=${withTileStatus}`, {headers:{'x-public-url': publicURL,},})
  }
};

