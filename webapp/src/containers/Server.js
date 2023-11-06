import React from 'react';

import { Button } from 'antd';
import { useAnimationControls } from 'framer-motion';
import styled from 'styled-components';

const packetWidth = 30;
const serverWidth = 50;
const serverMargin = 80;
const Server = ({ className, server }) => {
  const controls = useAnimationControls();

  return (
    <div className={`server-container ${className}`}>
      <Button
        className='server'
        size='large'
        shape="circle"
        style={{
          left: server.x || '200px',
          top: server.y || '200px'
        }}>{server.name}</Button>
      {/* <motion.div
        className="packet"
        animate={controls}
        transition={{
          duration: 2
        }}
      ></motion.div>
      <motion.div
        className="packet"
        animate={{ x: '0', y: '0' }}
        transition={{
          duration: 2
        }}
      ></motion.div>
      <motion.div
        className="packet"
        animate={{ x: '0', y: '0' }}
        transition={{
          duration: 2
        }}
      ></motion.div> */}
    </div>
  )
}

export default styled(Server)`
  position: absolute;
  display: flex;
  justify-content:center;
  align-items: center;
  .packet {
    width: ${packetWidth}px;
    height: ${packetWidth}px;
    border-radius: ${packetWidth}px;
    border: 1px solid black;
    position: absolute;
    z-index: -1;
  }

  .server {
    width: ${serverWidth}px;
    height: ${serverWidth}px;
    border: 3px solid black;
  }
`;