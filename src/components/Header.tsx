import React, { CSSProperties } from 'react'

interface Props {
  name: string
}

const headerStyle = {
  background: '#cccc',
  padding: '10px'
} as CSSProperties

const Header = ({ name }: Props) => {
  return (
    <section style={headerStyle}>
      <h2>{name}'s Challenge</h2> 
    </section>
  )
}

export default Header