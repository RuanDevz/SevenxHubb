import { ApiResponse, VideoFile } from '../types';

const API_KEY = '497584ycgrio4h93tbtz0u';
const BASE_URL = 'https://doodapi.com/api';
const PROXY_URL = 'https://corsproxy.io/?';

export const fetchVideos = async (page = 1, perPage = 20): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${PROXY_URL}${encodeURIComponent(`${BASE_URL}/file/list?key=${API_KEY}&page=${page}&per_page=${perPage}`)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetch videos response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      status: 0,
      msg: 'Error fetching videos',
      total_count: 0,
      result: { files: [] }
    };
  }
};

export const searchVideos = async (query: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${PROXY_URL}${encodeURIComponent(`${BASE_URL}/search/videos?key=${API_KEY}&search_term=${encodeURIComponent(query)}`)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search videos');
    }
    
    const data = await response.json();
    console.log('searchVideos response:', data);
    return data;
  } catch (error) {
    console.error('Error searching videos:', error);
    return {
      status: 0,
      msg: 'Error searching videos',
      total_count: 0,
      result: []
    };
  }
};

export const getVideoInfo = async (fileCode: string) => {
  try {
    const response = await fetch(
      `${PROXY_URL}${encodeURIComponent(`${BASE_URL}/file/info?key=${API_KEY}&file_code=${fileCode}`)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Video info response:', data);

    if (data.status === 400 && data.msg === "Invalid file codes") {
      // Try to get video info from list API as fallback
      const listResponse = await fetchVideos(1, 50);
      if (listResponse.status === 200 && listResponse.result?.files) {
        const video = listResponse.result.files.find((v: VideoFile) => v.file_code === fileCode);
        if (video) {
          return {
            status: 200,
            msg: "Success",
            result: video
          };
        }
      }
    }

    return data;
  } catch (error) {
    console.error('Error getting video info:', error);
    return {
      status: 0,
      msg: 'Error getting video info',
      result: null
    };
  }
};

export const fetchVideos_old = async (page = 1, perPage = 20) => {
  try {
    const apiResponse = await fetchVideos(page, perPage);
    
    if (apiResponse.status === 200 && apiResponse.result && apiResponse.result.files) {
      return {
        result: 999,
        msg: "Success",
        total_count: apiResponse.total_count,
        data: apiResponse.result.files.map((file: VideoFile) => ({
          file_code: file.file_code,
          title: file.title,
          length: file.length,
          splash_img: file.splash_img,
          single_img: file.single_img,
          uploaded: file.uploaded,
          views: file.views,
          canplay: file.canplay,
          download_url: file.download_url,
          fld_id: file.fld_id,
          public: file.public
        }))
      };
    } else {
      return {
        result: 999,
        msg: "Success",
        total_count: 10,
        data: generateMockVideos(10)
      };
    }
  } catch (error) {
    console.error('Error in fetchVideos_old:', error);
    return {
      result: 999,
      msg: "Success",
      total_count: 10,
      data: generateMockVideos(10)
    };
  }
};

const generateMockVideos = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    file_code: `mock_${i}_${Date.now()}`,
    title: `Sample Video ${i + 1}`,
    length: `${Math.floor(Math.random() * 600)}`,
    splash_img: `https://images.unsplash.com/photo-${1500000000 + i * 1000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`,
    single_img: `https://images.unsplash.com/photo-${1500000000 + i * 1000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`,
    uploaded: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    views: Math.floor(Math.random() * 10000),
    canplay: 1,
    download_url: '#',
    fld_id: `${i}`,
    public: '1'
  }));
};

export const getVideoEmbedUrl = (fileCode: string) => {
  return `https://dood.wf/e/${fileCode}`;
};

export const getVideoThumbnail = (splashImg: string) => {
  return splashImg || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop';
};