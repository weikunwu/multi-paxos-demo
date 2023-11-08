import React, {
  useContext,
  useEffect,
} from 'react';

import { Button } from 'antd';
import styled from 'styled-components';

import {
  animated,
  useSpring,
} from '@react-spring/web';

import {
  PACKET_SIZE,
  SERVER_SIZE,
} from '../Constants';
import { PaxosContext } from '../PaxosContext';

const offset = (SERVER_SIZE - PACKET_SIZE) / 2;
const Packet = ({ className, packet, handlePacketArrive }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const from = packet.from;
  const to = packet.to;

  const [spring, api] = useSpring(() => ({
    from: { x: from.x + offset, y: from.y + offset },
    to: { x: to.x + offset, y: to.y + offset },
    config: { duration: 5 / paxosState.speed * 1000 },
    onRest: () => {
      setPaxosState((prevState) => {
        const newPackets = prevState.packets.filter(p => p.id !== packet.id);
        return {
          ...prevState,
          packets: newPackets
        }
      })
    }
  }))

  useEffect(() => {
    if (paxosState.on) {
      api.resume();
    } else {
      api.pause()
    }
  }, [paxosState.on])
  return (
    <div className={`packet-container ${className}`}>
      <animated.div
        style={spring}
      >
        <Button
          className='packet'
          shape="circle"
        >{packet.id}</Button>
      </animated.div>
    </div>
  )
}

export default styled(Packet)`
  position: absolute;
  z-index: 1;
  .packet {
    width: ${PACKET_SIZE}px;
    height: ${PACKET_SIZE}px;
    border: 1px solid black;
  }
`;