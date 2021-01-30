import CloseIcon from './Close'
import ErrorIcon from './ErrorIcon'
import InfoIcon from './InfoIcon'
import SuccessIcon from './SuccessIcon'


// interface optionsType{
//   position: string,
//   timeout: number,
//   offset: string, 
//   transition: string
// }

// interface Props {
//   style: string,
//   options: optionsType,
//   message: string,

// }

const alertStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '300px',
  boxSizing: 'border-box'
}

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
}

const AlertTemplate = ({ style, options, message, close }:any ) => {

  return(
    <div style={{ ...alertStyle, ...style }}>
      {options.type === 'info' && <InfoIcon />}
      {options.type === 'success' && <SuccessIcon />}
      {options.type === 'error' && <ErrorIcon />}
      {message}
      <button style={buttonStyle} onClick={close}><CloseIcon /></button>
    </div>
  )

}

export default AlertTemplate