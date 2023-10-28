import React from 'react';

import { Slider } from 'antd';

const LabelIconSlider = ({
  leftIcon,
  rightIcon,
  label
}) => {

  return (
    <div className='speed-slider-container'>
      <h4>{label}</h4>
      <div className='slider-container'>
        {leftIcon}
        <Slider className='slider' />
        {rightIcon}
      </div>
    </div>
  )
}

export default LabelIconSlider;