const extractNameFromImgFileName = (ImgFileName) => {
    const fileName = ImgFileName.split('.')?.[0];
    return fileName;
};

module.exports = extractNameFromImgFileName;
