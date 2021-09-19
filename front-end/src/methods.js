const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/;
const url_regex = new RegExp(expression);

export const isYoutubeVideo = (str) => {
    let minPartsLength = 2;
    if (!str.startsWith('http')) minPartsLength = 1;
    return (
        (str.includes('youtu.be') || str.includes('youtube')) &&
        str.split('/').filter((element)=>{return element!==''}).length > minPartsLength
    );
}

export const isUrl = (str) => {
    return str.match(url_regex);
}