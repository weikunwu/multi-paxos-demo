import React, { useState } from 'react';

import {
  Button,
  Input,
} from 'antd';
import styled from 'styled-components';

const ProposePopover = ({ className, handlePropose }) => {

  const [val, setVal] = useState()

  const handleClear = () => {
    setVal();
  }
  return (
    <div className={className}>
      <Input
        value={val}
        onChange={(e) => {
          setVal(e.target.value)
        }}
      />
      <Button
        disabled={!val}
        type="primary"
        onClick={() => {
          handlePropose(val);
          setVal();
        }}
      >Propose</Button>
      <Button onClick={handleClear}>Clear</Button>
    </div>
  )
}

export default styled(ProposePopover)`
  display: flex;
  flex-direction: row;
  input{
    margin-right: 10px;
  }
  button {
    margin-left: 10px;
  }
`;