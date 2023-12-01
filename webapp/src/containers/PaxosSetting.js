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
import { Server6 } from '../objects/Server6';
import { PaxosContext } from '../PaxosContext';
import LabelIconSlider from './LabelIconSlider';

const PaxosSetting = ({ className, faultMode }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  const failure6 = async () => {
    const newServers = [];
    for (let i = 0; i < 5; i++) {
      newServers.push(new Server6(`${i + 1}`));
    }

    const circleRadius = 200;
    const offset = 200;
    const totalServers = newServers.length;
    const angle = 2 * Math.PI / totalServers;

    newServers.forEach((server, i) => {
      const theta = angle * (i + 1);
      server.x = offset + circleRadius * Math.cos(theta) - 10;
      server.y = offset + circleRadius * Math.sin(theta) - 10;
      server.numOfServers = totalServers;
    });

    await setPaxosState((prevState) => ({
      ...prevState,
      servers: newServers
    }));

    await timeout(0);

    setPaxosState((prevState) => {
      const updatedServers = prevState.servers;
      const newPackets = [
        ...prevState.packets,
        ...updatedServers[1].broadcastPrepare(['1', '4'], 20),
      ];

      return {
        ...prevState,
        packets: newPackets
      };
    });

    await timeout(500);

    setPaxosState((prevState) => {
      const updatedServers = prevState.servers;
      const additionalPackets = [
        ...updatedServers[4].broadcastPrepare(['1', '3'], 10),
      ];

      return {
        ...prevState,
        packets: [...prevState.packets, ...additionalPackets]
      };
    });
  };

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
    for (let i = 0; i < 4; i++) {
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
    for (let i = 0; i < 4; i++) {
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
          {/* <Button
            type='primary'
            onClick={failure5}>Continous Prepare Loop</Button> */}
          <Button
            type='primary'
            onClick={failure1}>Same Proposal Number</Button>
          <Button
            type='primary'
            onClick={failure6}>Not Updating MinProposal</Button>
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
      {
        !faultMode &&
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
    </div >
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
