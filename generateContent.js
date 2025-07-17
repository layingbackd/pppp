const fs = require('fs');
const path = require('path');

// artworks 폴더 경로
const artworksDir = path.join(__dirname, 'artworks');

// 결과를 저장할 배열
const contentArray = [];

// HTML 템플릿 함수
function generateHTML(artwork) {
  // 개별 미디어 요소를 생성하는 함수
  function createMediaElement(file) {
    const ext = path.extname(file).toLowerCase();
    const filePath = `./${file}`;
    
    if (['.mp4', '.mov', '.webm', '.avi', '.mkv'].includes(ext)) {
      let mimeType;
      switch(ext) {
        case '.mp4':
          mimeType = 'video/mp4';
          break;
        case '.mov':
          mimeType = 'video/quicktime';
          break;
        case '.webm':
          mimeType = 'video/webm';
          break;
        case '.avi':
          mimeType = 'video/x-msvideo';
          break;
        case '.mkv':
          mimeType = 'video/x-matroska';
          break;
        default:
          mimeType = 'video/mp4';
      }
      
      return `<video controls preload="metadata" style="max-width: 100%; margin: 10px 0;">
        <source src="${filePath}" type="${mimeType}">
        <p>브라우저가 이 비디오 형식을 지원하지 않습니다. <a href="${filePath}">비디오 다운로드</a></p>
      </video>`;
    } else {
      return `<img src="${filePath}" alt="${file}" style="max-width: 100%; margin: 10px 0;">`;
    }
  }

  // 순번별로 정렬된 내용을 HTML로 변환
  const orderedElements = artwork.orderedContent && artwork.orderedContent.length > 0
    ? artwork.orderedContent.map(item => {
        if (item.type === 'media') {
          return createMediaElement(item.content);
        } else if (item.type === 'text') {
          return `<div class="description" style="margin: 10px 0;">${item.content}</div>`;
        }
        return '';
      }).join('\n')
    : '';

  // 하위 호환성을 위한 기존 미디어 요소들
  const mediaElements = artwork.media.map(file => createMediaElement(file)).join('\n');

  const linkElements = artwork.links && artwork.links.length > 0 
    ? artwork.links.map((link, index) => 
        `<p><a href="${link.url}" target="_blank">${link.title}</a></p>`
      ).join('\n')
    : '';

  const thumbnailElement = artwork.thumbnail 
    ? `<img src="./${artwork.thumbnail}" alt="썸네일" style="max-width: 300px; margin-bottom: 20px;">`
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${artwork.title}</title>
    <style>
*{
  overscroll-behavior: none;
  word-break: keep-all;
/* font-family: "Gothic A1", sans-serif; */
font-family: helvetica , arial, sans-serif;
/* font-family: 'Pretendard-Regular', sans-serif; */
overscroll-behavior: none;

font-weight: 400;
font-style: normal;
margin: 0;
padding: 0;
transition: 0.1s;
text-underline-offset: 3px;
}

*::selection {
  background-color: #000000; 
  color: rgb(255, 255, 255);
}

 a{
      color: black;
    }
    a:hover{
      color: rgb(219, 219, 219);
    }


body{
  padding: 80px;
  padding-top: 20px;
 padding-bottom: 100px;
}

.backcolor{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: rgb(244, 244, 244);
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, hsla(0, 0%, 100%, 1) 14%, rgb(255, 255, 255) 18%, hsla(0, 0%, 100%, 1) 97%);
  /* background: radial-gradient(circle, rgb(177, 177, 177) 20%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 100%); */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  
}

.backcolorBox{
  width: 20vw;
  height: 200px;
  height: 100vh;
  /* filter: blur(10px); */
  /* background:linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(197, 197, 197) 14%, rgb(255, 255, 255) 97%); */
}


.circle {
  position: fixed;
  top: 50%;
  left: 50%;
  scale: 0.8;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}
.copyText{
  font-weight: 400;
}


header{
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 14px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
}

.menu{
  /* width: 100%; */
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -0.01em;
  text-decoration: none;
  color: #000;
  /* height: 48px; */
  padding-bottom: 4px;
  /* border-radius: 1000px; */
  padding-top: 2px;
  padding-bottom: 0px;
  padding-left: 6px;
  padding-right: 6px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family:'Times New Roman', Times, serif;
}
nav{
  display: flex;
  align-items: start;
  justify-content: start;
// margin-left: 50px;
}
.copy{
  /* width: 50%; */
  margin-top: 20px;
  font-size: 28px;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: -0.01em;
  text-decoration: none;
  color: #000;
  width: 60%;
}

.selectedMenu{
  background-color: #000;
  /* border-radius: 1000px; */
  color: white;
  padding-top: 2px;
  padding-bottom: 0px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  /* rotate: -2deg; */

}
.menu:hover{
  background-color: #000000;
  color: rgb(255, 255, 255);
}








/* header F */


header {
/* margin-bottom: 40px; */
text-align:start;
}

#gallery {
width: calc(100% - 200px);

padding-left: 100px;
padding-right: 100px;
/* display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 30px; */
display: flex;
flex-wrap: wrap;
gap: 40px 60px;
padding-top: 200px;
}

