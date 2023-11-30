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
const Packet = ({ className, packet }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  let buttonText = "";

  if (packet.type === "ACK_PREPARE" || packet.type === "ACK_ACCEPT") {
    buttonText = "OK"
  } else if (packet.type === "ACCEPT") {
    buttonText = packet.value;
  }

  const from = paxosState.servers.find(s => s.id === packet.from);
  const to = paxosState.servers.find(s => s.id === packet.to);

  const [spring, api] = useSpring(() => ({
    from: { x: from.x + offset, y: from.y + offset },
    to: { x: to.x + offset, y: to.y + offset },
    config: { duration: Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2) / paxosState.speed * 20 },
    onRest: () => {

      setPaxosState((prevState) => {
        const newPackets = prevState.packets.filter(p => p.id !== packet.id);
        const curPacket = prevState.packets.find(p => p.id === packet.id);

        if (curPacket.drop) {
          return {
            ...prevState,
            packets: newPackets
          }
        }

        const receiver = prevState.servers.find(s => s.id === curPacket.to);
        const otherServers = prevState.servers.filter(s => s.id !== curPacket.to).map(s => s.id);
        const packets = [
          ...newPackets,
          ...receiver.receivePacket(otherServers, curPacket)
        ];

        const servers = prevState.servers.map(s => {
          if (s.id === receiver.id) {
            return receiver;
          }
          return s;
        })

        return {
          ...prevState,
          servers,
          packets,
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
          className={`packet ${(packet.type === "ACK_PREPARE" || packet.type === "ACK_ACCEPT") && "green"}`}
          shape="circle"
        >{buttonText}</Button>
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
  .packet.green {
    background-color: green
  }
`;