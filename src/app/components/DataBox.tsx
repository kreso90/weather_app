import React from 'react'
import { IconType } from 'react-icons'

type BoxData = {
  icon: IconType;
  title: string;
  dataNumber: string;
}

export default function DataBox({icon: Icon, title, dataNumber}: BoxData) {
  return (
    <div className="box">
      <div className="box__title">
          <Icon size={22} />
          {title}
      </div>
      <div className="box__content">
          {dataNumber}
      </div>
    </div>
  )
}
