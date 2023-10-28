import React from 'react';

import { Button } from 'antd';
import {
  AiOutlineCheck,
  AiOutlineClose,
} from 'react-icons/ai';
import {
  GiRabbit,
  GiTurtleShell,
} from 'react-icons/gi';

import LabelIconSlider from './LabelIconSlider';

const PaxosSetting = () => {

  return (
    <div className='paxos-setting-container' >
      <Button type="primary">Start</Button>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
      />
      <LabelIconSlider
        leftIcon={<AiOutlineClose />}
        rightIcon={<AiOutlineCheck />}
        label='Message Drop Rate'
      />
    </div>
  )
}

export default PaxosSetting;