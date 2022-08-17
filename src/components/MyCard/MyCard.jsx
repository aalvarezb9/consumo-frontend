import Card from 'react-bootstrap/Card';
import {RiLightbulbFlashLine, RiComputerFill} from 'react-icons/ri'
import { BiFridge } from "react-icons/bi";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import './my-card.css'
import { useState } from 'react';
import MyModal from '../MyModal/MyModal';

const MyCard = ({title, id, currentUser, getCalculations}) => {

  const [show, setShow] = useState(false);
  
  const handleShow = () => setShow(true)
    
  return (
    <>
      <div onClick={handleShow}>
        <Card className='my-custom-card' style={{ width: '18rem'}}>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
              { title === 'Iluminación' ? <RiLightbulbFlashLine className='icon-customized' />: 
                title === 'Cocina' ? <BiFridge className='icon-customized' />:
                title === 'Línea blanca' ? <MdOutlineLocalLaundryService className='icon-customized' />:
                <RiComputerFill className='icon-customized' />
              }
            </Card.Text>
            {/* <Card.Footer>
                <p>{'0'} KWH</p>
                <p>{'0'} electrodomesticos</p>
            </Card.Footer> */}
          </Card.Body>
        </Card>
      </div>
      <MyModal 
        title={title} 
        id={id} 
        show={show} 
        setShow={setShow}
        currentUser={currentUser}
        getCalculations_={getCalculations}
      />
    </>
    
    
  )
}

export default MyCard