article {
width: calc(18vw - 100px);
}
article img{
  /* border: 0.1px solid #dedede;
  background-color: black; */
  /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1); */
}
article img:hover{
  /* border-radius: 99900px; */
}

li{
margin-left: 14px;
}
.artwork-link {
text-decoration: none;
color: inherit;
display: block;
}

.thumbnail-container {
/* filter: grayscale(100%); */
}

.thumbnail-container img {
width: 100%;
min-width: 100px;
/* width: auto;
max-width: 180px; */
/* height: 50%; */
/* object-fit: cover; */
}

.thumbnail-container:hover {
filter: grayscale(0%);
}

.no-thumbnail {
color: #666;
font-style: italic;
}

.content {
/* padding: 20px; */
text-align: start;
}
h1 a{
font-size: 18px;
font-weight: lighter;
font-family: 'Times New Roman', Times, sans-serif;
}

.artwork-title {
word-break: break-all;
color: #333;
font-size: 15px;
color: rgb(0, 0, 0);
font-family: 'helvetica', arial, sans-serif;
font-weight: 400;
text-overflow: ellipsis;
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
padding-bottom: 12px;
padding-top: 6px;
}



.artwork-description {
text-indent: 20px;
color: #000000;
font-size: 12px;
line-height: 1.5;
display: -webkit-box;
-webkit-line-clamp: 8;
font-weight: 400;
letter-spacing: -0.02em;
line-height: 1.8;
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
padding-bottom: 4px;
border-bottom: 1.5px solid #838383;
}








main{
  max-width: 1400px;
  /* width: 50vw; */
  /* background-color: rebeccapurple; */
  /* background-color: rebeccapurple; */
}

.infoBox{
/* background-color: rebeccapurple; */
display: flex;
flex-direction: row;
font-size: 16px;
}


.infoTitle{
  font-size: 14px;
  font-weight: 300;
  letter-spacing: -0.01em;
  font-style: normal;
  padding-left: 4px;
  padding-right: 4px;
  margin-top: 25px;
}
.infoTitle span{
  color: rgb(0, 0, 0);
  /* background-color: black; */
  padding-left: 4px;
  padding-right: 4px;
  font-style: italic;
}
.mobilityInfo{
  margin-left: 100px;
  width: 50%;
  margin-top: 20px;
  gap: 20px;
}
.mobilityInfo p{
  line-height: 1.7;
  letter-spacing: -0.02em;
  font-weight: 500;
  font-style: oblique 10deg; /* 각도 직접 지정 */
}
.newsunsInfo{
  width: 50%;
  margin-top: 20px;
  gap: 20px;
  padding-left: 0px;
}
.newsunsInfo p{
  line-height: 1.7;
  letter-spacing: -0.02em;
  font-style: normal;
  font-weight: 500;
}
.newsunsInfo p:nth-child(2),.mobilityInfo p:nth-child(2){
 text-indent: 58px;
}

.contactBox{
  rotate: 2deg;
  margin-top: 40px;
  font-size: 36px;
  font-weight: 100;
  letter-spacing: -0.01em;
  font-style: normal;
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
}
.contactBox span{
  font-family: 'Times New Roman', Times, serif;
  text-decoration: underline;
  background-color: black;
  color: white;
  padding-bottom: 4px;
}




.content{
  width: 50%;
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 20px;
  // background-color: red;
  }

  .content video, .content img{
  width: auto;
  max-height: 800px;
  }


        .description{
        font-size: 22px;
        line-height: 1.6;
        letter-spacing: -0.02em;
        font-weight: 400;
        width: 80%;
        white-space: pre-line;
      }


    .subtitle{
    font-size: 42px;
    font-weight: 600;
    width: 100%;
    font-style: italic;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    font-family: 'Times New Roman', Times, serif;
  }

  .links-section{
    padding-top: 60px;
  }
  .links-section p a {
    font-size: 20px;
    line-height: 1.5;
    letter-spacing: -0.02em;
    font-weight: 500;
    color: black;
  }


      .description{
      padding-left: 100px;
      width: 100%;
        font-size: 22px;
        white-space: pre-line;
      }

    .subtitle{
    font-size: 30px;
    font-weight: 500;
  }


@media (max-width: 800px) {
  .circle{
    /* display: none; */
    scale: 0.3;
    left: 35%;
    top: 40%;

  }
  body{
    padding: 10px;
  }
  nav{
    /* margin-left: 60px; */
  }
  .copy{
    width: 100%;
    font-size: 24px;
  }
  .menu{
    font-size: 18px;
  }
  .infoTitle, .infoTitle span{
    padding-left: 0px;
    padding-right: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  .mobilityInfo , .newsunsInfo{
    padding-left: 0px;
    padding-right: 0px;
    margin-right: 0px;
    margin-left: 0px;
    width: 100%;
  }
  .contactBox span{
    font-size: 18px;
  }
  .backcolor{
    display: none;
  }
  .archives .backcolor{
    display: block;
  }

  /* archivessss */
   /* archivessss */
    /* archivessss */
  #gallery{
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
  }
  article{
    width: 90%;
  }
  

}




    </style>
