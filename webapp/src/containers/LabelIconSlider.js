import React from 'react';

import { Slider } from 'antd';

const LabelIconSlider = ({
  leftIcon,
  rightIcon,
  label,
  min,
  max,
  handleChange,
}) => {

  return (
    <div className='speed-slider-container'>
      <h4>{label}</h4>
      <div className='slider-container'>
        {leftIcon}
        <Slider
          className='slider'
          min={min}
          max={max}
          onChange={(value) => {
            handleChange(value);
          }} />
        {rightIcon}
      </div>
    </div>
  )
}

export default LabelIconSlider;