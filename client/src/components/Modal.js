import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import ReactDom from 'react-dom'

const Modal = ({ open, children, onClose }) => {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div className='modal-background' />
      <div className='modal-content'>
        <button className='modal-close-button' onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