</head>
<body>
  <div class="gradientBox">
   </div>
   <div class="mobileGradientBox">
   </div>
      <div class="circle">
        <img src="../../assets/circle.svg" alt="circle">
      </div>
  <header>
     <nav>
      <a class="menu" href="../../index.html">유은 U eun</a> <div class="menu">/</div> <a class="menu selectedMenu" href="../../archives.html">프로젝트 Project</a>
     </nav>
  </header>
  <div class="copy">
      <p class="copyText">새로운 태양들은 다층적인 세계관을 실험하는 장입니다. 
      <br> The New Suns is a site for experimenting with layered worldviews.
    </p>
  </div>

<div class="content">
    <p class="subtitle">${artwork.title}</p>
    
    <!-- ${thumbnailElement} -->

    ${orderedElements ? orderedElements : 
      (artwork.text ? `<div class="description">${artwork.text}</div>` : '') + 
      (mediaElements ? `<div class="media-section">${mediaElements}</div>` : '')
    }
    
    ${linkElements ? `<div class="links-section">
        <p class="subtitle">Annotation</p>
        ${linkElements}
    </div>` : ''}
</div>
</body>
</html>`;

}

// artworks 폴더 읽기
const folders = fs.readdirSync(artworksDir)
  .filter(item => fs.statSync(path.join(artworksDir, item)).isDirectory())
  .sort(); // 폴더 이름 기준 정렬

// 각 작품 폴더 처리
folders.forEach(folder => {
  const folderPath = path.join(artworksDir, folder);
  
  // 폴더 내용 읽기
  const folderContents = fs.readdirSync(folderPath);
  
  // 제목 추출 (1_title → title)
  const title = folder.split('_').slice(1).join('_');
  
  // 썸네일 찾기 (thumbnail.png, thumnail.png 등)
  let thumbnail = '';
  const thumbnailFiles = folderContents.filter(file => {
    const name = file.toLowerCase();
    return (name.includes('thumbnail') || name.includes('thumnail')) && 
           ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file).toLowerCase());
  });
  if (thumbnailFiles.length > 0) {
    thumbnail = thumbnailFiles[0];
  }

  // 순번이 붙은 모든 파일들 찾기 (미디어 + 텍스트)
  const numberedFiles = folderContents.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);
    // 순번_이름 패턴 확인
    const isNumbered = /^\d+_/.test(name);
    
    // 미디어 파일 또는 텍스트 파일인지 확인
    const isMediaFile = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm', '.avi', '.mkv', '.bmp', '.tiff', '.svg'].includes(ext);
    const isTxtFile = ext === '.txt';
    
    // link_ 로 시작하는 파일은 제외 (링크 파일과 구분)
    const isNotLinkFile = !name.startsWith('link_');
    
    return isNumbered && (isMediaFile || (isTxtFile && isNotLinkFile));
  }).sort(); // 순번 기준 정렬

  // 순번별로 정렬된 파일들을 처리
  const orderedContent = [];
  const media = [];
  
  numberedFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const isMediaFile = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm', '.avi', '.mkv', '.bmp', '.tiff', '.svg'].includes(ext);
    
    if (isMediaFile) {
      media.push(file);
      orderedContent.push({
        type: 'media',
        content: file
      });
    } else if (ext === '.txt') {
      const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
      orderedContent.push({
        type: 'text',
        content: content
      });
    }
  });

  // 하위 호환성을 위한 텍스트 처리
  let text = '';
  if (orderedContent.length === 0 && folderContents.includes('description.txt')) {
    text = fs.readFileSync(path.join(folderPath, 'description.txt'), 'utf8');
  }

  // link 파일들 찾기 (link_순번_이름.txt)
  const linkFiles = folderContents.filter(file => 
    file.startsWith('link_') && file.endsWith('.txt')
  );
  
  const links = linkFiles.map(file => {
    const content = fs.readFileSync(path.join(folderPath, file), 'utf8').trim();
    // link_순번_이름.txt에서 이름 부분 추출
    const namePart = file.replace('link_', '').replace('.txt', '');
    const linkTitle = namePart.split('_').slice(1).join('_'); // 순번 제거하고 이름만
    
    return {
      title: linkTitle,
      url: content
    };
  });

  // 작품 정보 객체 생성
  const artwork = {
    title,
    folder,
    thumbnail,
    media,
    text,
    links,
    orderedContent
  };
  
  // HTML 파일 생성
  const htmlContent = generateHTML(artwork);
  const htmlFileName = `${title}.html`;
  fs.writeFileSync(
    path.join(folderPath, htmlFileName),
    htmlContent,
    'utf8'
  );
  
  console.log(`${htmlFileName} 파일이 생성되었습니다.`);
  
  // 배열에 추가
  contentArray.push(artwork);
});

// content.json 파일로 저장
fs.writeFileSync(
  path.join(__dirname, 'content.json'),
  JSON.stringify(contentArray, null, 2),
  'utf8'
);

console.log('content.json 파일이 생성되었습니다.');