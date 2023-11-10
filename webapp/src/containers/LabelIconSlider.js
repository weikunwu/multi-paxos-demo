import React from 'react';

import { Slider } from 'antd';
import styled from 'styled-components';

const LabelIconSlider = ({
  leftIcon,
  rightIcon,
  label,
  min,
  max,
  step,
  handleChange,
  className
}) => {

  return (
    <div className={`labeled-slider-container ${className}`}>
      <h4>{label}</h4>
      <div className='slider-container'>
        {leftIcon}
        <Slider
          className='slider'
          min={min}
          max={max}
          step={step}
          onChange={(value) => {
            handleChange(value);
          }} />
        {rightIcon}
      </div>
    </div>
  )
}

export default styled(LabelIconSlider)`
  .slider-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .slider {
      width: 100%;
      margin-left: 15px;
      margin-right: 15px;
    }
  }
`;