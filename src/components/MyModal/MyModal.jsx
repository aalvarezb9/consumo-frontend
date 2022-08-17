import './modal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Card, Form } from 'react-bootstrap';
import { Component, useEffect, useState } from 'react';
import { get, post } from '../../utils/fetch';
import Table from 'react-bootstrap/Table';

const initialModal = {
  selectedProduct: '',
  cantidad: '',
  horas: ''
}

const MyModal = ({title, id, show, setShow, currentUser, getCalculations_}) => {

  const [info, setInfo] = useState(initialModal)
  const [products, setProducts] = useState(null)
  const [disabledButton, setDisabledButton] = useState(false)
  const [calculations, setCalculations] = useState(null);
  const [value, setValue] = useState('0')
  const [kwhs, setKwhs] = useState(0);

    const getProducts = async () => {
      const products = await get(`appliances?category=${id}`)
      setProducts(products)
    }

    const getCalculations = async () => {
      const calculations = await get(`calculations/${currentUser}/categories/${id}`)
      setCalculations(calculations)
      
    }
    
    useEffect(() => {
      getProducts()
      if (show) getCalculations()
    }, [show])

    const handleClose = () => {
      setShow(false)
    }

    const switchButtonStatus = (status) => setDisabledButton(status)

    const handleChange = (e) => {
      setInfo(
        prevState => ({
          ...prevState,
          [e.target.name]: e.target.value
        })
      );
    }

    const validateModalInfo = () => {
      const {cantidad, horas} = info
      if (cantidad.trim() === '' || horas.trim() === '' || value === '0') return false;
      return true;
    }

    const handleSave = async () => {
      switchButtonStatus(true)
      if (!validateModalInfo()) {
        alert('Llene todos los valores')
        switchButtonStatus(false)
        return false;
      }
      // Hacer petición para guardar
      const appliance = await get('appliances', value)
      await post('calculations', {
        watts: appliance.energy,
        qty: info.cantidad,
        hours: info.horas,
        applianceId: value,
        userId: currentUser
      })
      getCalculations_()
      switchButtonStatus(false)
      handleClose()
      setInfo(initialModal)
      setValue('0')
    }
    
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            name='selectedProduct' 
            aria-label="Seleccione un producto"
          >
            <option value='0'>Seleccione una opción</option>
            { products &&
                products.map((appliance) => (
                    <option key={appliance.id} value={appliance.id}>
                      {appliance.name.toUpperCase()} {appliance.energy}W
                    </option>
                ))
            }
        </Form.Select>
        <div className="modal-inputs">
          <input 
            onChange={(e) => handleChange(e)}
            type="number" 
            name="cantidad" 
            id="cantidad" 
            placeholder='Cantidad'
            value={info.cantidad} 
          />
          <input 
            onChange={(e) => handleChange(e)}
            type="number" 
            name="horas" 
            id="horas" 
            placeholder='Horas'
            value={info.horas} 
          />
        </div>
        <div className="modal-table">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Horas</th>
                <th>Consumo</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                calculations &&
                calculations.map((calculation, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{calculation.product}</td>
                    <td>{calculation.hours}</td>
                    <td>{calculation.energy}W</td>
                    <td>{calculation.qty}</td>
                    <td>{calculation.total}</td>
                  </tr>
                )) 
              }
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Card.Footer>
          <p>{calculations && calculations.reduce((prev, curr) => curr.total / 1000 + prev, 0)} KWH</p>
          <p>{calculations && calculations.length} electrodomésticos</p>
        </Card.Footer>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button disabled={disabledButton} variant="primary" onClick={handleSave}>
          Añadir
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyModal