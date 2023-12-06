import React, {
  useContext,
  useState,
} from 'react';

import {
  Button,
  Popover,
} from 'antd';
import { IoClose } from 'react-icons/io5';
import styled from 'styled-components';

import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';

const Server = ({ className, id }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  const [popoverOpen, setPopoverOpen] = useState(true);
  const server = paxosState.servers.find(s => s.id === id);

  return (
    <div className={`server-container ${className}`}>
      <Popover
        open={server.learnedValue && popoverOpen}
        trigger={[]}
        content={
          <>
            <span>{`Value ${server.learnedValue} is decided`}</span>
            <Button
              shape="circle"
              size="small"
              type="text"
              onClick={() => {
                setPopoverOpen(false);
              }}
            >
              <IoClose />
            </Button>
          </>
        }
      >
        <Button
          className={`server ${server.down ? "down" : "up"}`}
          size='large'
          shape="circle"
          onClick={() => {
            if (server.learnedValue) {
              setPopoverOpen(!popoverOpen);
            }
          }}
          style={{
            left: `${server.x || 200}px`,
            top: `${server.y || 200}px`
          }}>{server.id}</Button>
      </Popover>
    </div>
  )
}

export default styled(Server)`
  position: absolute;
  
  .server {
    width: ${SERVER_SIZE}px;
    height: ${SERVER_SIZE}px;
    z-index: 2;
  }

  .server.up{
    border: 3px solid black;
  }

  .server.down{
    border-colr: #d9d9d9;
    background-color: #e3e8e7;
    color: rgba(0, 0, 0, 0.25);
  }
`;