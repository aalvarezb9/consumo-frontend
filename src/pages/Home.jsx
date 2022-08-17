
import { useEffect, useState } from 'react'
import MyCard from '../components/MyCard/MyCard'
import Title from '../components/Title/Title'
import '../styles/home.css'
import { del, get, post } from '../utils/fetch'

const initialProduct = {
    name: '',
    energy: '',
    categoryId: ''
}

const tarifa = 5.98

const Home = () => {

    const [users, setUsers] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userToAdd, setUserToAdd] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [categories, setCategories] = useState(null);
    const [currentCategory, setCurrentCategory] = useState('0');
    const [productToAdd, setProductToAdd] = useState(initialProduct);
    const [calculations, setCalculations] = useState(0);
    const [nProducts, setNProducts] = useState(0);
    const [dinero, setDinero] = useState(0);

    const handleAddUser = async () => {
        if (userToAdd === '') {
            alert('Ingrese un nombre')
            return false;
        }
        setButtonDisabled(true)
        const user = await post('users', {name: userToAdd})
        await getUsers()
        setCurrentUser(user.id)
        setButtonDisabled(false)
        setUserToAdd('')
    }

    const handleDeleteUser = async () => {
        const user = await del('users', currentUser)
        await getUsers()
        return
    }

    const handleProductToAdd = (e) => {
        setProductToAdd(
            prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            })
        )
    }

    const handleAddProduct = async () => {
        if (productToAdd.name.trim() === '' || productToAdd.energy.trim() === '' || currentCategory === '') {
            alert('Llene todos los campos')
            return false
        }
        productToAdd.categoryId = currentCategory
        await post('appliances', productToAdd)
        setProductToAdd(initialProduct)
        alert('Producto agregado')
        return false
    }

    const getCategories = async () => {
        const categories = await get('categories')
        setCategories(categories)
    }

    const getUsers = async () => {
        const users = await get('users')
        setUsers(users)
        setCurrentUser(users[0].id || null)
    }

    const getCalculations = async () => {
        const calculationss = currentUser ? await get('calculations', currentUser): null;
        if (calculationss) {
            setCalculations(calculationss.result / 1000)
            setNProducts(calculationss.n)
            setDinero(calculationss.result / 1000 * tarifa)
        }
    }

    useEffect(() => {
        Promise.all([
            getCategories(),
            getUsers(),
            getCalculations()
        ])
    }, []);

    useEffect(() => {
        getCalculations()
    }, [currentUser]);
    
  return (
    <div className='home'>
        <div className="home-header">
            <Title />
            <div className="home-add">
                <div className="home-users">
                    <h3>Usuarios</h3>
                    <select onChange={(e) => setCurrentUser(e.target.value)} name="names" id="names">
                        {users && users.map((user, i) => (
                            <option 
                                key={i} 
                                value={user.id}>
                                {user.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleDeleteUser}>X</button><br />
                    <input 
                        onChange={(e) => setUserToAdd(e.target.value)} 
                        type="text" 
                        placeholder='Nombre' 
                        value={userToAdd}
                    />
                    <button disabled={buttonDisabled} onClick={handleAddUser}>+</button>
                </div>
                <div className="home-appliances">
                    <h3>Productos</h3>
                    <input 
                        onChange={(e) => handleProductToAdd(e)}
                        type="text"
                        placeholder='Nombre del producto'
                        name='name'
                        value={productToAdd.name}
                    />
                    <input
                        onChange={(e) => handleProductToAdd(e)}
                        type="text"
                        placeholder='Energía en Watts'
                        name='energy'
                        value={productToAdd.energy}
                    />
                    <select onChange={(e) => setCurrentCategory(e.target.value)} name="categories" id="categories">
                        {categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                        <option value="0">Seleccione una categoría...</option>
                    </select>
                    <button disabled={buttonDisabled} onClick={handleAddProduct}>+</button>
                </div>
            </div>
        </div>
        <div className="cards-grid">
            {
                categories && 
                categories.map((category) => (
                    <MyCard
                        key={category.id}
                        id={category.id}
                        title={category.name}
                        currentUser={currentUser}
                        getCalculations={getCalculations}
                    />
                ))
            }
        </div>
        <div className="resultados">
            <p>{calculations && calculations} KWH</p>
            <p>{nProducts && nProducts} electrodomésticos</p>
            <p>{calculations && dinero} lempiras</p>
        </div>
    </div>
  )
}

export default Home