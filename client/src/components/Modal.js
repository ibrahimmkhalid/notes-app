import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React from 'react'
import ReactDom from 'react-dom'

const Modal = ({ open, children, onClose, width = "600px" }) => {
  if (!open) return null
  const modalContentStyles = {
    maxWidth: width
  }

  return ReactDom.createPortal(
    <>
      <div className='modal-background' />
      <div className='modal-content' style={modalContentStyles}>
        <button className='modal-close-button' onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default observer(Modal)
