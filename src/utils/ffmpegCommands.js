 

/**
 * Build FFmpeg filter complex for transitions
 */
export const buildFFmpegCommand = (photoPaths, musicPath, outputPath, settings) => {
  const { transition, duration, aspectRatio } = settings;
  const photoDuration = 2.0; // Each photo displays for 2 seconds
  const transitionDuration = duration;

  let inputs = '';
  let filterComplex = '';

  // Add photo inputs
  photoPaths.forEach((path, i) => {
    inputs += `-loop 1 -t ${photoDuration + transitionDuration} -i "${path}" `;
  });

  // Add music input
  if (musicPath) {
    inputs += `-i "${musicPath}" `;
  }

  // Build filter chain based on transition type
  filterComplex = buildFilterChain(photoPaths.length, transition, transitionDuration, aspectRatio);

  // Build complete command
  const musicIndex = photoPaths.length;
  const audioMap = musicPath ? `-map ${musicIndex}:a` : '';
  
  const command = `
    ${inputs}
    -filter_complex "${filterComplex}"
    -map "[outv]" ${audioMap}
    -c:v libx264
    -preset medium
    -crf 23
    -pix_fmt yuv420p
    ${musicPath ? '-c:a aac -b:a 192k -shortest' : ''}
    "${outputPath}"
  `.trim().replace(/\s+/g, ' ');

  return command;
};

/**
 * Build filter chain for different transition types
 */
const buildFilterChain = (photoCount, transitionType, duration, aspectRatio) => {
  const dims = getAspectRatioDimensions(aspectRatio);
  let chain = '';

  // Scale all inputs to target resolution
  for (let i = 0; i < photoCount; i++) {
    chain += `[${i}:v]scale=${dims.width}:${dims.height}:force_original_aspect_ratio=increase,crop=${dims.width}:${dims.height},setsar=1,format=yuva420p[v${i}]; `;
  }

  // Apply transitions
  switch (transitionType) {
    case 'fade':
      chain += buildFadeTransition(photoCount, duration);
      break;
    case 'dissolve':
      chain += buildDissolveTransition(photoCount, duration);
      break;
    case 'slide_left':
      chain += buildSlideTransition(photoCount, duration, 'left');
      break;
    case 'slide_right':
      chain += buildSlideTransition(photoCount, duration, 'right');
      break;
    case 'zoom':
      chain += buildZoomTransition(photoCount, duration);
      break;
    default:
      chain += buildDissolveTransition(photoCount, duration);
  }

  return chain;
};

/**
 * Fade transition
 */
const buildFadeTransition = (count, duration) => {
  let chain = '';
  
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      chain += `[v0]fade=t=in:st=0:d=${duration}[f0]; `;
    } else {
      chain += `[v${i}]fade=t=in:st=0:d=${duration}[f${i}]; `;
      chain += `[f${i-1}][f${i}]xfade=transition=fade:duration=${duration}:offset=2[f${i}out]; `;
    }
  }
  
  chain += `[f${count-1}out]fade=t=out:st=2:d=${duration},format=yuv420p[outv]`;
  return chain;
};

/**
 * Dissolve (blend) transition
 */
const buildDissolveTransition = (count, duration) => {
  let chain = '';
  
  for (let i = 0; i < count - 1; i++) {
    const input1 = i === 0 ? `[v0]` : `[b${i-1}]`;
    const input2 = `[v${i+1}]`;
    const output = i === count - 2 ? `[outv]` : `[b${i}]`;
    
    chain += `${input1}${input2}xfade=transition=dissolve:duration=${duration}:offset=${2 + i * 2}${output}; `;
  }
  
  chain += `[outv]format=yuv420p[outv]`;
  return chain;
};

/**
 * Slide transition
 */
const buildSlideTransition = (count, duration, direction) => {
  let chain = '';
  const slideDir = direction === 'left' ? 'l' : 'r';
  
  for (let i = 0; i < count - 1; i++) {
    const input1 = i === 0 ? `[v0]` : `[s${i-1}]`;
    const input2 = `[v${i+1}]`;
    const output = i === count - 2 ? `[outv]` : `[s${i}]`;
    
    chain += `${input1}${input2}xfade=transition=slide${slideDir}:duration=${duration}:offset=${2 + i * 2}${output}; `;
  }
  
  chain += `[outv]format=yuv420p[outv]`;
  return chain;
};

/**
 * Zoom transition
 */
const buildZoomTransition = (count, duration) => {
  let chain = '';
  
  for (let i = 0; i < count - 1; i++) {
    const input1 = i === 0 ? `[v0]` : `[z${i-1}]`;
    const input2 = `[v${i+1}]`;
    const output = i === count - 2 ? `[outv]` : `[z${i}]`;
    
    chain += `${input1}${input2}xfade=transition=zoomin:duration=${duration}:offset=${2 + i * 2}${output}; `;
  }
  
  chain += `[outv]format=yuv420p[outv]`;
  return chain;
};

/**
 * Get dimensions for aspect ratio
 */
const getAspectRatioDimensions = (ratio) => {
  const ratioMap = {
    '9:16': { width: 1080, height: 1920 },
    '16:9': { width: 1920, height: 1080 },
    '1:1': { width: 1080, height: 1080 },
    '4:5': { width: 1080, height: 1350 },
  };
  return ratioMap[ratio] || ratioMap['16:9'];
};
