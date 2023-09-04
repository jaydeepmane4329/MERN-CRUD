import React from 'react'
import "../App.css"
import { MdClose } from "react-icons/md";

const Form = ({ handleSubmit, handleChange, handleClose, rest, handleImage }) => {
    return (
        <div className="addContainer" >
            <form onSubmit={handleSubmit} action='/' method='post' encType="multipart/form-data">
                <div className="close-btn" onClick={handleClose}><MdClose /></div>
                <label htmlFor="Employee">Employee NO : </label>
                <input type="number" id="employee" name="employee" onChange={handleChange} value={rest.employee} />

                <label htmlFor="name">Name : </label>
                <input type="text" id="name" name="name" onChange={handleChange} value={rest.name} />

                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" onChange={handleChange} value={rest.email} />

                <label htmlFor="photo">Photo: </label>
                <input type="file" id="Photo" name="photo" onChange={handleImage} accept="image/*" />

                <label htmlFor="phoneNumber">Phone Number: </label>
                <input type="number" id="phoneNumber" name='phoneNumber' maxLength="10" onChange={handleChange} value={rest.phoneNumber} />

                <label htmlFor="birthDate">Birth Date: </label>
                <input type="date" id="birthDate" name="birthDate" min="1950-01-01" max="2004-01-01" onChange={handleChange} value={rest.birthDate} />

                <button className="btn" type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Form
