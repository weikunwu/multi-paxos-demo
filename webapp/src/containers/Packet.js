import React, {
  useContext,
  useEffect,
} from 'react';

import {
  Button,
  Tooltip,
} from 'antd';
import styled from 'styled-components';

import {
  animated,
  useSpring,
} from '@react-spring/web';

import {
  PACKET_SIZE,
  SERVER_SIZE,
} from '../Constants';
import { Packet as PacketClass } from '../objects/Packet';
import { PaxosContext } from '../PaxosContext';
import PacketTooltip from './PacketTooltip';

const offset = (SERVER_SIZE - PACKET_SIZE) / 2;
const Packet = ({ className, packet }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  let buttonText = "";

  if (packet.type === "ACK_PREPARE") {
    buttonText = "A"
  } else if (packet.type === "ACK_ACCEPT") {
    buttonText = "OK"
  } else if (packet.type === "ACCEPT") {
    buttonText = packet.value;
  }

  const from = paxosState.servers.find(s => s.id === packet.from);
  const to = paxosState.servers.find(s => s.id === packet.to);

  const [spring, api] = useSpring(() => ({
    from: { x: from.x + offset, y: from.y + offset },
    to: { x: (!packet.drop ? to.x : (to.x + from.x) / 2) + offset, y: (!packet.drop ? to.y : (to.y + from.y) / 2) + offset },
    config: { duration: (packet.drop ? 0.5 : 1) * Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2) / paxosState.speed * 20 },
    onRest: () => {

      setPaxosState((prevState) => {
        const newPackets = prevState.packets.filter(p => p.id !== packet.id);
        const curPacket = prevState.packets.find(p => p.id === packet.id);

        if (!curPacket || curPacket.drop) {
          return {
            ...prevState,
            packets: newPackets
          }
        }

        const receiver = prevState.servers.find(s => s.id === curPacket.to);

        if (receiver.down) {
          return {
            ...prevState,
            packets: newPackets
          }
        }

        const otherServers = prevState.servers.filter(s => s.id !== curPacket.to).map(s => s.id);
        const packets = [
          ...newPackets,
          ...PacketClass.filterDrop(receiver.receivePacket(otherServers, curPacket), prevState.dropRate)
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

  const handleDrop = () => {
    setPaxosState((prevState) => {
      const newPackets = prevState.packets.filter(p => p.id !== packet.id);

      return {
        ...paxosState,
        packets: newPackets
      }
    });
  };

  return (
    <div className={`packet-container ${className}`}>
      <animated.div
        style={spring}
      >
        <Tooltip
          overlayInnerStyle={{
            width: '400px',
          }}
          title={<PacketTooltip
            packet={packet}
            handleDrop={handleDrop}
          />}
        >
          <Button
            className={`packet ${(packet.type === "ACK_PREPARE" || packet.type === "ACK_ACCEPT") && "green"}`}
            shape="circle"
          >{buttonText}</Button>
        </Tooltip>
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