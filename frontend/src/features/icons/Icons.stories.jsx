import React from 'react';
import styled from 'styled-components';

const reqSvgs = require.context('../icons', true, /\.svg$/)

export default {
  title: 'MonitorEnv/Icons',
};


const Template = () => {
  return <Gallery>
  {
    reqSvgs.keys().map((path)=>{
      return <ImageWrapper key={path}>
          <Img src={reqSvgs(path)} ></Img>
          {path}
          </ImageWrapper>
    }) 
  }
  </Gallery>
 }
 
 export const Primary = Template.bind({});


 const Img = styled.img`
  width: 50px;
  margin: 3px;
 `
const ImageWrapper = styled.div``

const Gallery = styled.div`
 height: 100%;
 overflow: auto;
`