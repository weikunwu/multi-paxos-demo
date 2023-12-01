import React, { useContext } from 'react';

import { Button } from 'antd';
import {
  AiOutlineCheck,
  AiOutlineClose,
} from 'react-icons/ai';
import {
  GiRabbit,
  GiTurtleShell,
} from 'react-icons/gi';
import styled from 'styled-components';

import { Server } from '../objects/Server';
import { PaxosContext } from '../PaxosContext';
import LabelIconSlider from './LabelIconSlider';

const PaxosSetting = ({ className, faultMode }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const handleStartButton = () => {
    const cur = paxosState.on;
    setPaxosState({
      ...paxosState,
      on: !cur
    })
  }

  const handleSpeedChange = (speed) => {
    setPaxosState({
      ...paxosState,
      speed: speed
    })
  }

  const handleDropRateChange = (dropRate) => {
    setPaxosState({
      ...paxosState,
      dropRate: 0.01 * dropRate
    })
  }

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  const handleFailure1 = () => {
    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...prevState.servers[0].broadcastPreparFailure1(['2', '3', '4'], 10),
        ...prevState.servers[2].broadcastPreparFailure1(['1', '2', '4'], 20)
      ];
      return {
        ...prevState,
        packets: newPackets,
        on: true
      }
    })
  }

  const handleFailure5 = () => {
    const interval = setInterval(async () => {
      setPaxosState((prevState) => {
        const newPackets = [
          ...prevState.packets,
          ...paxosState.servers[0].broadcastPrepare(['3', '4'], 1)
        ];
        console.log(newPackets);
        return {
          ...prevState,
          packets: newPackets,
          on: true
        }
      })
      await timeout(3000);
      setPaxosState((prevState) => {
        const newPackets = [
          ...prevState.packets,
          ...paxosState.servers[1].broadcastPrepare(['3', '4'], 1)
        ];
        return {
          ...prevState,
          packets: newPackets,
          on: true
        }
      })
    }, 5000);
  }

  const failure1 = () => {
    for (let i = 0; i < 3; i++) {
      handleAddServer();
    }
    setPaxosState((prevState) => {
      return {
        ...prevState,
        scenario: 'failure1'
      }
    })
  }

  const failure5 = () => {
    for (let i = 0; i < 3; i++) {
      handleAddServer();
    }
    setPaxosState((prevState) => {
      return {
        ...prevState,
        scenario: 'failure5'
      }
    })
  }

  const handleAddServer = () => {
    setPaxosState(prevState => {
      // Clone the current array of servers
      const newServers = [...prevState.servers];

      // Create a new unique identifier for the new server
      const newServerId = `${newServers.length + 1}`;

      // Create a new Server instance with the unique identifier
      const newServer = new Server(newServerId);

      // Calculate position for the new server
      const circleRadius = 200; // Radius of the circle
      const offset = 200; // Center offset for the node
      const totalServers = newServers.length + 1; // Include the new server in count
      const angle = 2 * Math.PI / totalServers; // Angle for positioning servers

      // Position the new server and update positions for existing servers
      newServers.push(newServer);
      newServers.forEach((server, i) => {
        const theta = angle * (i + 1); // New angle for all nodes
        server.x = offset + circleRadius * Math.cos(theta) - 10;
        server.y = offset + circleRadius * Math.sin(theta) - 10;
      });

      // Return the updated state
      return {
        ...prevState,
        servers: newServers,
      };
    });
  };

  return (
    <div className={`paxos-setting-container ${className}`} >
      {faultMode ?
        <div>
          <Button
            className='add-button'
            type='primary'
            onClick={failure5}>Continous Prepare Loop</Button>
          <Button
            className='add-button'
            type='primary'
            onClick={failure1}>Same Proposal Number</Button>
        </div>
        :
        <Button
          className='add-button'
          type='primary'
          disabled={
            paxosState.servers.length >= 10 || paxosState.on || paxosState.packets.length > 0
          } onClick={handleAddServer}>Add Node</Button>
      }
      <Button
        className='start-button'
        onClick={() => {
          if (paxosState.scenario === "failure5") {
            handleFailure5();
          } else if (paxosState.scenario === "failure1") {
            handleFailure1();
          } else {
            handleStartButton();
          }

        }}
      >{paxosState.on ? 'Pause' : 'Start'}</Button>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
        min={1}
        max={5}
        handleChange={handleSpeedChange}
      />

      {!faultMode &&
        <LabelIconSlider
          leftIcon={<AiOutlineCheck />}
          rightIcon={<AiOutlineClose />}
          label='Message Drop Rate'
          min={0}
          max={(100)}
          step={10}
          handleChange={handleDropRateChange}
        />
      }
    </div>
  )
}

export default styled(PaxosSetting)`

  #mode-setting {
    display: flex;
    flex-direction: column;
  }

  button {
    width: 100%;
    margin: 10px;
  }
`;
