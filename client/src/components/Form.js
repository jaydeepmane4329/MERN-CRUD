import React from 'react'
import "../App.css"
import { MdClose } from "react-icons/md";

const Form = ({ handleSubmit, handleChange, handleClose, rest, handleImage, disable }) => {
    return (
        <div className="addContainer" >
            <form onSubmit={handleSubmit} action='/' method='post' encType="multipart/form-data">
                <div className="close-btn" onClick={handleClose}><MdClose /></div>
                <label htmlFor="Employee">Employee NO : </label>
                <input type="number" id="employee" name="employee" onChange={handleChange} value={rest.employee} required />

                <label htmlFor="name">Name : </label>
                <input type="text" id="name" name="name" pattern="^[a-zA-Z_ ]*$" onChange={handleChange} value={rest.name} required />

                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" onChange={handleChange} value={rest.email} required />

                <label htmlFor="photo">Photo: </label>
                <input type="file" id="Photo" name="photo" onChange={handleImage} accept="image/*" required />

                <label htmlFor="phoneNumber">Phone Number: </label>
                <input type="number" id="phoneNumber" name='phoneNumber' maxLength="10" onChange={handleChange} value={rest.phoneNumber} required />

                <label htmlFor="birthDate">Birth Date: </label>
                <input type="date" id="birthDate" name="birthDate" min="1950-01-01" max="2004-01-01" onChange={handleChange} value={rest.birthDate} required />

                <button className={!disable ? 'btn-disable' : 'btn'} type='submit' disabled={!disable}>Submit</button>
            </form>
        </div>
    )
}

export default Form
