
import './App.css'
import { useState,useEffect } from 'react'
import axios from "axios"

function App() {
  const [users,setUsers] = useState([])
  const [filteredUsers,setFilteredusers] = useState([])
  const [modalData,setModaldata] = useState(false)
  const [userData,setUserData] = useState({ name : " ",age: " ",city: " "})

  const getAllUsers = async () => {
    await axios.get("http://localhost:3000/users")
    .then((res) => {
      setFilteredusers(res.data)
      setUsers(res.data)
    })
  }
useEffect(()=>{
  getAllUsers();
},[])

//Search Text

const handleSearchChange = (e) => {
  const searchText = e.target.value.toLowerCase();
  const filterText = users.filter((user) => user.name.toLowerCase().includes(searchText) ||  user.city.toLowerCase().includes(searchText));
  setFilteredusers(filterText)
}

//Delete Record

const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  if (isConfirmed) {
    await axios.delete(`http://localhost:3000/users/${id}`)
      .then((res) => {
        setFilteredusers(res.data);
        setUsers(res.data);
      })
  }
}

//Add Record

const handleAddRecord = () => {
  setUserData({ name : " ",age: " ",city: " "})
  setModaldata(true)
}

//Modal Record

const handleModalClose = () => {
  setModaldata(false)
  getAllUsers();
}
//HandleData

const handleData = (e) => {
  setUserData({...userData, [e.target.name] : e.target.value})
}

//Update Record

const handleUpdateRecord = (user) => {
  setUserData(user)
  setModaldata(true)

}

//Submit Data

const handleSubmit = async(e) => {
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:3000/users/${userData.id}`,userData).then((req,res) => {
      console.log(res)
    })

  }else{
    await axios.post("http://localhost:3000/users",userData).then((req,res) => {
      console.log(res)
    })
  }
  handleModalClose();
  setUserData({ name : " ",age: " ",city: " "})

  

}
  return (
    <>
      <div className='container'>
        <h3>CRUD Application with React js and Node js</h3>
        <div className="input-search">
          <input type='search' placeholder='Search record here...' onChange={handleSearchChange}/>
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'> 
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.map((user,index) =>{ 
              return (
              <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td><button className='btn green' onClick={() => handleUpdateRecord(user)}>Edit</button></td>
              <td><button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button></td>
            </tr>
              )
            })}
            
          </tbody>
        </table>
        {modalData && (
          <div className='modal'>
            <div className='modal-content'>
              <span className='close' onClick={handleModalClose}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
              <div className='input-group'>
                <label htmlFor='name'>Full Name  :</label>
                <input type="text" name='name' value = {userData.name} id='name' onChange={handleData}/>

              </div>
              <div className='input-group'>
                <label htmlFor='age'>Age  :</label>
                <input type="number" name='age' id='age' value = {userData.age} onChange={handleData}/>

              </div>
              <div className='input-group'>
                <label htmlFor='city'>city  :</label>
                <input type="text" name='city' id='city' value = {userData.city} onChange={handleData} />

              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id ? "Update Record" : "Add Record"}</button>
              </div>
            </div>
        )}
      </div>
    
    </>
  )
}

export default App
