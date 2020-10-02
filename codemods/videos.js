const visit = require('unist-util-visit');
const {
  addAttribute,
  findAttribute,
  isMdxBlockElement,
} = require('./utils/mdxast');

const getVideoProps = (src) => {
  const propsObj = {};
  const domain = src.split('/')[2];
  if (domain === 'fast.wistia.net') {
    propsObj.type = 'wistia';
    propsObj.id = src.match(/iframe\/([a-zA-Z0-9]+)\??/)[1];
  }
  if (domain === 'www.youtube.com') {
    propsObj.type = 'youtube';
    propsObj.id = src.match(/embed\/([a-zA-Z0-9]+)\??/)[1];
  } else {
    throw new Error('Video type not recognized.');
  }
  return propsObj;
};

const videos = () => (tree) => {
  visit(
    tree,
    (node) => isMdxBlockElement('iframe', node),
    (iframe) => {
      iframe.name = 'Video';
      const videoProps = getVideoProps(findAttribute('src', iframe));
      iframe.attributes = [];
      addAttribute('type', videoProps.type, iframe);
      addAttribute('id', videoProps.id, iframe);
    }
  );
};

module.exports = videos;
