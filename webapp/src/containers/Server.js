import React, { useContext, useState } from 'react'; 
import { Button } from 'antd';
import styled from 'styled-components';
import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';
import { Modal } from 'antd';

const Server = ({ className, server }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const propose = () => {
    // Check if the server's role allows it to propose
    if (server.role === 'proposer' || server.role === 'both') {
      const receivers = paxosState.servers.filter(s => s.id !== server.id);
      setPaxosState((prevState) => {
        const newPackets = [
          ...prevState.packets,
          ...server.broadcastPropose(receivers, 0)
        ];

        return {
          ...prevState,
          packets: newPackets
        };
      });
    } else {
      // Show the modal if the server is an acceptor
      setIsModalVisible(true);
    }
  };

  // Function to close the modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <><div className={`server-container ${className}`}>
      <Button
        className='server'
        size='large'
        shape="circle"
        onClick={propose} // The click handler now includes role checking
        style={{
          left: `${server.x || 200}px`,
          top: `${server.y || 200}px`
        }}
      >
        {server.id}
      </Button>
    </div><Modal title="Invalid Action" visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleOk}
      footer={[
        <Button key="ok" onClick={handleOk}>
          OK
        </Button>
      ]}
    >
        <p>This server is an acceptor and cannot propose.</p>
      </Modal></>
  );
};

export default styled(Server)`
  position: absolute;
  .server {
    width: ${SERVER_SIZE}px;
    height: ${SERVER_SIZE}px;
    border: 3px solid black;
    z-index: 2;
  }
`;